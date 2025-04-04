let handler = async (m, { conn }) => {
  // Detectar cuando añaden al bot a un grupo (código 256)
  if (!m.isGroup || m.messageStubType !== 256) return
  
  try {
    const groupMetadata = await conn.groupMetadata(m.chat)
    const groupName = groupMetadata.subject || "este grupo"
    const participants = groupMetadata.participants.map(p => p.id)
    const botNumber = conn.user.jid.split('@')[0]

    // Mensaje de bienvenida para el bot
    const welcomeMessage = `╭━━━━━━━━━━━━━━╮
│   *¡GRACIAS POR INVITARME!*   │
╰━━━━━━━━━━━━━━╯
📌 *Nombre del grupo:* ${groupName}
👥 *Miembros:* ${participants.length}
🤖 *Mi prefijo:* !

*¡Listo para ayudarlos!* Escriban *!menu* para ver mis funciones.`

    // Enviar mensaje al grupo
    await conn.sendMessage(m.chat, { 
      text: welcomeMessage,
      contextInfo: {
        mentionedJid: participants,
        forwardingScore: 999,
        isForwarded: true
      }
    })

    // Opcional: Enviar sticker de bienvenida
    await conn.sendMessage(m.chat, {
      sticker: fs.readFileSync('./src/welcome.webp') // Ruta de tu sticker
    })

  } catch (error) {
    console.error('Error en bienvenida del bot:', error)
  }
}

export default handler
