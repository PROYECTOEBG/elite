let handler = m => m;
handler.before = async function (m, { conn, participants, groupMetadata, isBotAdmin }) {

    if (!m.messageStubType || !m.isGroup) return;

    let chat = global.db.data.chats[m.chat];
    let userName = `${m.messageStubParameters[0].split`@`[0]}`;
    let subject = groupMetadata.subject;
    let pp = await conn.profilePictureUrl(m.messageStubParameters[0], 'image').catch(_ => gataMenu);
    let img = await (await fetch(`${pp}`)).buffer();
    let defaultWelcome = `*╭┈⊰* ${subject} *⊰┈ ✦*\n*┊✨ BIENVENIDO(A)!!*\n┊💖 @${userName}\n┊📄 *LEA LA DESCRIPCIÓN DEL GRUPO*\n*╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈ ✦*`;
    let defaultBye = `*╭┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⊰*\n┊ @${userName}\n┊ *NO LE SABE AL GRUPO, CHAO!!* 😎\n*╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⊰*`;

    if (chat.welcome && m.messageStubType == 27 && this.user.jid != global.conn.user.jid) { 
        // Bienvenida
        let textWel = chat.sWelcome ? chat.sWelcome
            .replace(/@user/g, `@${userName}`)
            .replace(/@group/g, subject)
            : defaultWelcome;

        await this.sendMessage(m.chat, { text: textWel, 
            contextInfo: {
                forwardingScore: 9999999,
                isForwarded: true, 
                mentionedJid:[m.sender, m.messageStubParameters[0]],
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

    if (chat.welcome && (m.messageStubType == 28 || m.messageStubType == 32) && this.user.jid != global.conn.user.jid) {
        // Despedida
        let textBye = chat.sBye ? chat.sBye
            .replace(/@user/g, `@${userName}`)
            .replace(/@group/g, subject)
            : defaultBye;

        await this.sendMessage(m.chat, { text: textBye, 
            contextInfo: {
                forwardingScore: 9999999,
                isForwarded: true, 
                mentionedJid:[m.sender, m.messageStubParameters[0]],
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
}
