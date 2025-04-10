import {
  makeWASocket,
  useMultiFileAuthState,
  fetchLatestBaileysVersion,
  makeCacheableSignalKeyStore,
  DisconnectReason
} from '@whiskeysockets/baileys';
import path from 'path';
import pino from 'pino';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const handler = async (m, { conn, usedPrefix, command }) => {
  const number = m.sender;
  const sessionDir = path.join(__dirname, '../GataJadiBot');
  const sessionPath = path.join(sessionDir, number.split('@')[0]);
  const rid = number.split('@')[0];

  try {
    // Crear directorio si no existe
    if (!fs.existsSync(sessionDir)) {
      fs.mkdirSync(sessionDir, { recursive: true });
    }

    await m.react('⌛');

    const { state, saveCreds } = await useMultiFileAuthState(sessionPath);
    const { version } = await fetchLatestBaileysVersion();
    const logger = pino({ level: 'silent' });

    // Verifica si ya está registrado
    if (state.creds && state.creds.registered) {
      await conn.sendMessage(m.chat, {
        text: `⚠️ El número ya está vinculado.\n\nSi deseas vincularlo de nuevo, primero elimina la carpeta de sesión:\n*${sessionPath}*`,
      }, { quoted: m });
      await m.react('⚠️');
      return;
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

      if (!sentCodeMessage) {
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
          await conn.sendMessage(m.chat, {
            text: `❌ *Error al generar el código.*\n\nAsegúrate de que el número no esté ya vinculado o borra su sesión.`,
          }, { quoted: m });
        }
      }

      if (connection === 'open') {
        try {
          await conn.sendMessage(m.chat, {
            text: `╭───〔 *🤖 SUBBOT CONECTADO* 〕───╮

│  
│ ✅ Bienvenido a Azura Ultra 2.0  
│  
│ Ya eres parte del mejor sistema de juegos RPG  
│  
│ 🛠️ Usa los siguientes comandos para comenzar:  
│  
│ ${usedPrefix}help  
│ ${usedPrefix}menu  
│  
╰────✦ Azura Ultra Plus ✦────╯`
          }, { quoted: m });

          if (!global.conns) global.conns = [];
          global.conns.push(socky);

          await m.react('✅');
        } catch (error) {
          console.error('Error al enviar mensaje de conexión:', error);
          await m.react('❌');
        }
      }

      if (connection === 'close') {
        const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
        if (shouldReconnect) {
          console.log('Conexión cerrada, intentando reconectar...');
          setTimeout(() => handleConnectionUpdate(update), 5000);
        }
      }
    };

    socky.ev.on('connection.update', handleConnectionUpdate);
    socky.ev.on('creds.update', saveCreds);

  } catch (error) {
    console.error('Error en serbot:', error);
    await m.react('❌');
    await conn.sendMessage(m.chat, {
      text: `❌ *Error al conectar el sub-bot*\n\nPor favor intenta nuevamente o contacta al soporte.`
    }, { quoted: m });
  }
};

handler.help = ['serbot'];
handler.tags = ['subbots'];
handler.command = /^(serbot|sercode|code)$/i;
handler.premium = false;
handler.admin = false;

export default handler;
