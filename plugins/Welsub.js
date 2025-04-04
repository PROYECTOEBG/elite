let handler = m => m
handler.before = async function (m, { conn, participants, groupMetadata, isBotAdmin }) {
    if (!m.messageStubType || !m.isGroup) return

    let pp;
    try {
        pp = await conn.profilePictureUrl(m.messageStubParameters[0], 'image');
    } catch (e) {
        // Si no tiene foto, usa la imagen local
        pp = './src/sinfoto2.jpg';  // Ruta local de la imagen
    }
    
    let img = await fs.promises.readFile(pp);  // Leemos la imagen desde el archivo
    let usuario = `@${m.sender.split`@`[0]}`;
    let chat = global.db.data.chats[m.chat];

    // Bienvenida
    if (chat.welcome && m.messageStubType == 27 && this.user.jid != global.conn.user.jid) { 
        let subject = groupMetadata.subject;
        let descs = groupMetadata.desc || "😻 𝗦𝘂𝗽𝗲𝗿 𝗚𝗮𝘁𝗮𝗕𝗼𝘁-𝗠𝗗 😻";
        let userName = `${m.messageStubParameters[0].split`@`[0]}`;
        let defaultWelcome = `*╭┈⊰* ${subject} *⊰┈ ✦*\n*┊✨ BIENVENIDO(A)!!*\n┊💖 @${userName}\n┊📄 *LEA LA DESCRIPCIÓN DEL GRUPO*\n*╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈ ✦*\n${descs}`;
        let textWel = chat.sWelcome ? chat.sWelcome
        .replace(/@user/g, `@${userName}`)
        .replace(/@group/g, subject) 
        .replace(/@desc/g, descs)
        : defaultWelcome;
            
        await this.sendMessage(m.chat, { text: textWel, 
        contextInfo:{
            forwardingScore: 9999999,
            isForwarded: true, 
            mentionedJid:[m.sender, m.messageStubParameters[0]],
            externalAdReply: {
                showAdAttribution: true,
                renderLargerThumbnail: true,
                thumbnailUrl: pp,  // Usa la imagen local de la bienvenida
                title: [wm, '😻 𝗦𝘂𝗽𝗲𝗿 ' + gt + ' 😻', '🌟 centergatabot.gmail.com'].getRandom(),
                containsAutoReply: true,
                mediaType: 1, 
                sourceUrl: [canal1, canal2, canal3, canal4, yt, grupo1, grupo2, grupo_collab1, grupo_collab2, grupo_collab3, md].getRandom()
            }
        }}, { quoted: fkontak }) 
    }

    // Despedida
    if (chat.welcome && (m.messageStubType == 28 || m.messageStubType == 32) && this.user.jid != global.conn.user.jid ) {
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
                thumbnailUrl: pp,  // Usa la imagen local de la despedida
                title: [wm, '😻 𝗦𝘂𝗽𝗲𝗿 ' + gt + ' 😻', '🌟 centergatabot.gmail.com'].getRandom(),
                containsAutoReply: true,
                mediaType: 1, 
                sourceUrl: [canal1, canal2, canal3, canal4, yt, grupo1, grupo2, grupo_collab1, grupo_collab2, grupo_collab3, md].getRandom()
            }
        }}, { quoted: fkontak }) 
    }
}
