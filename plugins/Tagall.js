let handler = async (m, { isOwner, isAdmin, conn, text, participants, args }) => {
  if (!(isAdmin || isOwner)) {
    global.dfail('admin', m, conn)
    throw false
  }

  let pesan = args.join` `
  let oi = `📢 *MENSAJE PARA TODOS:* ${pesan || '¡Atención por favor!'}`
  let mentions = []
  let users = participants.map(u => u.id)

  // Solución alternativa - ya que la API no reporta bien el estado
  let onlineUsers = []
  let offlineUsers = []
  
  // Simularemos que algunos están online basado en actividad reciente
  for (let id of users) {
    mentions.push(id)
    // Verificar si el usuario ha interactuado recientemente (5 minutos)
    let isRecentlyActive = await checkRecentActivity(conn, id, m.chat)
    if (isRecentlyActive) {
      onlineUsers.push(`@${id.split('@')[0]}`)
    } else {
      offlineUsers.push(`@${id.split('@')[0]}`)
    }
  }

  let teks = `*╭━━⊰ TAGALL MEJORADO ⊱━━╮*\n\n`
  teks += `${oi}\n\n`
  teks += `*👥 Grupo:* ${await conn.getName(m.chat)}\n`
  teks += `*👤 Total miembros:* ${participants.length}\n\n`
  
  if (onlineUsers.length > 0) {
    teks += `*🟢 Usuarios activos recientemente (${onlineUsers.length}):*\n${onlineUsers.join('\n')}\n\n`
  }
  
  teks += `*🔴 Otros miembros (${offlineUsers.length}):*\n${offlineUsers.join('\n')}\n\n`
  teks += `*╰━━━ ${conn.getName(conn.user.jid).split('@')[0]} ━━━╯*`

  await conn.sendMessage(m.chat, { 
    text: teks.trim(), 
    mentions 
  })
}

// Función auxiliar para verificar actividad reciente
async function checkRecentActivity(conn, userId, groupId) {
  try {
    // Obtener los últimos mensajes del grupo (limitado a 50)
    let messages = await conn.loadMessages(groupId, 50)
    // Verificar si el usuario ha enviado mensajes recientemente (últimos 5 minutos)
    let recentMsg = messages.find(m => 
      m.key.fromMe === false && 
      m.key.participant === userId && 
      (new Date() - new Date(m.messageTimestamp * 1000)) < 300000 // 5 minutos
    
    return !!recentMsg
  } catch (e) {
    console.error('Error al verificar actividad:', e)
    return false
  }
}

handler.command = /^(tagall|invocar|todos|mencionar)$/i
handler.admin = true
handler.botAdmin = true
handler.group = true

export default handler
