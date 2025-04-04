import { readFileSync } from 'fs';
import path from 'path';

let handler = m => m;
handler.before = async function (m, { conn, participants, groupMetadata, isBotAdmin }) {
  if (!m.messageStubType || !m.isGroup) return;

  // Ruta absoluta de la imagen local
  const imagePath = path.join(__dirname, 'src', 'sinfoto2.jpg');
  const imageBuffer = readFileSync(imagePath);  // Cargar la imagen como buffer

  let chat = global.db.data.chats[m.chat];
  let subject = groupMetadata.subject;
  let userName = `${m.messageStubParameters[0].split`@`[0]}`;
  let descs = groupMetadata.desc || "😻 𝗦𝘂𝗽𝗲𝗿 𝗚𝗮𝘁𝗮𝗕𝗼𝘁-𝗠𝗗 😻";

  // Comprobación para bienvenida
  if (chat.welcome && m.messageStubType == 27 && this.user.jid != global.conn.user.jid) {
    let defaultWelcome = `*╭┈⊰* ${subject} *⊰┈ ✦*\n*┊✨ BIENVENIDO(A)!!*\n┊💖 @${userName}\n┊📄 *LEA LA DESCRIPCIÓN DEL GRUPO*\n*╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈ ✦*\n${descs}`;
    let textWel = chat.sWelcome
      ? chat.sWelcome
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
          thumbnail: imageBuffer,  // Pasa el buffer de la imagen aquí
          title: [wm, '😻 𝗦𝘂𝗽𝗲𝗿 ' + gt + ' 😻', '🌟 centergatabot.gmail.com'].getRandom(),
          containsAutoReply: true,
          mediaType: 1,
          sourceUrl: [canal1, canal2, canal3, canal4, yt, grupo1, grupo2, grupo_collab1, grupo_collab2, grupo_collab3, md].getRandom()
        }
      }
    }, { quoted: fkontak });
  }

  // Comprobación para despedida
  else if (chat.welcome && m.messageStubType == 28 && this.user.jid != global.conn.user.jid) {
    let defaultBye = `*╭┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⊰*\n┊ @${userName}\n┊ *NO LE SABE AL GRUPO, CHAO!!* 😎\n*╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⊰*`;
    let textBye = chat.sBye
      ? chat.sBye
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
          thumbnail: imageBuffer,  // Pasa el buffer de la imagen aquí
          title: [wm, '😻 𝗦𝘂𝗽𝗲𝗿 ' + gt + ' 😻', '🌟 centergatabot.gmail.com'].getRandom(),
          containsAutoReply: true,
          mediaType: 1,
          sourceUrl: [canal1, canal2, canal3, canal4, yt, grupo1, grupo2, grupo_collab1, grupo_collab2, grupo_collab3, md].getRandom()
        }
      }
    }, { quoted: fkontak });
  }
};

export default handler;
