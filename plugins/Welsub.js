import path from 'path';
import { fileURLToPath } from 'url';

// Convertimos la URL del módulo a ruta absoluta
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ruta correcta a la imagen
const imagePath = path.join(__dirname, 'src', 'sinfoto2.jpg');  // Ruta correcta

let pp = imagePath;  // Aquí se asigna la ruta de la imagen

let handler = m => m;

handler.before = async function (m, { conn, participants, groupMetadata, chat }) {
    // Bienvenida
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

    // Despedida
    else if (chat.welcome && m.messageStubType == 28 && this.user.jid != global.conn.user.jid) {
        let subject = groupMetadata.subject;
        let userName = `${m.messageStubParameters[0].split`@`[0]}`;
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
                    thumbnailUrl: pp,  // Aquí asignamos la ruta de la imagen
                    title: 'Despedida de ' + subject, 
                    containsAutoReply: true,
                    mediaType: 1,
                    sourceUrl: 'https://example.com'  // Aquí puedes poner un link de tu preferencia
                }
            }
        }, { quoted: fkontak });
    }
};

export default handler;
