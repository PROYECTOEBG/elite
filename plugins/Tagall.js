let handler = async (m, { isOwner, isAdmin, conn, text, participants, args }) => {
  if (!(isAdmin || isOwner)) {
    global.dfail('admin', m, conn)
    throw false
  }

  // Configuración inicial
  const startTime = Date.now()
  const message = args.join` ` || '📢 ¡Atención necesaria!'
  const groupName = await conn.getName(m.chat)
  const totalMembers = participants.length
  const mentions = []
  const statusResults = []

  // Función mejorada para verificar estado
  const checkUserStatus = async (userId) => {
    try {
      // Suscripción a presencia con timeout
      await conn.presenceSubscribe(userId)
      
      // Esperar múltiples verificaciones para mayor precisión
      let statusChecks = []
      for (let i = 0; i < 3; i++) {
        await new Promise(resolve => setTimeout(resolve, 500))
        const presence = conn.presence[userId]?.lastKnownPresence
        if (presence) statusChecks.push(presence)
      }

      // Determinar el estado más frecuente
      const statusCount = {}
      statusChecks.forEach(s => statusCount[s] = (statusCount[s] || 0) + 1)
      const finalStatus = Object.keys(statusCount).reduce((a, b) => 
        statusCount[a] > statusCount[b] ? a : b, 'unavailable')

      return {
        status: finalStatus,
        lastSeen: conn.presence[userId]?.lastSeen || null
      }
    } catch (e) {
      return { status: 'unavailable', error: e.message }
    }
  }

  // Procesar cada miembro
  for (const member of participants) {
    const userId = member.id
    mentions.push(userId)
    
    const userTag = `@${userId.split('@')[0]}`
    const { status, lastSeen } = await checkUserStatus(userId)
    
    statusResults.push({
      tag: userTag,
      status,
      lastSeen,
      isOnline: status !== 'unavailable'
    })
  }

  // Clasificar usuarios
  const onlineUsers = statusResults.filter(u => u.isOnline)
  const offlineUsers = statusResults.filter(u => !u.isOnline)
  const processingTime = ((Date.now() - startTime) / 1000).toFixed(2)

  // Construir mensaje detallado
  let statusMessage = `*╭━━⊰ 🟢🔴 ESTADO DE MIEMBROS ⊱━━╮*\n\n`
  statusMessage += `${message}\n\n`
  statusMessage += `*👥 Grupo:* ${groupName}\n`
  statusMessage += `*👤 Total miembros:* ${totalMembers}\n`
  statusMessage += `*⏱ Tiempo de escaneo:* ${processingTime}s\n\n`

  if (onlineUsers.length > 0) {
    statusMessage += `*🟢 EN LÍNEA (${onlineUsers.length}):*\n`
    onlineUsers.forEach(user => {
      statusMessage += `${user.tag} (${formatStatus(user.status)}`
      if (user.lastSeen) statusMessage += ` - Últ. vez: ${formatTime(user.lastSeen)}`
      statusMessage += '\n'
    })
    statusMessage += '\n'
  }

  statusMessage += `*🔴 OFFLINE (${offlineUsers.length}):*\n`
  statusMessage += offlineUsers.map(u => u.tag).join('\n')
  statusMessage += `\n\n*╰━━⊰ 🤖 ${conn.getName(conn.user.jid).split('@')[0]} ⊱━━╯*`

  // Funciones auxiliares
  function formatStatus(status) {
    const statusMap = {
      'available': 'En línea',
      'composing': 'Escribiendo...',
      'recording': 'Grabando...',
      'unavailable': 'Offline'
    }
    return statusMap[status] || status
  }

  function formatTime(timestamp) {
    const minutes = Math.floor((Date.now() - timestamp) / 60000)
    return minutes < 1 ? 'ahora' : `hace ${minutes} min`
  }

  // Enviar mensaje final
  await conn.sendMessage(m.chat, {
    text: statusMessage,
    mentions
  })
}

handler.command = /^(estado|onlinecheck|veronline)$/i
handler.admin = true
handler.group = true
export default handler
