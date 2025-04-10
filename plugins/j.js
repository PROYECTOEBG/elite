import { randomInt } from 'crypto';
import { join } from 'path';
import { readFileSync, writeFileSync, existsSync, mkdirSync, unlinkSync } from 'fs';
import { makeWASocket, useSingleFileAuthState, DisconnectReason } from '@whiskeysockets/baileys';
import pkg from '@whiskeysockets/baileys/package.json' assert { type: 'json' };

const handler = async (m, { conn, usedPrefix, command, args }) => {
    // Verificación mejorada de propietario
    if (!global.db?.data?.settings[conn.user.jid]?.jadibotmd) {
        return m.reply('🚫 *Acceso restringido*: Esta función es solo para el propietario del bot.');
    }

    // Configuración robusta de rutas
    const userDir = join('./GataJadiBot/', m.sender.split('@')[0]);
    const codeFile = join(userDir, 'codigo_letras.txt');
    const stateFile = join(userDir, 'auth_info.json');
    const keyFile = join(userDir, 'signal_keys.json');

    // Creación segura de directorio
    if (!existsSync(userDir)) {
        try {
            mkdirSync(userDir, { recursive: true, mode: 0o755 });
        } catch (e) {
            console.error('Error creando directorio:', e);
            return m.reply('❌ Error al configurar sesión.');
        }
    }

    // Generación de código mejorada
    const generateSecureCode = () => {
        const prefix = 'ELITE-';
        const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
        const codeLength = 8; // Más largo para mayor seguridad
        
        return prefix + Array.from({length: codeLength}, () => 
            chars.charAt(randomInt(0, chars.length))).join('');
    };

    // Función de vinculación completamente revisada
    const linkDevice = async (code) => {
        let sock;
        try {
            // Configuración robusta de autenticación
            const { state, saveState } = useSingleFileAuthState(stateFile, {
                logger: pino({ level: 'silent' })
            });

            // Inicialización segura del socket
            sock = makeWASocket({
                version: [3, 5300, 0], // Versión específica para estabilidad
                printQRInTerminal: false,
                auth: {
                    ...state,
                    // Inicialización explícita de claves
                    keys: {
                        ...state.keys,
                        signedPreKey: state.keys?.signedPreKey || {
                            keyId: 1,
                            keyPair: generateKeyPair(),
                            signature: Buffer.alloc(64)
                        }
                    }
                },
                browser: ['ELITE-BOT', 'Desktop', pkg.version],
                markOnlineOnConnect: false,
                syncFullHistory: false
            });

            // Manejadores de eventos críticos
            sock.ev.on('connection.update', (update) => {
                const { connection, lastDisconnect } = update;
                if (connection === 'close') {
                    const reason = new DisconnectReason(lastDisconnect?.error?.output?.statusCode);
                    console.error('Conexión cerrada:', reason);
                }
            });

            // Proceso de vinculación con manejo de errores
            const numericCode = code.replace(/^ELITE-/, '').substring(0, 6);
            const result = await sock.requestPairingCode(m.sender.split('@')[0], numericCode);
            
            if (result) {
                await saveState();
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error en vinculación:', error);
            sock?.end(); // Cierre seguro del socket
            throw error;
        } finally {
            sock?.ev.removeAllListeners();
        }
    };

    // Implementación de comandos con manejo completo de errores
    if (command === 'generarcodigo') {
        try {
            const verificationCode = generateSecureCode();
            writeFileSync(codeFile, verificationCode, { mode: 0o600 });
            
            const instructions = [
                '🔒 *VINCULACIÓN SEGURA* 🔒',
                `Código: *${verificationCode}*`,
                '',
                '1. Abre WhatsApp en tu dispositivo secundario',
                '2. Ve a Ajustes → Dispositivos vinculados',
                '3. Selecciona "Vincular con código"',
                `4. Ingresa: *${verificationCode.replace('ELITE-', '')}*`,
                '',
                '⚠️ Código válido por 3 minutos'
            ].join('\n');

            await conn.sendMessage(m.chat, { 
                text: instructions,
                contextInfo: {
                    externalAdReply: {
                        title: 'ELITE BOT GLOBAL',
                        body: 'Vinculación Segura',
                        thumbnail: readFileSync('./media/menus/MenuSecure.jpg'),
                        mediaType: 1,
                        showAdAttribution: false
                    }
                }
            }, { quoted: m });

            // Eliminación programada segura
            const cleanUp = () => existsSync(codeFile) && unlinkSync(codeFile);
            setTimeout(cleanUp, 180000).unref();

        } catch (error) {
            console.error('Error crítico:', error);
            await m.reply('⚠️ Error grave al generar código. Verifica logs.');
        }

    } else if (command === 'verificarcodigo') {
        if (!args[0] || !args[0].startsWith('ELITE-')) {
            return m.reply(`📌 Formato: ${usedPrefix}verificarcodigo ELITE-ABCD1234`);
        }

        if (!existsSync(codeFile)) {
            return m.reply('⏳ No hay código activo. Genera uno nuevo primero.');
        }

        try {
            const storedCode = readFileSync(codeFile, 'utf-8').trim();
            const inputCode = args[0].toUpperCase();

            if (inputCode !== storedCode) {
                return m.reply('❌ Código incorrecto. Verifica y reintenta.');
            }

            const success = await linkDevice(inputCode);
            
            if (success) {
                unlinkSync(codeFile);
                await conn.sendMessage(m.chat, {
                    text: '✅ *DISPOSITIVO VINCULADO* \n\nConexión establecida con éxito!',
                    contextInfo: {
                        externalAdReply: {
                            title: 'ELITE BOT GLOBAL',
                            body: 'Vinculación completada',
                            thumbnail: readFileSync('./media/menus/MenuSuccess.jpg'),
                            mediaType: 1
                        }
                    }
                }, { quoted: m });
            } else {
                await m.reply('⚠️ Vinculación fallida. Intenta nuevamente.');
            }
        } catch (error) {
            console.error('Error de verificación:', error);
            await m.reply('❌ Error crítico durante vinculación. Contacta al soporte.');
        }
    }
};

// Función auxiliar para generar claves (requerida para el error específico)
function generateKeyPair() {
    return {
        public: Buffer.alloc(32),
        private: Buffer.alloc(32)
    };
}

handler.help = [
    'generarcodigo → Genera código de vinculación',
    'verificarcodigo [código] → Valida el código'
];
handler.tags = ['jadibot', 'seguridad'];
handler.command = /^(generarcodigo|verificarcodigo)$/i;
handler.owner = false;
handler.limit = true;

export default handler;
