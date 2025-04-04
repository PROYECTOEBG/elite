import fs from 'fs';
import path from 'path';

// Ruta de la imagen local
let imageUrl = path.join(__dirname, './src/sinfoto2.jpg');

// Verificar si la imagen existe
if (!fs.existsSync(imageUrl)) {
    console.error('Imagen no encontrada en la ruta especificada:', imageUrl);
    return;
}

let handler = m => m;
handler.before = async function (m, { conn, participants, groupMetadata, isBotAdmin }) {
    if (!m.messageStubType || !m.isGroup) return;

    // Comprobamos si es un mensaje de agregar o eliminar miembro
    if (m.messageStubType == 27) { // Bienvenida (agregar)
        let userName = `${m.messageStubParameters[0].split`@`[0]}`;
        let subject = groupMetadata.subject;
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
                    thumbnailUrl: imageUrl,  // Usamos la imagen local
                    title: [wm, '😻 𝗦𝘂𝗽𝗲𝗿 ' + gt + ' 😻', '🌟 centergatabot.gmail.com'].getRandom(),
                    containsAutoReply: true,
                    mediaType: 1,
                    sourceUrl: [canal1, canal2, canal3, canal4, yt, grupo1, grupo2, grupo_collab1, grupo_collab2, grupo_collab3, md].getRandom()
                }
            }
        }, { quoted: fkontak });

    } else if (m.messageStubType == 28) { // Despedida (eliminar)
        let userName = `${m.messageStubParameters[0].split`@`[0]}`;
        let subject = groupMetadata.subject;
        let defaultBye = `*╭┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⊰*\n┊ @${userName}\n┊ *NO LE SABE AL GRUPO, CHAO!!* 😎\n*╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⊰*`;
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
                    thumbnailUrl: imageUrl,  // Usamos la imagen local
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
