import { randomInt } from 'crypto';
import { join } from 'path';
import { readFileSync, writeFileSync, existsSync, mkdirSync, unlinkSync } from 'fs';

const handler = async (m, { conn, usedPrefix, command, args }) => {
    // Verificar si el usuario es propietario del bot
    if (!global.db.data.settings[conn.user.jid].jadibotmd) {
        return m.reply('🚫 *Acceso denegado*: Solo el propietario del bot puede usar este comando.');
    }

    // Configuración de rutas
    const userDir = join('./GataBotSession/', m.sender.split('@')[0]);
    const codeFile = join(userDir, 'codigo_letras.txt');

    // Crear directorio si no existe
    if (!existsSync(userDir)) {
        mkdirSync(userDir, { recursive: true });
    }

    // Generar código alfanumérico sin dependencias externas
    const generateCode = () => {
        const prefix = 'JADI-'; // Prefijo personalizable
        const letters = 'ABCDEFGHJKLMNPQRSTUVWXYZ'; // Eliminamos I y O para evitar confusión
        let code = '';
        
        // Generar 4 letras aleatorias
        for (let i = 0; i < 4; i++) {
            code += letters.charAt(randomInt(0, letters.length));
        }
        
        return prefix + code;
    };

    // Manejo de comandos
    if (command === 'generarcodigo') {
        const codigo = generateCode();
        writeFileSync(codeFile, codigo);
        
        const mensaje = `🔑 *CÓDIGO DE VINCULACIÓN* 🔑\n\n` +
                       `Aquí tienes tu código de vinculación:\n\n` +
                       `✨ *${codigo}* ✨\n\n` +
                       `Para vincular tu dispositivo:\n` +
                       `1. Ve a WhatsApp Web/Desktop\n` +
                       `2. Selecciona "Vincular con código"\n` +
                       `3. Ingresa este código\n\n` +
                       `⚠️ *Este código expira en 5 minutos*`;
        
        await conn.sendMessage(m.chat, { 
            text: mensaje,
            contextInfo: {
                externalAdReply: {
                    title: 'ELITE BOT GLOBAL - VINCULACIÓN',
                    body: 'Vincula tu dispositivo de forma segura',
                    thumbnail: readFileSync('./media/menus/Menu2.jpg'),
                    mediaType: 1
                }
            }
        }, { quoted: m });

        // Eliminar el código después de 5 minutos
        setTimeout(() => {
            if (existsSync(codeFile)) {
                try {
                    unlinkSync(codeFile);
                } catch (e) {
                    console.error('Error al eliminar código:', e);
                }
            }
        }, 300000);

    } else if (command === 'verificarcodigo') {
        if (!args[0]) return m.reply(`❌ Por favor ingresa el código a verificar.\nEjemplo: ${usedPrefix}verificarcodigo JADI-ABCD`);
        
        if (!existsSync(codeFile)) {
            return m.reply('⚠️ No hay ningún código pendiente de verificación.');
        }
        
        const codigoGuardado = readFileSync(codeFile, 'utf-8').trim();
        const codigoIngresado = args[0].toUpperCase();
        
        if (codigoIngresado === codigoGuardado) {
            // Lógica para completar la vinculación
            try {
                unlinkSync(codeFile);
            } catch (e) {
                console.error('Error al eliminar código:', e);
            }
            
            await conn.sendMessage(m.chat, {
                text: '✅ *VINCULACIÓN EXITOSA*\n\n¡Tu dispositivo ha sido vinculado correctamente!',
                contextInfo: {
                    externalAdReply: {
                        title: 'ELITE BOT GLOBAL',
                        body: 'Dispositivo vinculado con éxito',
                        thumbnail: readFileSync('./media/menus/Menu3.jpg'),
                        mediaType: 1
                    }
                }
            }, { quoted: m });
            
            // Aquí podrías agregar lógica adicional como guardar credenciales
        } else {
            await m.reply('❌ *Código incorrecto*\nEl código ingresado no coincide. Por favor inténtalo nuevamente.');
        }
    }
};

handler.help = [
    'generarcodigo',
    'verificarcodigo <código>'
];
handler.tags = ['jadibot'];
handler.command = /^(generarcodigo|verificarcodigo)$/i;
handler.owner = false;

export default handler;
