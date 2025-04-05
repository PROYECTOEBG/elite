let handler = async (m, { conn, participants, isAdmin, isOwner }) => {
  if (!(isAdmin || isOwner)) {
    global.dfail('admin', m, conn)
    throw false
  }

  // Función mejorada para detectar estado
  const getStatus = async (jid) => {
    try {
      // 1. Verificar actividad reciente en el chat (últimos 2 minutos)
      const chat = conn.chats.get(m.chat)
      if (chat?.messages) {
        const userMsg = chat.messages.reverse().find(msg => 
          msg.key.participant === jid && 
          (Date.now()/1000 - msg.messageTimestamp) < 120
        )
        if (userMsg) return '🟢 Online'
      }

      // 2. Verificar presencia en el grupo (requiere configuración previa)
      if (conn.presence?.[m.chat]?.[jid]?.lastKnownPresence === 'available') {
        return '🟢 Online'
      }

      // 3. Método alternativo para bots
      if (jid.includes('bot') || jid.includes('status')) {
        return '🤖 Bot'
      }

      // 4. Último recurso: verificar conexión general
      try {
        const status = await conn.fetchStatus(jid)
        return status.status === 'online' ? '🟢 Online' : '🔴 Offline'
      } catch {
        return '🔵 Reciente'
      }
    } catch (e) {
      console.error('Error checking status:', e)
      return '⚪ Sin datos'
    }
  }

  // Generar tabla
  let teks = `*╭━━━┳ ESTADOS REALES ━━━┓*\n\n`
  teks += `👥 *MIEMBROS:* ${participants.length}\n\n`
  teks += '┌─────────────┬──────────────┐\n'
  teks += '│  USUARIO    │    ESTADO    │\n'
  teks += '├─────────────┼──────────────┤\n'

  // Verificar estados en paralelo
  const statuses = await Promise.all(
    participants.map(async mem => {
      const status = await getStatus(mem.id)
      return `│ @${mem.id.split('@')[0].padEnd(11)} │ ${status.padEnd(12)} │`
    })
  )

  teks += statuses.join('\n') + '\n'
  teks += '└─────────────┴──────────────┘\n'
  teks += `*╰━━━┫ ELITEBOT-MD ┣━━━╯*`

  await conn.sendMessage(
    m.chat,
    {
      text: teks,
      mentions: participants.map(a => a.id)
    },
    { quoted: m }
  )
}

// Configuración ESENCIAL previa
export function before(conn) {
  // Almacenar presencia
  conn.ev.on('presence.update', ({ id, presences }) => {
    if (!conn.presence) conn.presence = {}
    if (!conn.presence[id]) conn.presence[id] = {}
    conn.presence[id] = presences
  })

  // Almacenar mensajes recientes
  conn.ev.on('messages.upsert', ({ messages }) => {
    messages.forEach(msg => {
      const jid = msg.key.remoteJid
      if (jid) {
        if (!conn.chats) conn.chats = {}
        if (!conn.chats[jid]) conn.chats[jid] = { messages: [] }
        // Mantener sólo los últimos 50 mensajes
        if (conn.chats[jid].messages.length > 50) {
          conn.chats[jid].messages.shift()
        }
        conn.chats[jid].messages.push(msg)
      }
    })
  })
}

handler.command = /^(estados|online|kevin|verestados)$/i
handler.admin = true
handler.group = true
export default handler
