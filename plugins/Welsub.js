let handler = m => m
handler.before = async function (m, { conn }) {
  if (!m.isGroup || !m.messageStubType) return

  try {
    const chat = global.db.data.chats?.[m.chat] || {}
    const groupData = await conn.groupMetadata(m.chat)
    const userJid = m.messageStubParameters?.[0]
    
    if (!userJid || ![27, 28].includes(m.messageStubType)) return

    // Configuración de imagen (REEMPLAZA ESTA URL CON LA TUYA)
    const FOTO_PREDETERMINADA = 'https://qu.ax/wDNjj.jpg' // ← Cambia este enlace
    const userName = userJid.split('@')[0]
    const groupName = groupData.subject || "Este grupo"
    const groupDesc = groupData.desc || "Sin descripción disponible"

    // Obtener imagen (usará la predeterminada si falla)
    let ppUrl = await conn.profilePictureUrl(userJid, 'image').catch(() => FOTO_PREDETERMINADA)

    // Mensaje de BIENVENIDA
    if (m.messageStubType === 27 && chat.welcome) {
      const welcomeMsg = `╭━━━━━━━━━━━━━━╮
│  🎉 BIENVENIDO/A 🎉  │
│  @${userName}  │
╰━━━━━━━━━━━━━━╯
📌 *Grupo:* ${groupName}
📝 *Descripción:* ${groupDesc}`

      await conn.sendMessage(m.chat, {
        text: welcomeMsg,
        mentions: [userJid],
        contextInfo: {
          externalAdReply: {
            title: groupName,
            body: groupDesc,
            thumbnailUrl: ppUrl, // Usa la imagen aquí
            mediaType: 1,
            sourceUrl: 'https://whatsapp.com',
            showAdAttribution: true
          }
        }
      })
    }
    // Mensaje de DESPEDIDA
    else if (m.messageStubType === 28 && chat.welcome) {
      const goodbyeMsg = `╭━━━━━━━━━━━━━━╮
│  👋 HASTA PRONTO 👋  │
│  @${userName}  │
╰━━━━━━━━━━━━━━╯
😿 Lamentamos que te vayas de ${groupName}`

      await conn.sendMessage(m.chat, { 
        text: goodbyeMsg,
        mentions: [userJid],
        contextInfo: {
          externalAdReply: {
            title: groupName,
            body: `Se fue @${userName}`,
            thumbnailUrl: ppUrl, // Usa la imagen aquí
            mediaType: 1,
            showAdAttribution: true
          }
        }
      })
    }
  } catch (error) {
    console.error('Error en el handler:', error)
  }
}

export default handler
