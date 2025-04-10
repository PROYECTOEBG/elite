import { default as makeWASocket, useMultiFileAuthState, fetchLatestBaileysVersion, makeCacheableSignalKeyStore } from "@whiskeysockets/baileys";
import { Boom } from "@hapi/boom";
import path from "path";
import pino from "pino";
import fs from "fs";

let sentCodeMessage = false;

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function generarcodigo(msg, sock) {
  try {
    const number = msg.key?.participant || msg.key.remoteJid;
    const sessionDir = path.join(__dirname, "GataJadiBot");
    const sessionPath = path.join(sessionDir, number);
    const rid = number.split("@")[0];

    if (!fs.existsSync(sessionDir)) fs.mkdirSync(sessionDir, { recursive: true });

    await sock.sendMessage(msg.key.remoteJid, {
      react: { text: '⌛', key: msg.key }
    });

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
      browser: ['Windows', 'Chrome']
    });

    socky.ev.on("connection.update", async (c) => {
      const { qr, connection } = c;

      if (qr && !sentCodeMessage) {
        const code = await socky.requestPairingCode(rid);
        await sock.sendMessage(msg.key.remoteJid, {
          video: { url: "https://cdn.russellxz.click/b0cbbbd3.mp4" },
          caption: "🔐 *Código generado:*\nAbre WhatsApp > Vincular dispositivo y pega el siguiente código:",
          gifPlayback: true
        }, { quoted: msg });
        await sleep(1000);
        await sock.sendMessage(msg.key.remoteJid, {
          text: "```" + code + "```"
        }, { quoted: msg });
        sentCodeMessage = true;
      }

      if (connection === "open") {
        await sock.sendMessage(msg.key.remoteJid, {
          text: `
╭───〔 *🤖 SUBBOT CONECTADO* 〕───╮
│
│ ✅ *Bienvenido a Azura Ultra 2.0*
│
│ Ya eres parte del mejor sistema de juegos RPG
│
│ 🛠️ Usa los siguientes comandos para comenzar:
│
│ ${global.prefix}help
│ ${global.prefix}menu
│
│ ℹ️ Por defecto, el subbot está en *modo privado*.
│ Solo tú puedes usarlo.
│
│ ➕ Usa ${global.prefix}setprefix para cambiar el prefijo.
│
│ 🔄 Si el bot se traba, ejecuta:
│ ${global.prefix}delbots y luego ${global.prefix}serbot
│
╰────✦ *Sky Ultra Plus* ✦────╯`
        }, { quoted: msg });
        await joinChannels(socky);
        await sock.sendMessage(msg.key.remoteJid, {
          react: { text: "🔁", key: msg.key }
        });
      }
    });
  } catch (error) {
    console.error("Error en generarcodigo:", error);
  }
}

export default generarcodigo;
