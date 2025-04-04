let handler = m => m
handler.before = async function (m, { conn }) {
  // Verifica si es un mensaje de grupo válido
  if (!m.isGroup || !m.messageStubType) return

  try {
    // Obtiene datos del chat desde la base de datos global
    const chat = global.db.data.chats?.[m.chat] || {}
    
    // Verifica si el mensaje es de entrada (27) o salida (28)
    if (![27, 28].includes(m.messageStubType)) return

    // Obtiene el usuario afectado
    const userJid = m.messageStubParameters?.[0]
    if (!userJid) return

    const userName = userJid.split('@')[0]

    // Mensaje de BIENVENIDA (type 27)
    if (m.messageStubType === 27 && chat.welcome) {
      await conn.sendMessage(m.chat, {
        text: `╭━━━━━━━━━━━━╮\n│  🎉 BIENVENIDO/A 🎉  │\n│  @${userName}  │\n╰━━━━━━━━━━━━╯`,
        mentions: [userJid]
      })
    }
    // Mensaje de DESPEDIDA (type 28)
    else if (m.messageStubType === 28 && chat.welcome) {
      await conn.sendMessage(m.chat, {
        text: `╭━━━━━━━━━━━━╮\n│  👋 HASTA PRONTO 👋  │\n│  @${userName}  │\n╰━━━━━━━━━━━━╯`,
        mentions: [userJid]
      })
    }
  } catch (error) {
    console.error('Error en el handler de bienvenidas:', error)
  }
}

export default handler
