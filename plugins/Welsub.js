let handler = m => m
handler.before = async function (m, { conn, participants, groupMetadata, isBotAdmin }) {
  // Verifica si el mensaje es de un grupo y si contiene el tipo adecuado
  if (!m.messageStubType || !m.isGroup) return

  let pp = await conn.profilePictureUrl(m.messageStubParameters[0], 'image').catch(_ => gataMenu) // Obtiene la foto de perfil del miembro
  let img = await (await fetch(`${pp}`)).buffer()
  let usuario = `@${m.sender.split`@`[0]}` // Extrae el nombre de usuario sin el dominio
  let chat = global.db.data.chats[m.chat]
  let users = participants.map(u => conn.decodeJid(u.id))
  
  // Verifica si es un mensaje de bienvenida (messageStubType: 27)
  if (chat.welcome && m.messageStubType == 27 && this.user.jid != global.conn.user.jid) {
    let subject = groupMetadata.subject
    let descs = groupMetadata.desc || "😻 𝗦𝘂𝗽𝗲𝗿 𝗚𝗮𝘁𝗮𝗕𝗼𝘁-𝗠𝗗 😻"
    let userName = `${m.messageStubParameters[0].split`@`[0]}`
    let defaultWelcome = `*╭┈⊰* ${subject} *⊰┈ ✦*\n*┊✨ BIENVENIDO(A)!!*\n┊💖 @${userName}\n┊📄 *LEA LA DESCRIPCIÓN DEL GRUPO*\n*╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈ ✦*\n${descs}`
    
    // Reemplaza los valores en el mensaje de bienvenida si se ha personalizado
    let textWel = chat.sWelcome ? chat.sWelcome
      .replace(/@user/g, `@${userName}`)
      .replace(/@group/g, subject) 
      .replace(/@desc/g, descs)
      : defaultWelcome;
      
    // Envia el mensaje de bienvenida al grupo
    await this.sendMessage(m.chat, { text: textWel, 
      contextInfo: {
        forwardingScore: 9999999,
        isForwarded: true, 
        mentionedJid: [m.sender, m.messageStubParameters[0]],
        externalAdReply: {
          showAdAttribution: true,
          renderLargerThumbnail: true,
          thumbnailUrl: pp, 
          title: ['Super Bot', 'Bot de grupo', 'Grupo'].getRandom(),
          containsAutoReply: true,
          mediaType: 1, 
          sourceUrl: 'https://youtube.com'
        }
      }
    }, { quoted: fkontak })
  }
  
  // Verifica si es un mensaje de despedida (messageStubType: 28)
  else if (chat.welcome && m.messageStubType == 28 && this.user.jid != global.conn.user.jid) {
    let subject = groupMetadata.subject
    let userName = `${m.messageStubParameters[0].split`@`[0]}`
    let defaultBye = `*╭┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⊰*\n┊ @${userName}\n┊ *NO LE SABE AL GRUPO, CHAO!!* 😎\n*╰┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈⊰*`
    
    // Reemplaza los valores en el mensaje de despedida si se ha personalizado
    let textBye = chat.sBye ? chat.sBye
      .replace(/@user/g, `@${userName}`)
      .replace(/@group/g, subject)
      : defaultBye;
    
    // Envia el mensaje de despedida al grupo
    await this.sendMessage(m.chat, { text: textBye, 
      contextInfo: {
        forwardingScore: 9999999,
        isForwarded: true, 
        mentionedJid: [m.sender, m.messageStubParameters[0]],
        externalAdReply: {
          showAdAttribution: true,
          renderLargerThumbnail: true,
          thumbnailUrl: pp, 
          title: ['Super Bot', 'Bot de grupo', 'Grupo'].getRandom(),
          containsAutoReply: true,
          mediaType: 1, 
          sourceUrl: 'https://youtube.com'
        }
      }
    }, { quoted: fkontak })
  }
}

export default handler;
