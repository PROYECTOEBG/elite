let handler = m => m;
handler.before = async function (m, { conn, participants, groupMetadata, isBotAdmin }) {
  if (!m.messageStubType || !m.isGroup) return;

  let pp = await conn.profilePictureUrl(m.messageStubParameters[0], 'image').catch(_ => './src/sinfoto2.jpg');
  let img = await (await fetch(pp)).buffer();
  let usuario = `@${m.sender.split`@`[0]}`;
  let chat = global.db.data.chats[m.chat];
  let users = participants.map(u => conn.decodeJid(u.id));
  const groupAdmins = participants.filter(p => p.admin);
  const listAdmin = groupAdmins.map((v, i) => `*» ${i + 1}. @${v.id.split('@')[0]}*`).join('\n');

  if (chat.detect && m.messageStubType == 27) {  // Welcome Event
    let subject = groupMetadata.subject;
    let userName = `${m.messageStubParameters[0].split`@`[0]}`;
    let defaultWelcome = `*╭┈⊰* ${subject} *⊰┈ ✦*\n*┊✨ BIENVENIDO(A)!!*\n┊💖 @${userName}\n┊📄 *LEA LA DESCRIPCIÓN DEL GRUPO*\n*╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈ ✦*`;

    let textWel = chat.sWelcome ? chat.sWelcome
      .replace(/@user/g, `@${userName}`)
      .replace(/@group/g, subject) 
      : defaultWelcome;

    await this.sendMessage(m.chat, { text: textWel, 
      contextInfo:{
        forwardingScore: 9999999,
        isForwarded: true, 
        mentionedJid:[m.sender, m.messageStubParameters[0]],
        externalAdReply: {
          showAdAttribution: true,
          renderLargerThumbnail: true,
          thumbnailUrl: pp,  // Default image if no profile photo
          title: [wm, '😻 𝗦𝘂𝗽𝗲𝗿 ' + gt + ' 😻', '🌟 centergatabot.gmail.com'].getRandom(),
          containsAutoReply: true,
          mediaType: 1, 
          sourceUrl: [canal1, canal2, canal3, canal4, yt, grupo1, grupo2, grupo_collab1, grupo_collab2, grupo_collab3, md].getRandom()
        }
      }
    }, { quoted: fkontak });
  } else if (chat.detect && m.messageStubType == 28) {  // Goodbye Event
    let subject = groupMetadata.subject;
    let userName = `${m.messageStubParameters[0].split`@`[0]}`;
    let defaultBye = `*╭┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⊰*\n┊ @${userName}\n┊ *NO LE SABE AL GRUPO, CHAO!!* 😎\n*╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⊰*`;

    let textBye = chat.sBye ? chat.sBye
      .replace(/@user/g, `@${userName}`)
      .replace(/@group/g, subject)
      : defaultBye;

    await this.sendMessage(m.chat, { text: textBye, 
      contextInfo:{
        forwardingScore: 9999999,
        isForwarded: true, 
        mentionedJid:[m.sender, m.messageStubParameters[0]],
        externalAdReply: {
          showAdAttribution: true,
          renderLargerThumbnail: true,
          thumbnailUrl: pp,  // Default image if no profile photo
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
