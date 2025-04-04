import path from 'path';

// Dentro del código de bienvenida o despedida
const imagePath = path.join(__dirname, 'src', 'sinfoto2.jpg');  // Usamos path.join para crear la ruta completa

let pp = imagePath;  // Esto se asigna al valor de la imagen que queremos utilizar

// Código para enviar la bienvenida con la imagen
if (chat.welcome && m.messageStubType == 27 && this.user.jid != global.conn.user.jid) {
  let subject = groupMetadata.subject;
  let userName = `${m.messageStubParameters[0].split`@`[0]}`;
  let descs = groupMetadata.desc || "😻 𝗦𝘂𝗽𝗲𝗿 𝗚𝗮𝘁𝗮𝗕𝗼𝘁-𝗠𝗗 😻";
  let defaultWelcome = `*╭┈⊰* ${subject} *⊰┈ ✦*\n*┊✨ BIENVENIDO(A)!!*\n┊💖 @${userName}\n┊📄 *LEA LA DESCRIPCIÓN DEL GRUPO*\n*╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈ ✦*\n${descs}`;
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
        thumbnailUrl: pp,  // Aquí asignamos la ruta de la imagen
        title: 'Bienvenido a ' + subject, 
        containsAutoReply: true,
        mediaType: 1,
        sourceUrl: 'https://example.com'  // Aquí puedes poner un link de tu preferencia
      }
    }
  }, { quoted: fkontak });
}

// Para la despedida, puedes aplicar un enfoque similar.
