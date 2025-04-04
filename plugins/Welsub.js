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
                thumbnailUrl: pp, 
                title: [wm, '😻 𝗦𝘂𝗽𝗲𝗿 ' + gt + ' 😻', '🌟 centergatabot.gmail.com'].getRandom(),
                containsAutoReply: true,
                mediaType: 1, 
                sourceUrl: [canal1, canal2, canal3, canal4, yt, grupo1, grupo2, grupo_collab1, grupo_collab2, grupo_collab3, md].getRandom()
            }
        }
    }, { quoted: fkontak });
}
