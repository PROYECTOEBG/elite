let handler = m => m
handler.before = async function (m, { conn, participants, groupMetadata, isBotAdmin }) {
  if (!m.messageStubType || !m.isGroup) return

  const FOTO_PREDETERMINADA = 'https://telegra.ph/file/xxxxxx.jpg' // Tu imagen aquí
  
  let pp
  try {
    pp = await conn.profilePictureUrl(m.messageStubParameters[0], 'image').catch(_ => FOTO_PREDETERMINADA)
  } catch {
    pp = FOTO_PREDETERMINADA
  }

  // Mensaje simplificado de BIENVENIDA
  if (chat.welcome && m.messageStubType == 27) {
    let userName = `${m.messageStubParameters[0].split`@`[0]}`
    let textWel = `╭━━━━━━━━━━━━╮\n│  ¡BIENVENIDO/A!  │\n│  @${userName}  │\n╰━━━━━━━━━━━━╯`
    
    await this.sendMessage(m.chat, { 
      text: textWel,
      mentions: [m.messageStubParameters[0]]
    })
  }
  
  // Mensaje simplificado de DESPEDIDA
  else if (chat.welcome && m.messageStubType == 28) {
    let userName = `${m.messageStubParameters[0].split`@`[0]}`
    let textBye = `╭━━━━━━━━━━━━╮\n│  ¡HASTA PRONTO!  │\n│  @${userName}  │\n╰━━━━━━━━━━━━╯`
    
    await this.sendMessage(m.chat, { 
      text: textBye,
      mentions: [m.messageStubParameters[0]]
    })
  }
}

export default handler
