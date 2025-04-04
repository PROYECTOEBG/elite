let handler = async (m, { conn, args, command, usedPrefix }) => {
  // Comando para activar/desactivar (.on welcome / .of welcome)
  if (command === 'welcome') {
    if (!m.isGroup) return m.reply('Este comando solo funciona en grupos')
    if (!args[0]) return m.reply(`Usa: *${usedPrefix}on welcome* para activar o *${usedPrefix}of welcome* para desactivar`)

    const chat = global.db.data.chats[m.chat] || {}
    
    if (args[0].toLowerCase() === 'on') {
      chat.welcome = true
      m.reply('✅ Bienvenidas activadas en este grupo')
    } else if (args[0].toLowerCase() === 'of') {
      chat.welcome = false
      m.reply('❌ Bienvenidas desactivadas en este grupo')
    } else {
      m.reply(`Opción no válida. Usa *${usedPrefix}on welcome* o *${usedPrefix}of welcome*`)
    }
    return
  }

  // Handler para las bienvenidas/despedidas
  if (!m.isGroup || !m.messageStubType) return

  try {
    const chat = global.db.data.chats[m.chat] || {}
    if (!chat.welcome) return // Si las bienvenidas están desactivadas

    const groupData = await conn.groupMetadata(m.chat)
    const userJid = m.messageStubParameters?.[0]
    
    if (!userJid || ![27, 28].includes(m.messageStubType)) return

    // Configuración de imagen (REEMPLAZA ESTA URL)
    const TU_IMAGEN_URL = 'https://qu.ax/wDNjj.jpg' // ← Tu enlace aquí
    
    const userName = userJid.split('@')[0]
    const groupName = groupData.subject || "Este grupo"

    // Mensaje de BIENVENIDA (solo imagen)
    if (m.messageStubType === 27) {
      await conn.sendMessage(m.chat, {
        image: { url: TU_IMAGEN_URL },
        caption: `🎉 Bienvenido/a @${userName} a ${groupName}`,
        mentions: [userJid]
      })
    }
    // Mensaje de DESPEDIDA (solo imagen)
    else if (m.messageStubType === 28) {
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

handler.command = /^(welcome)$/i
export default handler
