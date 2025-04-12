import { makeWASocket, useMultiFileAuthState, fetchLatestBaileysVersion } from '@whiskeysockets/baileys';
import fs from 'fs';
import path from 'path';
import { Boom } from '@hapi/boom';

const __dirname = path.resolve();
const sessionFolder = path.join(__dirname, 'GataJadibot');

async function generatePairingCode(userId, m, conn) {
    try {
        // 1. Configuración de directorio
        const userSessionPath = path.join(sessionFolder, userId);
        if (!fs.existsSync(userSessionPath)) {
            fs.mkdirSync(userSessionPath, { recursive: true });
        }

        // 2. Inicialización de sesión
        const { state, saveCreds } = await useMultiFileAuthState(userSessionPath);
        const { version } = await fetchLatestBaileysVersion();

        // 3. Creación del socket
        const sock = makeWASocket({
            printQRInTerminal: false,
            auth: {
                creds: state.creds,
                keys: state.keys,
            },
            browser: ['GataBot', 'Chrome', '120.0.0.0'],
            version: version,
            syncFullHistory: false,
            getMessage: async () => ({ conversation: 'GataJadibot' })
        });

        // 4. Manejo de eventos
        sock.ev.on('creds.update', saveCreds);
        sock.ev.on('connection.update', (update) => {
            if (update.connection === 'close') {
                if (update.lastDisconnect?.error?.output?.statusCode !== 401) {
                    generatePairingCode(userId, m, conn); // Reconexión
                }
            }
        });

        // 5. Generar código de vinculación
        const phoneNumber = userId.replace(/[^0-9]/g, '');
        const pairingCode = await sock.requestPairingCode(phoneNumber);
        const formattedCode = pairingCode.match(/.{1,4}/g).join('-');

        // 6. Mensaje de respuesta
        const responseMsg = `*🔑 CÓDIGO DE VINCULACIÓN GATABOT*\n\n`
            + `✨ *Código:* \`${formattedCode}\`\n\n`
            + `📱 *Cómo vincular:*\n`
            + `1. Ve a WhatsApp > Ajustes\n`
            + `2. Selecciona "Dispositivos vinculados"\n`
            + `3. Elige "Vincular con número de teléfono"\n`
            + `4. Ingresa este código\n\n`
            + `⚠️ *El código expira en 45 segundos*`;

        // 7. Enviar mensaje
        const sentMsg = await conn.sendMessage(m.chat, {
            text: responseMsg,
            mentions: [m.sender]
        }, { quoted: m });

        // 8. Autoeliminación después de 45 segundos
        setTimeout(async () => {
            try {
                await conn.sendMessage(m.chat, {
                    delete: sentMsg.key
                });
            } catch (e) {
                console.log('No se pudo eliminar el mensaje:', e);
            }
        }, 45000);

        return true;

    } catch (error) {
        console.error('Error en generatePairingCode:', error);
        
        // Manejo específico de errores
        let errorMsg = '❌ Error al generar el código de vinculación';
        if (error instanceof Boom) {
            if (error.output.statusCode === 401) {
                errorMsg = '⚠️ Sesión expirada. Por favor, vuelve a iniciar sesión.';
            } else if (error.output.statusCode === 403) {
                errorMsg = '🔒 Cuenta restringida. Verifica con WhatsApp oficial.';
            }
        }
        
        await conn.reply(m.chat, errorMsg, m);
        return false;
    }
}

// Handler del comando
const command = {
    name: 'code',
    alias: ['codigo', 'vincula'],
    desc: 'Genera un código para vincular tu cuenta como sub-bot',
    category: 'Herramientas',
    usage: '.code',
    async exec(m, conn) {
        try {
            // Verificar si ya existe sesión
            const userId = m.sender.replace(/[^0-9]/g, '');
            const userSessionPath = path.join(sessionFolder, userId);
            
            if (fs.existsSync(path.join(userSessionPath, 'creds.json'))) {
                return await conn.reply(m.chat, 
                    '⚠️ Ya tienes una sesión activa. Usa *.logout* primero si deseas vincular nuevamente.', 
                    m
                );
            }

            // Generar código
            await generatePairingCode(userId, m, conn);

        } catch (error) {
            console.error('Error en comando code:', error);
            await conn.reply(m.chat, 
                '❌ Ocurrió un error inesperado. Por favor, intenta nuevamente más tarde.', 
                m
            );
        }
    }
};

export default command;
