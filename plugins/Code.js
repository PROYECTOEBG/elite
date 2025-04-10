import { makeWASocket, useMultiFileAuthState, fetchLatestBaileysVersion, makeCacheableSignalKeyStore, DisconnectReason } from '@whiskeysockets/baileys'; import path from 'path'; import pino from 'pino'; import fs from 'fs'; import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url); const __dirname = path.dirname(__filename);

const handler = async (m, { conn, usedPrefix, command }) => { const number = m.sender; const sessionDir = path.join(__dirname, '../GataJadiBot'); const sessionPath = path.join(sessionDir, number.split('@')[0]); const rid = number.split('@')[0];

// Permitir reinicio con "sercode reset" if (/reset/i.test(command)) { try { fs.rmSync(sessionPath, { recursive: true, force: true }); await conn.sendMessage(m.chat, { text: '✅ Sesión limpiada. Ahora usa de nuevo sercode para vincular tu subbot.' }, { quoted: m }); return; } catch (e) { console.error('Error limpiando sesión:', e); await conn.sendMessage(m.chat, { text: '❌ No pude limpiar la sesión.' }, { quoted: m }); return; } }

try { if (!fs.existsSync(sessionDir)) { fs.mkdirSync(sessionDir, { recursive: true }); }

await m.react('⌛');

const { state, saveCreds } = await useMultiFileAuthState(sessionPath);
const { version } = await fetchLatestBaileysVersion();
const logger = pino({ level: "silent" });

// Forzar limpieza si ya aparece como registrado
if (state.creds?.registered) {
  console.log('Subbot parece estar registrado, forzando reinicio...');
  state.creds.registered = false;
  await saveCreds();

  try {
    const files = fs.readdirSync(sessionPath);
    files.forEach(file => {
      if (file !== 'creds.json') {
        fs.unlinkSync(path.join(sessionPath, file));
      }
    });
  } catch (err) {
    console.error('Error limpiando archivos de sesión:', err);
  }
}

const socky = makeWASocket({
  version,
  logger,
  auth: {
    creds: state.creds,
    keys: makeCacheableSignalKeyStore(state.keys, logger)
  },
  browser: ['Azura Ultra Subbot', 'Chrome', '3.0'],
  printQRInTerminal: false,
  generateHighQualityLinkPreview: true
});

let sentCodeMessage = false;

const handleConnectionUpdate = async (update) => {
  const { qr, connection, lastDisconnect } = update;

  if (qr && !sentCodeMessage) {
    try {
      const code = await socky.requestPairingCode(rid);

      await conn.sendMessage(m.chat, {
        video: { url: "https://cdn.russellxz.click/b0cbbbd3.mp4" },
        caption: "🔐 *Código generado:*\nAbre WhatsApp > Vincular dispositivo y pega el siguiente código:",
        gifPlayback: true
      }, { quoted: m });

      await new Promise(resolve => setTimeout(resolve, 1000));

      await conn.sendMessage(m.chat, {
        text: "```" + code + "```"
      }, { quoted: m });

      sentCodeMessage = true;
    } catch (error) {
      console.error('Error al generar o enviar código:', error);
      await m.react('❌');
    }
  }

  if (connection === "open") {
    try {
      await conn.sendMessage(m.chat, {
        text: `╭───〔 *🤖 SUBBOT CONECTADO* 〕───╮\n\n│\n│ ✅ Bienvenido a Azura Ultra 2.0\n│\n│ Ya eres parte del mejor sistema de juegos RPG\n│\n│ 🛠️ Usa los siguientes comandos para comenzar:\n│\n│ ${usedPrefix}help\n│ ${usedPrefix}menu\n│\n╰────✦ Azura Ultra Plus ✦────╯`
      }, { quoted: m });

      if (!global.conns) global.conns = [];
      global.conns.push(socky);

      await m.react('✅');
    } catch (error) {
      console.error('Error al enviar mensaje de conexión:', error);
      await m.react('❌');
    }
  }

  if (connection === "close") {
    const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
    if (shouldReconnect) {
      console.log('Conexión cerrada, intentando reconectar...');
      setTimeout(() => handleConnectionUpdate(update), 5000);
    }
  }
};

socky.ev.on('connection.update', handleConnectionUpdate);
socky.ev.on('creds.update', saveCreds);

} catch (error) { console.error('Error en serbot:', error); await m.react('❌'); await conn.sendMessage(m.chat, { text: ❌ *Error al conectar el sub-bot*\n\nPor favor intenta nuevamente o contacta al soporte. }, { quoted: m }); } };

handler.help = ['serbot']; handler.tags = ['subbots']; handler.command = /^(serbot|sercode|code|sercode reset)$/i; handler.premium = false; handler.admin = false;

export default handler;

