let handler = async (m, { isOwner, isAdmin, conn, text, participants, args }) => {
  if (!(isAdmin || isOwner)) {
    global.dfail('admin', m, conn)
    throw false
  }

  let pesan = args.join` `
  let oi = `📩 ${lenguajeGB['smsAddB5']()} ${pesan}`
  let teks = `*╭━* ${lenguajeGB['smstagaa']()} \n\n${oi}\n`
  teks += `👤 𝙈𝙄𝙀𝙈𝘽𝙍𝙊𝙎: *${participants.length}*\n\n`

  for (let mem of participants) {
    let id = mem.id
    let jid = id

    // Suscribirse a presencia (si el bot soporta esto)
    await conn.presenceSubscribe(jid).catch(() => {}) // Ignorar errores
    await new Promise(resolve => setTimeout(resolve, 150)) // pequeña espera

    let estado = conn.presence && conn.presence[jid] && conn.presence[jid].lastKnownPresence || "offline"
    let estadoTexto = estado === "available" ? "🟢 Online" : "🔴 Offline"

    teks += `┃👤@${id.split('@')[0]} ${estadoTexto}\n`
  }

  teks += `\n*╰━* 𝙀𝙇𝙄𝙏𝙀 𝘽𝙊𝙏 𝙂𝙇𝙊𝘽𝘼𝙇\n▌│█║▌║▌║║▌║▌║▌║█`
  conn.sendMessage(m.chat, { text: teks, mentions: participants.map(a => a.id) }, )
}

handler.command = /^(tagall|invocar|invocacion|todos|invocación)$/i
handler.admin = true
handler.botAdmin = true
handler.group = true

export default handler
