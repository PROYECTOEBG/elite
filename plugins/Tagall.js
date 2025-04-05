let handler = async (m, { isOwner, isAdmin, conn, participants }) => {
  if (!(isAdmin || isOwner)) {
    global.dfail('admin', m, conn)
    throw false
  }

  // Método 1: Verificar última conexión (más preciso)
  const getStatus = async (jid) => {
    try {
      const user = await conn.fetchStatus(jid)
      const lastSeen = user.lastSeen?.getTime() || 0
      const isOnline = (Date.now() - lastSeen) < 120_000 // 2 minutos de margen
      return isOnline ? '🟢 Online' : '🔴 Offline'
    } catch {
      return '🔴 Offline'
    }
  }

  // Método 2: Usar presencia en grupo (requiere Baileys v5+)
  /* 
  const getStatus = (jid) => {
    const presence = conn.presence.get(m.chat, jid)?.lastKnownPresence
    return presence === 'available' ? '🟢 Online' : '🔴 Offline'
  }
  */

  let teks = `*╭━* 𝙀𝙎𝙏𝘼𝘿𝙊𝙎 𝙀𝙉 𝙏𝙄𝙀𝙈𝙋𝙊 𝙍𝙀𝘼𝙇\n\n`
  teks += `👤 𝙈𝙄𝙀𝙈𝘽𝙍𝙊𝙎: *${participants.length}*\n\n`
  teks += '┌─────────────┬──────────────┐\n'
  teks += '│  𝙐𝙎𝙐𝘼𝙍𝙄𝙊   │   𝙀𝙎𝙏𝘼𝘿𝙊   │\n'
  teks += '├─────────────┼──────────────┤\n'

  for (let mem of participants) {
    const status = await getStatus(mem.id)
    teks += `│ @${mem.id.split('@')[0].padEnd(11)} │ ${status.padEnd(12)} │\n`
  }

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

handler.command = /^(estados|online|kevin)$/i
handler.admin = true
export default handler
