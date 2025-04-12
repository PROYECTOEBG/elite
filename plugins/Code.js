import { makeWASocket, useMultiFileAuthState, fetchLatestBaileysVersion } from '@whiskeysockets/baileys';
import fs from 'fs';
import path from 'path';

const __dirname = path.resolve();
const sessionFolder = path.join(__dirname, 'GataJadibot');

export async function generatePairingCode(userId) {
    // Configuración de la carpeta de sesión
    const userSessionPath = path.join(sessionFolder, userId);
    if (!fs.existsSync(userSessionPath)) {
        fs.mkdirSync(userSessionPath, { recursive: true });
    }

    // Obtener versión más reciente de Baileys
    const { version } = await fetchLatestBaileysVersion();

    // Configuración de autenticación
    const { state, saveCreds } = await useMultiFileAuthState(userSessionPath);

    // Opciones de conexión
    const sock = makeWASocket({
        printQRInTerminal: false,
        auth: {
            creds: state.creds,
            keys: state.keys,
        },
        browser: ['Ubuntu', 'Chrome', '110.0.5585.95'],
        version: version
    });

    // Generar código de vinculación
    try {
        const pairingCode = await sock.requestPairingCode(userId.replace(/[^0-9]/g, ''));
        const formattedCode = pairingCode.match(/.{1,4}/g).join('-');
        
        return {
            success: true,
            code: formattedCode,
            message: `*⪉ Código de Vinculación ⪊*\n\n` +
                    `🔢 *Código:* ${formattedCode}\n\n` +
                    `1. Abre WhatsApp > Ajustes > Dispositivos vinculados\n` +
                    `2. Selecciona "Vincular con número de teléfono"\n` +
                    `3. Ingresa este código\n\n` +
                    `⚠️ *Expira en 30 segundos*`
        };
    } catch (error) {
        return {
            success: false,
            message: 'Error al generar el código: ' + error.message
        };
    }
}

// Ejemplo de uso en un handler
async function codeHandler(m, conn) {
    const userId = m.sender.replace(/[^0-9]/g, '');
    const result = await generatePairingCode(userId);
    
    if (result.success) {
        // Enviar código con autoeliminación
        const sentMsg = await conn.sendMessage(m.chat, {
            text: result.message
        }, { quoted: m });
        
        // Autoeliminar después de 30 segundos
        setTimeout(async () => {
            try {
                await conn.sendMessage(m.chat, {
                    delete: sentMsg.key
                });
            } catch (e) {
                console.error('Error al eliminar mensaje:', e);
            }
        }, 30000);
    } else {
        await conn.reply(m.chat, result.message, m);
    }
}

// Configuración del comando
const codeCommand = {
    name: 'code',
    alias: ['codigo', 'vinculacion'],
    description: 'Genera un código para vincular como Sub-Bot',
    category: 'Herramientas',
    usage: '.code',
    async handle(m, conn) {
        await codeHandler(m, conn);
    }
};

export default codeCommand;
