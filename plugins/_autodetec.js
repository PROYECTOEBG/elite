import chalk from 'chalk'
let WAMessageStubType = (await import("@whiskeysockets/baileys")).default
import { readdirSync, unlinkSync, existsSync, promises as fs, rmSync } from 'fs'
import path from 'path';
import './_content.js'

let handler = m => m
handler.before = async function (m, { conn, participants, groupMetadata, isBotAdmin }) {

  if (!m.messageStubType || !m.isGroup) return
  let pp = await conn.profilePictureUrl(m.messageStubParameters[0], 'image').catch(_ => gataMenu)
  let img = await (await fetch(`${pp}`)).buffer()
  let usuario = `@${m.sender.split`@`[0]}`
  let chat = global.db.data.chats[m.chat]
  let users = participants.map(u => conn.decodeJid(u.id))
  const groupAdmins = participants.filter(p => p.admin)
  const listAdmin = groupAdmins.map((v, i) => `*» ${i + 1}. @${v.id.split('@')[0]}*`).join('\n')

  let fkontak = {
    key: {
      remoteJid: m.chat,  // ID del chat de destino
      fromMe: false,      // No es el bot quien envió este mensaje
      id: 'message_id',   // Un identificador único para el mensaje
      participant: m.sender // El participante que envió el mensaje
    },
    message: {
      conversation: "Este es el mensaje de prueba"  // Aquí va el contenido del mensaje citado
    }
  };

  if (chat.detect && m.messageStubType == 2) {
    const uniqid = (m.isGroup ? m.chat : m.sender).split('@')[0]
    const sessionPath = './GataBotSession/'
    for (const file of await fs.readdir(sessionPath)) {
      if (file.includes(uniqid)) {
        await fs.unlink(path.join(sessionPath, file))
        console.log(`${chalk.yellow.bold('[ ⚠️ Archivo Eliminado ]')} ${chalk.greenBright(`'${file}'`)}\n` +
          `${chalk.blue('(Session PreKey)')} ${chalk.redBright('que provoca el "undefined" en el chat')}`
        )
      }
    }
  } else if (chat.detect && m.messageStubType == 21) {
    await this.sendMessage(m.chat, {
      text: lenguajeGB['smsAvisoAG']() + mid.smsAutodetec1(usuario, m),
      mentions: [m.sender],
      contextInfo: {
        externalAdReply: {
          showAdAttribution: true,
          renderLargerThumbnail: true,
          thumbnailUrl: pp,
          title: ['𝔼𝕃𝕀𝕋𝔼 𝔹𝕆𝕋 𝔾𝕃𝕆𝔹𝕒𝕃 '].getRandom(),
          containsAutoReply: true,
          mediaType: 1,
          sourceUrl: [canal1, canal2, canal3, canal4, yt, grupo1, grupo2, grupo_collab1, grupo_collab2, grupo_collab3, md].getRandom()
        }
      }
    }, { quoted: fkontak })
  } else if (chat.detect && m.messageStubType == 22) {
    await this.sendMessage(m.chat, {
      text: lenguajeGB['smsAvisoIIG']() + mid.smsAutodetec2(usuario, groupMetadata),
      mentions: [m.sender]
    }, { quoted: fkontak })
  } else if (chat.detect && m.messageStubType == 23) {
    await this.sendMessage(m.chat, {
      text: lenguajeGB['smsAvisoIIG']() + mid.smsAutodetec5(groupMetadata, usuario),
      mentions: [m.sender]
    }, { quoted: fkontak })
  } else if (chat.detect && m.messageStubType == 24) {
    await this.sendMessage(m.chat, {
      text: lenguajeGB['smsAvisoIIG']() + mid.smsAutodetec3(usuario, m),
      mentions: [m.sender]
    }, { quoted: fkontak })
  } else if (chat.detect && m.messageStubType == 25) {
    await this.sendMessage(m.chat, {
      text: lenguajeGB['smsAvisoIIG']() + mid.smsAutodetec4(usuario, m, groupMetadata),
      mentions: [m.sender]
    }, { quoted: fkontak })
  } else if (chat.detect && m.messageStubType == 26) {
    await this.sendMessage(m.chat, {
      text: lenguajeGB['smsAvisoIIG']() + mid.smsAutodetec6(m),
      mentions: [m.sender]
    }, { quoted: fkontak })
  } else if (chat.welcome && m.messageStubType == 27 && this.user.jid != global.conn.user.jid) {
    let subject = groupMetadata.subject
    let descs = groupMetadata.desc || "Sin descripción ";
    let userName = `${m.messageStubParameters[0].split`@`[0]}`;
    let defaultWelcome = `*╔══════════════*
*╟* *BIENVENIDO*
*╟* ${subject}
*╟👤@${userName}* 
*╟📄𝐼𝑁𝐹𝑂𝑅𝑀𝐴𝐶𝐼𝑂́𝑁:*

${descs}

*╚══════════════*`;
    let textWel = chat.sWelcome ? chat.sWelcome
      .replace(/@user/g, `@${userName}`)
      .replace(/@group/g, subject)
      .replace(/@desc/g, descs)
      : defaultWelcome;

    await this.sendMessage(m.chat, {
      text: textWel,
      contextInfo: {
        forwardingScore: 9999999,
        isForwarded: true,
        mentionedJid: [m.sender, m.messageStubParameters[0]],
        externalAdReply: {
          showAdAttribution: true,
          renderLargerThumbnail: true,
          thumbnailUrl: pp,
          title: ['𝔼𝕃𝕀𝕋𝔼 𝔹𝕆𝕋 𝔾𝕃𝕆𝔹𝔸𝕃 '].getRandom(),
          containsAutoReply: true,
          mediaType: 1,
          sourceUrl: [canal1, canal2, canal3, canal4, yt, grupo1, grupo2, grupo_collab1, grupo_collab2, grupo_collab3, md].getRandom()
        }
      }
    }, { quoted: fkontak })
  } else if (chat.welcome && (m.messageStubType == 28 || m.messageStubType == 32) && this.user.jid != global.conn.user.jid) {
    let subject = groupMetadata.subject;
    let userName = `${m.messageStubParameters[0].split`@`[0]}`;
    let defaultBye = `*╔══════════════*
*╟* *SE FUE UNA BASURA*
*╟👤@${userName}* 
*╚══════════════*`;
    let textBye = chat.sBye ? chat.sBye
      .replace(/@user/g, `@${userName}`)
      .replace(/@group/g, subject)
      : defaultBye;
    await this.sendMessage(m.chat, {
      text: textBye,
      contextInfo: {
        forwardingScore: 9999999,
        isForwarded: true,
        mentionedJid: [m.sender, m.messageStubParameters[0]],
        externalAdReply: {
          showAdAttribution: true,
          renderLargerThumbnail: true,
          thumbnailUrl: pp,
          title: ['𝔼𝕃𝕀𝕋𝔼 𝔹𝕆𝕋 𝔾𝕃𝕆𝔹𝔸𝕃 '].getRandom(),
          containsAutoReply: true,
          mediaType: 1,
          sourceUrl: [canal1, canal2, canal3, canal4, yt, grupo1, grupo2, grupo_collab1, grupo_collab2, grupo_collab3, md].getRandom()
        }
      }
    }, { quoted: fkontak })
  } else if (chat.detect && m.messageStubType == 29) {
    await this.sendMessage(m.chat, {
      text: mid.smsAutodetec7(m, usuario),
      mentions: [m.sender, m.messageStubParameters[0], ...groupAdmins.map(v => v.id)]
    }, { quoted: fkontak })
  } else if (chat.detect && m.messageStubType == 30) {
    await this.sendMessage(m.chat, {
      text: mid.smsAutodetec8(m, usuario),
      mentions: [m.sender, m.messageStubParameters[0], ...groupAdmins.map(v => v.id)]
    }, { quoted: fkontak })
  } else if (chat.detect && m.messageStubType == 72) {
    await this.sendMessage(m.chat, {
      text: lenguajeGB['smsAvisoIIG']() + mid.smsAutodetec9(usuario, m),
      mentions: [m.sender]
    }, { quoted: fkontak })
  } else if (chat.detect && m.messageStubType === 172 && m.messageStubParameters.length > 0) {
    const rawUser = m.messageStubParameters[0];
    const users = rawUser.split('@')[0];
    const prefijosProhibidos = ['91', '92', '222', '93', '265', '61', '
