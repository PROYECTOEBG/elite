let handler = async (m, { isOwner, isAdmin, conn, text, participants, args }) => {
  if (!(isAdmin || isOwner)) {
    global.dfail('admin', m, conn)
    throw false
  }

  let pesan = args.join` `
  let oi = `📩 ${lenguajeGB['smsAddB5']()} ${pesan || ''}`

  let online = ''
  let offline = ''
  let mentions = []

  for (let mem of participants) {
    let id = mem.id
    mentions.push(id)

    await conn.presenceSubscribe(id).catch(() => {})
    await new Promise(resolve => setTimeout(resolve, 150))

    let estado = conn.presence && conn.presence[id] && conn.presence[id].lastKnownPresence || 'offline'
    let estadoTexto = estado === 'available' ? '🟢 Online' : '🔴 Offline'

    let linea = `@${id.split('@')[0]} ${estadoTexto}\n`
    if (estadoTexto.includes('Online')) {
      online += linea
    } else {
      offline += linea
    }
  }

  let teks = `*╭━━⊰ TAGALL CON ESTADO ⊱━━*\n\n`
  teks += `${oi}\n\n`
  teks += `*👥 Grupo:* ${await conn.getName(m.chat)}\n`
  teks += `*👤 Miembros:* ${participants.length}\n\n`

  if (online) teks += `*🟢 Usuarios Online:*\n${online}\n`
  if (offline) teks += `*🔴 Usuarios Offline:*\n${offline}\n`

  teks += `*╰━━━ ELITE BOT GLOBAL ━━━╯*`

  conn.sendMessage(m.chat, { text: teks.trim(), mentions }, )
}

handler.command = /^(kevin|invocar|invocacion|todos|invocación)$/i
handler.admin = true
handler.botAdmin = true
handler.group = true

export default handler
