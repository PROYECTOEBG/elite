import { randomInt } from 'crypto';
import { join } from 'path';
import { readFileSync, writeFileSync, existsSync, mkdirSync, unlinkSync } from 'fs';
import { makeWASocket } from '@whiskeysockets/baileys';

const handler = async (m, { conn, usedPrefix, command, args }) => {
    // Verificar si el usuario es propietario del bot
    if (!global.db.data.settings[conn.user.jid].jadibotmd) {
        return m.reply('🚫 *Acceso denegado*: Solo el propietario del bot puede usar este comando.');
    }

    // Configuración de rutas
    const userDir = join('./JadiBotSessions/', m.sender.split('@')[0]);
    const codeFile = join(userDir, 'codigo_letras.txt');
    const stateFile = join(userDir, 'auth_info.json');

    // Crear directorio si no existe
    if (!existsSync(userDir)) {
        mkdirSync(userDir, { recursive: true });
    }

    // Generar código alfanumérico
    const generateCode = () => {
        const prefix = 'JADI-';
        const letters = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
        let code = '';
        
        for (let i = 0; i < 4; i++) {
            code += letters.charAt(randomInt(0, letters.length));
        }
        
        return prefix + code;
    };

    // Función para vincular dispositivo
    const vincularDispositivo = async (codigo) => {
        try {
            const sock = makeWASocket({
                printQRInTerminal: false,
                auth: {
                    creds: conn.authState.creds,
                    keys: conn.authState.keys
                }
            });

            const response = await sock.requestPairingCode(m.sender.split('@')[0]);
            
            if (response === codigo.replace('JADI-', '')) {
                // Guardar estado de autenticación
                writeFileSync(stateFile, JSON.stringify(sock.authState.creds, null, 2));
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error al vincular:', error);
            return false;
        }
    };

    // Manejo de comandos
    if (command === 'generarcodigo') {
        const codigo = generateCode();
        writeFileSync(codeFile, codigo);
        
        // Intentar vincular automáticamente
        const vinculado = await vincularDispositivo(codigo);
        
        const mensaje = vinculado 
            ? `✅ *VINCULACIÓN EXITOSA*\n\nCódigo: ✨ *${codigo}* ✨\n\nDispositivo vinculado correctamente!`
            : `🔑 *CÓDIGO DE VINCULACIÓN* 🔑\n\nCódigo: ✨ *${codigo}* ✨\n\nPara vincular:\n1. Ve a WhatsApp Web/Desktop\n2. Selecciona "Vincular con código"\n3. Ingresa este código\n\n⚠️ *Expira en 5 minutos*`;
        
        await conn.sendMessage(m.chat, { 
            text: mensaje,
            contextInfo: {
                externalAdReply: {
                    title: 'ELITE BOT GLOBAL - VINCULACIÓN',
                    body: vinculado ? 'Vinculación exitosa' : 'Vincula tu dispositivo',
                    thumbnail: readFileSync(vinculado ? './media/menus/Menu3.jpg' : './media/menus/Menu2.jpg'),
                    mediaType: 1
                }
            }
        }, { quoted: m });

        setTimeout(() => {
            if (existsSync(codeFile)) unlinkSync(codeFile);
        }, 300000);

    } else if (command === 'verificarcodigo') {
        if (!args[0]) return m.reply(`❌ Ingresa el código\nEjemplo: ${usedPrefix}verificarcodigo JADI-ABCD`);
        
        if (!existsSync(codeFile)) return m.reply('⚠️ No hay códigos pendientes');
        
        const codigoGuardado = readFileSync(codeFile, 'utf-8').trim();
        const codigoIngresado = args[0].toUpperCase();
        
        if (codigoIngresado === codigoGuardado) {
            const vinculado = await vincularDispositivo(codigoIngresado);
            
            if (vinculado) {
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
                await m.reply('❌ *Error en vinculación*\nNo se pudo completar la vinculación. Intenta nuevamente.');
            }
        } else {
            await m.reply('❌ *Código incorrecto*');
        }
    }
};

handler.help = ['generarcodigo', 'verificarcodigo <código>'];
handler.tags = ['jadibot'];
handler.command = /^(generarcodigo|verificarcodigo)$/i;
handler.owner = false;

export default handler;
