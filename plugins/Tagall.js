let handler = async (m, { isOwner, isAdmin, conn, participants }) => {
  if (!(isAdmin || isOwner)) {
    global.dfail('admin', m, conn)
    throw false
  }

  // Método ultra-confiable para detectar estado
  const getStatus = (jid) => {
    try {
      // 1. Verificar si el usuario está actualmente en el chat
      const chat = conn.chats.get(m.chat)
      if (chat?.messages) {
        const userMessages = chat.messages.filter(
          msg => msg.key.fromMe === false && msg.key.participant === jid
        )
        const lastActive = userMessages[0]?.messageTimestamp
        if (lastActive && (Date.now()/1000 - lastActive) < 600) {
          return '🟢 Online'
        }
      }

      // 2. Verificar última conexión general
      const user = conn.contacts[jid] || {}
      if (user.lastSeen) {
        return (Date.now() - user.lastSeen) < 300000 ? '🟢 Online' : '🔴 Offline'
      }

      // 3. Método alternativo para grupos
      const groupMetadata = await conn.groupMetadata(m.chat)
      const participantData = groupMetadata.participants.find(p => p.id === jid)
      if (participantData?.lastSeen) {
        return '🟡 Reciente'
      }

      return '⚪ Sin datos'
    } catch (e) {
      console.error('Error al verificar estado:', e)
      return '🔵 Verificar manual'
    }
  }

  let teks = `*╭━* 𝙀𝙎𝙏𝘼𝘿𝙊𝙎 𝙍𝙀𝘼𝙇𝙀𝙎\n\n`
  teks += `👥 𝙈𝙄𝙀𝙈𝘽𝙍𝙊𝙎: *${participants.length}*\n\n`
  teks += '┌─────────────┬──────────────┐\n'
  teks += '│  𝙀𝙎𝙐𝘼𝙍𝙄𝙊   │   𝙀𝙎𝙏𝘼𝘿𝙊    │\n'
  teks += '├─────────────┼──────────────┤\n'

  for (let mem of participants) {
    const status = getStatus(mem.id)
    teks += `│ @${mem.id.split('@')[0].padEnd(11)} │ ${status.padEnd(12)} │\n`
  }

  teks += '└─────────────┴──────────────┘\n'
  teks += `*╰━* 𝙀𝙇𝙄𝙏𝙀𝘽𝙊𝙏-𝙈𝘿`

  await conn.sendMessage(
    m.chat, 
    { 
      text: teks,
      mentions: participants.map(a => a.id)
    },
    { quoted: m }
  )
}

// Configuración esencial
export function before(conn) {
  // Almacenar últimos mensajes
  conn.ev.on('messages.upsert', ({ messages }) => {
    messages.forEach(msg => {
      if (msg.key.remoteJid) {
        if (!conn.chats[msg.key.remoteJid]) {
          conn.chats[msg.key.remoteJid] = { messages: [] }
        }
        conn.chats[msg.key.remoteJid].messages.push(msg)
      }
    })
  })
}

handler.command = /^(estados|online|kevin|verestados)$/i
handler.admin = true
handler.group = true
export default handler
