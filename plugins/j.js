import { randomInt } from 'crypto';
import { join } from 'path';
import { readFileSync, writeFileSync, existsSync, mkdirSync, unlinkSync } from 'fs';
import { makeWASocket, useSingleFileAuthState } from '@whiskeysockets/baileys';

const handler = async (m, { conn, usedPrefix, command, args }) => {
    // Verificación de propietario
    if (!global.db.data.settings[conn.user.jid].jadibotmd) {
        return m.reply('🚫 *Acceso denegado*: Solo el propietario puede usar este comando.');
    }

    // Configuración de rutas
    const userDir = join('./GataJadiBot/', m.sender.split('@')[0]);
    const codeFile = join(userDir, 'codigo_letras.txt');
    const stateFile = join(userDir, 'auth_info.json');

    // Crear directorio si no existe
    if (!existsSync(userDir)) {
        mkdirSync(userDir, { recursive: true });
    }

    // Generar código alfanumérico seguro
    const generateCode = () => {
        const prefix = 'JADI-';
        const letters = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Base32 simplificado
        let code = '';
        
        for (let i = 0; i < 6; i++) { // Código más largo para mayor seguridad
            code += letters.charAt(randomInt(0, letters.length));
        }
        
        return prefix + code;
    };

    // Función mejorada para vincular dispositivo
    const vincularDispositivo = async (codigo) => {
        try {
            // Usar credenciales existentes o crear nuevas
            const { state, saveState } = useSingleFileAuthState(stateFile);
            
            const sock = makeWASocket({
                printQRInTerminal: false,
                auth: state,
                browser: ['ELITE BOT GLOBAL', 'Chrome', '120.0.0'],
                markOnlineOnConnect: false
            });

            // Manejar eventos de conexión
            sock.ev.on('connection.update', (update) => {
                if (update.connection === 'close') {
                    console.error('Conexión cerrada durante vinculación');
                }
            });

            // Solicitar código de vinculación
            const pairingCode = await sock.requestPairingCode(m.sender.split('@')[0]);
            
            // Verificar coincidencia de códigos
            if (pairingCode === codigo.replace('JADI-', '').substring(0, pairingCode.length)) {
                await saveState();
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error en vinculación:', error);
            throw new Error('Error durante el proceso de vinculación');
        }
    };

    // Comando generarcodigo
    if (command === 'generarcodigo') {
        try {
            const codigo = generateCode();
            writeFileSync(codeFile, codigo);
            
            const mensaje = `🔐 *CÓDIGO DE VINCULACIÓN* 🔐\n\n` +
                           `✨ *${codigo}* ✨\n\n` +
                           `1. Abre WhatsApp Web/Desktop\n` +
                           `2. Selecciona "Vincular con código"\n` +
                           `3. Ingresa: *${codigo.replace('JADI-', '')}*\n\n` +
                           `⚠️ Válido por 5 minutos`;
            
            await conn.sendMessage(m.chat, { 
                text: mensaje,
                contextInfo: {
                    externalAdReply: {
                        title: 'ELITE BOT GLOBAL',
                        body: 'Vinculación Segura',
                        thumbnail: readFileSync('./media/menus/Menu2.jpg'),
                        mediaType: 1
                    }
                }
            }, { quoted: m });

            setTimeout(() => {
                if (existsSync(codeFile)) unlinkSync(codeFile);
            }, 300000);

        } catch (e) {
            console.error('Error generando código:', e);
            await m.reply('❌ Error al generar código de vinculación');
        }

    // Comando verificarcodigo
    } else if (command === 'verificarcodigo') {
        if (!args[0]) return m.reply(`📌 Uso: ${usedPrefix}verificarcodigo JADI-ABCDEF`);
        
        if (!existsSync(codeFile)) return m.reply('⚠️ No hay código pendiente');
        
        const codigoGuardado = readFileSync(codeFile, 'utf-8').trim();
        const codigoIngresado = args[0].toUpperCase();
        
        if (codigoIngresado === codigoGuardado) {
            try {
                const resultado = await vincularDispositivo(codigoIngresado);
                
                if (resultado) {
                    unlinkSync(codeFile);
                    await conn.sendMessage(m.chat, {
                        text: '✅ *VINCULACIÓN EXITOSA*\n\n¡Dispositivo vinculado correctamente!',
                        contextInfo: {
                            externalAdReply: {
                                title: 'ELITE BOT GLOBAL',
                                body: 'Vinculación completada',
                                thumbnail: readFileSync('./media/menus/Menu3.jpg'),
                                mediaType: 1
                            }
                        }
                    }, { quoted: m });
                } else {
                    await m.reply('❌ No se pudo completar la vinculación');
                }
            } catch (error) {
                console.error('Error en verificación:', error);
                await m.reply('⚠️ Error durante la vinculación. Intenta nuevamente.');
            }
        } else {
            await m.reply('❌ Código incorrecto');
        }
    }
};

handler.help = ['generarcodigo', 'verificarcodigo <código>'];
handler.tags = ['jadibot'];
handler.command = /^(generarcodigo|verificarcodigo)$/i;
handler.owner = false;

export default handler;
