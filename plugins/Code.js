import { makeWASocket, useMultiFileAuthState, fetchLatestBaileysVersion, makeCacheableSignalKeyStore, DisconnectReason } from '@whiskeysockets/baileys';
import { Boom } from '@hapi/boom';
import path from 'path';
import pino from 'pino';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const handler = async (m, { conn, usedPrefix, command }) => {
  // Verificar si el usuario ya tiene una sesión activa
  const number = m.sender;
  const sessionDir = path.join(__dirname, '../GataJadiBot');
  const sessionPath = path.join(sessionDir, number.split('@')[0]);
  const rid = number.split('@')[0];

  try {
    // Crear directorio si no existe
    if (!fs.existsSync(sessionDir)) {
      fs.mkdirSync(sessionDir, { recursive: true });
    }

    // Reacción de espera
    await m.react('⌛');

    const { state, saveCreds } = await useMultiFileAuthState(sessionPath);
    const { version } = await fetchLatestBaileysVersion();
    const logger = pino({ level: "silent" });

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
    let reconnectionAttempts = 0;
    const maxReconnectionAttempts = 3;

    socky.ev.on("connection.update", async (update) => {
      const { qr, connection, lastDisconnect } = update;

      if (qr && !sentCodeMessage && command === 'serbot') {
        const code = await socky.requestPairingCode(rid);
        
        // Enviar video con instrucciones
        await conn.sendMessage(m.chat, {
          video: { url: "https://cdn.russellxz.click/b0cbbbd3.mp4" },
          caption: "🔐 *Código generado:*\nAbre WhatsApp > Vincular dispositivo y pega el siguiente código:",
          gifPlayback: true
        }, { quoted: m });

        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Enviar código de emparejamiento
        await conn.sendMessage(m.chat, {
          text: "```" + code + "```"
        }, { quoted: m });
        
        sentCodeMessage = true;
      }

      if (connection === "open") {
        // Mensaje de conexión exitosa
        await conn.sendMessage(m.chat, {
          text: `
╭───〔 *🤖 SUBBOT CONECTADO* 〕───╮
│
│ ✅ *Bienvenido a Azura Ultra 2.0*
│
│ Ya eres parte del mejor sistema de juegos RPG
│
│ 🛠️ Usa los siguientes comandos para comenzar:
│
│ ${usedPrefix}help
│ ${usedPrefix}menu
│
│ ⚔️ Disfruta de las funciones del subbot
│ y conquista el mundo digital
│
│ ℹ️ Por defecto, el subbot está en *modo privado*,
│ lo que significa que *solo tú puedes usarlo*.
│
│ Usa el comando:
│ ${usedPrefix}menu
│ (para ver configuraciones y cómo hacer
│ que otras personas puedan usarlo.)
│
│ ➕ Los prefijos por defecto son: *. y #*
│ Si quieres cambiarlos, usa:
│ ${usedPrefix}setprefix
│
│ 🔄 Si notas que el subbot *no responde al instante*
│ o tarda mucho *aunque esté conectado*, no te preocupes.
│ Puede ser un fallo temporal.
│
│ En ese caso, simplemente ejecuta:
│ ${usedPrefix}delbots
│ para eliminar tu sesión y luego vuelve a conectarte usando:
│ ${usedPrefix}serbot
│ hasta que se conecte correctamente.
│
│ Esto ayuda a establecer una conexión *estable y funcional*.
│
╰────✦ *Azura Ultra Plus* ✦────╯`
        }, { quoted: m });

        // Guardar la conexión en global.conns
        if (!global.conns) global.conns = [];
        global.conns.push(socky);
      }

      if (connection === "close") {
        const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
        if (shouldReconnect && reconnectionAttempts < maxReconnectionAttempts) {
          reconnectionAttempts++;
          console.log(`Intentando reconectar (${reconnectionAttempts}/${maxReconnectionAttempts})...`);
          setTimeout(serbot, 5000);
        }
      }
    });

    socky.ev.on("creds.update", saveCreds);

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
handler.command = /^(sercode|code)$/i;
handler.premium = false;
handler.admin = false;

export default handler;
