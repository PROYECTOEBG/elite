let handler = async (m, { isOwner, isAdmin, conn, text, participants, args, command }) => {
  if (!(isAdmin || isOwner)) {
    global.dfail('admin', m, conn)
    throw false
  }

  // Obtener estado online/offline (simplificado)
  const getStatus = async (jid) => {
    try {
      const status = await conn.fetchStatus(jid) // Usando la conexión existente
      return status.status === 'online' ? '🟢' : '🔴'
    } catch {
      return '🔴'
    }
  }

  let pesan = args.join` `
  let oi = `📩 ${lenguajeGB['smsAddB5']()} ${pesan}`
  let teks = `*╭━* ${lenguajeGB['smstagaa']()}\n\n${oi}\n`
  teks += `👤 𝙈𝙄𝙀𝙈𝘽𝙍𝙊𝙎: *${participants.length}*\n\n`

  // Tabla horizontal con estados
  teks += '┌─────────────┬─────────┐\n'
  teks += '│  𝙐𝙎𝙐𝘼𝙍𝙄𝙊   │ 𝙀𝙎𝙏𝘼𝘿𝙊 │\n'
  teks += '├─────────────┼─────────┤\n'

  for (let mem of participants) {
    const status = await getStatus(mem.id)
    teks += `│ @${mem.id.split('@')[0].padEnd(11)} │   ${status}    │\n`
  }

  teks += '└─────────────┴─────────┘\n\n'
  teks += `*╰━* 𝙀𝙇𝙄𝙏𝙀 𝘽𝙊𝙏 𝙂𝙇𝙊𝘽𝘼𝙇\n▌│█║▌║▌║║▌║▌║▌║█`

  await conn.sendMessage(
    m.chat, 
    { 
      text: teks, 
      mentions: participants.map(a => a.id)
    }
  )
}

handler.command = /^(tagall|invocar|estados|todos|kevin)$/i
handler.admin = true
handler.botAdmin = true
handler.group = true
export default handler
