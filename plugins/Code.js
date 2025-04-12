import { makeWASocket, useMultiFileAuthState, fetchLatestBaileysVersion } from '@whiskeysockets/baileys';
import fs from 'fs';
import path from 'path';

// Configuración inicial
const __dirname = path.resolve();
const sessionFolder = path.join(__dirname, 'GataJadiBot');

// Handler principal
const handler = async (m, { conn, args, usedPrefix, command }) => {
    try {
        // Verificar si ya hay una sesión activa
        const sender = m.sender.replace(/[^0-9]/g, '');
        const userSessionPath = path.join(sessionFolder, sender);
        
        if (fs.existsSync(path.join(userSessionPath, 'creds.json'))) {
            return conn.reply(m.chat, 
                '⚠️ Ya tienes una sesión activa. Por favor, usa *.logout* primero si deseas vincular nuevamente.', 
                m
            );
        }

        // Crear directorio de sesión si no existe
        if (!fs.existsSync(userSessionPath)) {
            fs.mkdirSync(userSessionPath, { recursive: true });
        }

        // Configuración de la conexión
        const { state, saveCreds } = await useMultiFileAuthState(userSessionPath);
        const { version } = await fetchLatestBaileysVersion();

        const sock = makeWASocket({
            printQRInTerminal: false,
            auth: {
                creds: state.creds,
                keys: state.keys,
            },
            browser: ['GataJadibot', 'Chrome', '120.0.0.0'],
            version: version
        });

        // Manejo de eventos
        sock.ev.on('creds.update', saveCreds);
        sock.ev.on('connection.update', (update) => {
            const { connection, lastDisconnect } = update;
            if (connection === 'close') {
                if (lastDisconnect?.error?.output?.statusCode !== 401) {
                    // Reconectar si no fue un logout
                    setTimeout(() => handler(m, { conn }), 5000);
                }
            }
        });

        // Generar código de vinculación
        const pairingCode = await sock.requestPairingCode(sender);
        const formattedCode = pairingCode.match(/.{1,4}/g).join('-');

        // Mensaje de respuesta
        const responseMsg = `*🔐 CÓDIGO DE VINCULACIÓN PARA GATABOT*\n\n`
            + `✨ *Tu código:* \`${formattedCode}\`\n\n`
            + `📌 *Instrucciones:*\n`
            + `1. Abre WhatsApp en tu teléfono\n`
            + `2. Ve a Ajustes > Dispositivos vinculados\n`
            + `3. Selecciona "Vincular con número de teléfono"\n`
            + `4. Ingresa este código cuando te lo pidan\n\n`
            + `⚠️ *Este código expira en 2 minutos*\n`
            + `🔒 *No lo compartas con nadie*`;

        // Enviar mensaje con mención
        const sentMsg = await conn.sendMessage(m.chat, {
            text: responseMsg,
            mentions: [m.sender]
        }, { quoted: m });

        // Autoeliminar después de 2 minutos
        setTimeout(async () => {
            try {
                await conn.sendMessage(m.chat, {
                    delete: sentMsg.key
                });
                await sock.logout(); // Cerrar sesión después de expirar
            } catch (e) {
                console.log('Error al limpiar:', e);
            }
        }, 120000);

    } catch (error) {
        console.error('Error en comando code:', error);
        
        let errorMsg = '❌ Error al generar el código de vinculación';
        if (error.message.includes('401')) {
            errorMsg = '⚠️ Sesión no válida. Intenta reiniciar el bot.';
        } else if (error.message.includes('timed out')) {
            errorMsg = '⌛ Tiempo de espera agotado. Intenta nuevamente.';
        }
        
        await conn.reply(m.chat, errorMsg, m);
    }
};

// Configuración del comando
handler.help = ['code'];
handler.tags = ['herramientas'];
handler.command = /^(code|codigo|vincular)$/i;
handler.owner = false; // Cambiar a true si solo el dueño puede usarlo
handler.register = true;

export default handler;
