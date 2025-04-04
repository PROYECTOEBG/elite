let handler = m => m
handler.before = async function (m, { conn, participants, groupMetadata, isBotAdmin }) {
  // Verifica si el mensaje es de un grupo y si contiene el tipo adecuado
  if (!m.messageStubType || !m.isGroup) return

  // Foto predeterminada (reemplaza con tu URL)
  const FOTO_PREDETERMINADA = 'https://telegra.ph/file/0541d4ac7ecf51a1faca9.jpg' 
  
  // Obtener foto de perfil o usar predeterminada
  let pp
  try {
    pp = await conn.profilePictureUrl(m.messageStubParameters[0], 'image').catch(_ => FOTO_PREDETERMINADA)
  } catch {
    pp = FOTO_PREDETERMINADA
  }
  
  let img = await (await fetch(pp)).buffer().catch(_ => null)
  let usuario = `@${m.sender.split`@`[0]}`
  let chat = global.db.data.chats[m.chat]
  let users = participants.map(u => conn.decodeJid(u.id))
  
  // Mensaje de BIENVENIDA (messageStubType: 27)
  if (chat.welcome && m.messageStubType == 27 && this.user.jid != global.conn.user.jid) {
    let subject = groupMetadata.subject
    let descs = groupMetadata.desc || "🌟 ¡Bienvenido al grupo! 🌟"
    let userName = `${m.messageStubParameters[0].split`@`[0]}`
    let defaultWelcome = `*╭━━━━━━━━━━━━━╮*\n┃ *¡BIENVENIDO/A!* ┃\n┃ *@${userName}* ┃\n╰━━━━━━━━━━━━━╯\n📌 *Grupo:* ${subject}\n📝 *Descripción:* ${descs}`

    let textWel = chat.sWelcome ? chat.sWelcome
      .replace(/@user/g, `@${userName}`)
      .replace(/@group/g, subject) 
      .replace(/@desc/g, descs)
      : defaultWelcome
      
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
          title: '𝔼𝕃𝕀𝕋𝔼 𝔹𝕆𝕋 𝔾𝕃𝕆𝔹𝔸𝕃',
          containsAutoReply: true,
          mediaType: 1, 
          sourceUrl: 'https://whatsapp.com'
        }
      }
    }, { quoted: fkontak })
  }
  
  // Mensaje de DESPEDIDA (messageStubType: 28)
  else if (chat.welcome && m.messageStubType == 28 && this.user.jid != global.conn.user.jid) {
    let subject = groupMetadata.subject
    let userName = `${m.messageStubParameters[0].split`@`[0]}`
    let defaultBye = `*╭━━━━━━━━━━━━━╮*\n┃ *¡HASTA PRONTO!* ┃\n┃ *@${userName}* ┃\n╰━━━━━━━━━━━━━╯\n😿 Lamentamos que te vayas...`

    let textBye = chat.sBye ? chat.sBye
      .replace(/@user/g, `@${userName}`)
      .replace(/@group/g, subject)
      : defaultBye
    
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
          title: '𝔼𝕃𝕀𝕋𝔼 𝔹𝕆𝕋 𝔾𝕃𝕆𝔹𝔸𝕃 ',
          containsAutoReply: true,
          mediaType: 1, 
          sourceUrl: 'https://whatsapp.com'
        }
      }
    }, { quoted: fkontak })
  }
}

export default handler
