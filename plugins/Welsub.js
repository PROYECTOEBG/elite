let handler = m => m
handler.before = async function (m, { conn }) {
  if (!m.isGroup || !m.messageStubType) return

  try {
    const chat = global.db.data.chats?.[m.chat] || {}
    const groupData = await conn.groupMetadata(m.chat)
    const userJid = m.messageStubParameters?.[0]
    
    if (!userJid || ![27, 28].includes(m.messageStubType)) return

    // Configuración de imagen (REEMPLAZA ESTA URL)
    const TU_IMAGEN_URL = 'https://qu.ax/wDNjj.jpg' // ← Tu enlace aquí
    
    const userName = userJid.split('@')[0]
    const groupName = groupData.subject || "Este grupo"

    // Mensaje de BIENVENIDA (solo imagen)
    if (m.messageStubType === 27 && chat.welcome) {
      await conn.sendMessage(m.chat, {
        image: { url: TU_IMAGEN_URL },
        caption: `🎉 Bienvenido/a @${userName} a ${groupName}`,
        mentions: [userJid]
      })
    }
    // Mensaje de DESPEDIDA (solo imagen)
    else if (m.messageStubType === 28 && chat.welcome) {
      await conn.sendMessage(m.chat, { 
        image: { url: TU_IMAGEN_URL },
        caption: `👋 Adiós @${userName}, gracias por estar en ${groupName}`,
        mentions: [userJid]
      })
    }
  } catch (error) {
    console.error('Error en el handler:', error)
  }
}

export default handler
