import { makeWASocket, useMultiFileAuthState, fetchLatestBaileysVersion } from '@whiskeysockets/baileys';
import fs from 'fs';
import path from 'path';

const __dirname = path.resolve();
const sessionFolder = path.join(__dirname, 'GataJadiBot');

const handler = async (m, { conn }) => {
    try {
        const sender = m.sender.replace(/[^0-9]/g, '');
        const userSessionPath = path.join(sessionFolder, sender);
        
        // Verificación mejorada de sesión activa
        const isSessionActive = () => {
            if (!fs.existsSync(userSessionPath)) return false;
            try {
                const creds = fs.readFileSync(path.join(userSessionPath, 'creds.json'), 'utf8');
                return creds && JSON.parse(creds).me?.id;
            } catch {
                return false;
            }
        };

        if (isSessionActive()) {
            return conn.reply(m.chat, 
                '⚠️ *Sesión activa detectada*\n\n' +
                'Parece que ya tienes una sesión vinculada.\n' +
                'Usa el comando *.logout* para desconectar antes de vincular una nueva sesión.\n\n' +
                'Si crees que esto es un error, elimina manualmente la carpeta:\n' +
                `*GataBot_sessions/${sender}*`,
                m
            );
        }

        // Limpieza previa de sesión
        if (fs.existsSync(userSessionPath)) {
            fs.rmSync(userSessionPath, { recursive: true, force: true });
        }

        fs.mkdirSync(userSessionPath, { recursive: true });

        const { state, saveCreds } = await useMultiFileAuthState(userSessionPath);
        const { version } = await fetchLatestBaileysVersion();

        const sock = makeWASocket({
            printQRInTerminal: true, // Para depuración
            auth: {
                creds: state.creds,
                keys: state.keys,
            },
            browser: ['GataBot', 'Chrome', '121.0.0.0'],
            version: version,
            syncFullHistory: false
        });

        sock.ev.on('creds.update', saveCreds);
        sock.ev.on('connection.update', (update) => {
            if (update.connection === 'close') {
                console.log('Conexión cerrada:', update.lastDisconnect?.error);
            }
        });

        // Generar código con timeout
        const pairingCode = await Promise.race([
            sock.requestPairingCode(sender),
            new Promise((_, reject) => 
                setTimeout(() => reject(new Error('Tiempo de espera agotado')), 30000)
        ]);

        const formattedCode = pairingCode.match(/.{1,4}/g).join('-');

        // Mensaje mejorado
        const responseMsg = `*🔐 CÓDIGO DE VINCULACIÓN GATABOT*\n\n` +
            `✨ *Código:* \`${formattedCode}\`\n\n` +
            `📱 *Cómo vincular:*\n` +
            `1. Abre WhatsApp > Ajustes\n` +
            `2. Dispositivos vinculados > Vincular con número\n` +
            `3. Ingresa este código exactamente como aparece\n\n` +
            `⏳ *Válido por 2 minutos*\n` +
            `🔒 *Solo para tu uso personal*\n\n` +
            `⚠️ *Si tienes problemas:*\n` +
            `- Verifica la hora de tu teléfono\n` +
            `- Reinicia WhatsApp\n` +
            `- Intenta en modo avión por 5 segundos`;

        const sentMsg = await conn.sendMessage(m.chat, { 
            text: responseMsg,
            mentions: [m.sender]
        }, { quoted: m });

        // Autoeliminación mejorada
        setTimeout(async () => {
            try {
                await conn.sendMessage(m.chat, { delete: sentMsg.key });
                await sock.end();
                fs.rmSync(userSessionPath, { recursive: true, force: true });
            } catch (e) {
                console.log('Error en limpieza:', e);
            }
        }, 120000);

    } catch (error) {
        console.error('Error en comando code:', error);
        
        let errorMsg = '❌ *Error al generar código*';
        if (error.message.includes('timed out')) {
            errorMsg = '⌛ *Tiempo agotado*\nEl servidor no respondió. Intenta nuevamente.';
        } else if (error.message.includes('401') || error.message.includes('creds')) {
            errorMsg = '🔐 *Error de autenticación*\nPor favor usa *.logout* y vuelve a intentar.';
        } else if (error.message.includes('ENOENT')) {
            errorMsg = '📁 *Error de sistema*\nEl bot no puede crear archivos necesarios.';
        }
        
        await conn.reply(m.chat, errorMsg + '\n\n' + 
            'Si el problema persiste, contacta al soporte.', m);
    }
};

handler.help = ['code'];
handler.tags = ['herramientas'];
handler.command = /^(code|codigo|vincular)$/i;
handler.owner = false;

export default handler;
