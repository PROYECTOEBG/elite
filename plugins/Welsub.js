import chalk from 'chalk';
import { readdirSync, unlinkSync, promises as fs, path } from 'fs';
import './_content.js';

let handler = m => m;

handler.before = async function (m, { conn, participants, groupMetadata, isBotAdmin }) {
    // Si no es un grupo o no tiene el tipo de mensaje adecuado, retorna.
    if (!m.isGroup || !m.messageStubType) return;

    let chat = global.db.data.chats[m.chat];
    let pp = await conn.profilePictureUrl(m.messageStubParameters[0], 'image').catch(_ => gataMenu);
    let img = await (await fetch(`${pp}`)).buffer();
    let usuario = `@${m.sender.split`@`[0]}`;
    const groupAdmins = participants.filter(p => p.admin);
    const listAdmin = groupAdmins.map((v, i) => `*» ${i + 1}. @${v.id.split('@')[0]}*`).join('\n');

    // Lógica de bienvenida (Detecta cuando alguien entra al grupo)
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

        // Envío de bienvenida con la imagen de perfil
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
                    title: [wm, '😻 𝗦𝘂𝗽𝗲𝗿 ' + gt + ' 😻', '🌟 centergatabot.gmail.com'].getRandom(),
                    containsAutoReply: true,
                    mediaType: 1, 
                    sourceUrl: [canal1, canal2, canal3, canal4, yt, grupo1, grupo2, grupo_collab1, grupo_collab2, grupo_collab3, md].getRandom()
                }
            }
        }, { quoted: fkontak });
    }

    // Lógica de despedida (Detecta cuando alguien sale del grupo)
    else if (chat.welcome && (m.messageStubType == 28 || m.messageStubType == 32) && this.user.jid != global.conn.user.jid) {
        let subject = groupMetadata.subject;
        let userName = `${m.messageStubParameters[0].split`@`[0]}`;
        
        let defaultBye = `*╭┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⊰*\n┊ @${userName}\n┊ *NO LE SABE AL GRUPO, CHAO!!* 😎\n*╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⊰*`;
        let textBye = chat.sBye ? chat.sBye
            .replace(/@user/g, `@${userName}`)
            .replace(/@group/g, subject)
            : defaultBye;

        // Envío de despedida con la imagen de perfil
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
