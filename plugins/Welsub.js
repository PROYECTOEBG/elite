let handler = async (m, { conn, args, command, usedPrefix, isAdmin, isROwner }) => {
  // Comando para activar/desactivar
  if (command === 'welcome') {
    if (!m.isGroup) return m.reply('✖️ Este comando solo funciona en grupos')
    if (!isAdmin && !isROwner) return m.reply('🔒 Solo administradores pueden configurar las bienvenidas')
    if (!args[0]) return m.reply(`📌 Uso:\n*${usedPrefix}on welcome* - Activar\n*${usedPrefix}of welcome* - Desactivar`)

    if (!global.db.data.chats[m.chat]) global.db.data.chats[m.chat] = {}
    
    if (args[0].toLowerCase() === 'on') {
      global.db.data.chats[m.chat].welcome = true
      m.reply('✅ *Bienvenidas activadas* correctamente')
    } else if (args[0].toLowerCase() === 'of') {
      global.db.data.chats[m.chat].welcome = false
      m.reply('❌ *Bienvenidas desactivadas* correctamente')
    } else {
      m.reply(`⚠️ Opción no válida. Usa:\n*${usedPrefix}on welcome*\n*${usedPrefix}of welcome*`)
    }
    return
  }

  // Handler para eventos de grupo
  if (!m.isGroup || !m.messageStubType || ![27, 28].includes(m.messageStubType)) return

  try {
    const chat = global.db.data.chats[m.chat] || {}
    if (!chat.welcome) return

    const userJid = m.messageStubParameters?.[0]
    if (!userJid) return

    // Obtener metadatos del grupo solo si son necesarios
    const groupData = m.messageStubType === 27 ? await conn.groupMetadata(m.chat).catch(() => null) : null
    const groupName = groupData?.subject || "el grupo"

    // URL de tu imagen personalizada (reemplázala)
    const IMAGEN_BIENVENIDA = 'https://telegra.ph/file/tu-imagen.jpg'

    if (m.messageStubType === 27) {
      // Mensaje de bienvenida con imagen
      await conn.sendMessage(m.chat, {
        image: { url: IMAGEN_BIENVENIDA },
        caption: `🎊 ¡Bienvenido/a @${userJid.split('@')[0]} a ${groupName}!`,
        mentions: [userJid]
      })
    } else if (m.messageStubType === 28) {
      // Mensaje de despedida
      await conn.sendMessage(m.chat, {
        text: `😢 Lamentamos que @${userJid.split('@')[0]} haya dejado el grupo`,
        mentions: [userJid]
      })
    }
  } catch (error) {
    console.error('Error en el handler de bienvenidas:', error)
  }
}

handler.command = /^(welcome)$/i
export default handler
