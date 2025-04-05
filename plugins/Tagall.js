let handler = async (m, { isOwner, isAdmin, conn, participants }) => {
  if (!(isAdmin || isOwner)) {
    global.dfail('admin', m, conn)
    throw false
  }

  // Método mejorado para detectar estado
  const getStatus = async (jid) => {
    try {
      // 1. Intenta con la presencia en el grupo
      const presence = conn.presence[m.chat]?.[jid]?.lastKnownPresence
      if (presence === 'available') return '🟢 Online'
      
      // 2. Verifica última conexión con margen de error
      const status = await conn.fetchStatus(jid).catch(() => null)
      if (status?.lastSeen) {
        const lastSeen = new Date(status.lastSeen).getTime()
        return (Date.now() - lastSeen) < 300000 ? '🟢 Online' : '🔴 Offline'
      }
      
      // 3. Si todo falla, verifica si está escribiendo
      const isTyping = conn.chats[m.chat]?.messages?.find(
        msg => msg.key.fromMe === false && msg.key.participant === jid
      )?.messageTimestamp > Date.now() - 60000
      
      return isTyping ? '🟢 Online' : '🔴 Offline'
    } catch {
      return '⚪ Desconocido'
    }
  }

  let teks = `*╭━* 𝙀𝙎𝙏𝘼𝘿𝙊𝙎 𝙀𝙉 𝙏𝙄𝙀𝙈𝙋𝙊 𝙍𝙀𝘼𝙇\n\n`
  teks += `👤 𝙈𝙄𝙀𝙈𝘽𝙍𝙊𝙎: *${participants.length}*\n\n`
  teks += '┌─────────────┬──────────────┐\n'
  teks += '│  𝙐𝙎𝙐𝘼𝙍𝙄𝙊   │   𝙀𝙎𝙏𝘼𝘿𝙊    │\n'
  teks += '├─────────────┼──────────────┤\n'

  // Verificación paralela para mayor velocidad
  const statusPromises = participants.map(async mem => {
    const status = await getStatus(mem.id)
    return `│ @${mem.id.split('@')[0].padEnd(11)} │ ${status.padEnd(12)} │\n`
  })
  
  const statusLines = await Promise.all(statusPromises)
  teks += statusLines.join('')

  teks += '└─────────────┴──────────────┘\n'
  teks += `*╰━* 𝙀𝙇𝙄𝙏𝙀 𝘽𝙊𝙏 𝙂𝙇𝙊𝘽𝘼𝙇`

  await conn.sendMessage(
    m.chat, 
    { 
      text: teks, 
      mentions: participants.map(a => a.id)
    }
  )
}

// Configuración esencial para recibir actualizaciones de presencia
export function before(conn) {
  conn.ev.on('presence.update', async ({ id, presences }) => {
    if (!conn.presence) conn.presence = {}
    conn.presence[id] = presences
  })
  
  // Actualizar presencia cada 3 minutos
  setInterval(() => {
    conn.updatePresence(m.chat, 'available')
  }, 180000)
}

handler.command = /^(estados|online|kevin)$/i
handler.admin = true
export default handler
