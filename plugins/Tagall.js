let handler = async (m, { isOwner, isAdmin, conn, text, participants, args, usedPrefix, command }) => {
  if (!(isAdmin || isOwner)) {
    global.dfail('admin', m, conn)
    throw false
  }

  // Verificar si se proporcionó un mensaje
  if (!text && args.length === 0) {
    await conn.sendMessage(m.chat, { 
      text: `✳️ Uso correcto: *${usedPrefix + command}* [mensaje opcional]\n\nEjemplo: *${usedPrefix + command}* Revisen esto por favor!` 
    })
    return
  }

  let pesan = args.join` `
  let oi = `📢 *MENSAJE PARA TODOS:* ${pesan || '¡Se les necesita!'}`
  let online = []
  let offline = []
  let typing = []
  let recording = []
  let mentions = []

  // Procesar cada miembro con manejo de errores
  for (let mem of participants) {
    try {
      let id = mem.id
      mentions.push(id)
      
      // Suscribir a presencia con reintentos
      let retries = 3
      let presenceData = null
      
      while (retries > 0) {
        await conn.presenceSubscribe(id).catch(() => {})
        await new Promise(resolve => setTimeout(resolve, 800)) // Mayor tiempo de espera
        
        presenceData = conn.presence[id]
        if (presenceData?.lastKnownPresence) break
        retries--
      }

      // Determinar estado
      let estado = presenceData?.lastKnownPresence || 'unavailable'
      let userTag = `@${id.split('@')[0]}`
      
      switch(estado) {
        case 'available':
          online.push(userTag)
          break
        case 'composing':
          typing.push(userTag)
          break
        case 'recording':
          recording.push(userTag)
          break
        default:
          offline.push(userTag)
      }
      
    } catch (e) {
      console.error(`Error procesando miembro ${mem.id}:`, e)
      offline.push(`@${mem.id.split('@')[0]}`)
    }
  }

  // Construir mensaje final
  let statusSections = []
  
  if (typing.length > 0) {
    statusSections.push(`*✍️ Escribiendo ahora (${typing.length}):*\n${typing.join('\n')}`)
  }
  
  if (recording.length > 0) {
    statusSections.push(`*🎤 Grabando audio (${recording.length}):*\n${recording.join('\n')}`)
  }
  
  if (online.length > 0) {
    statusSections.push(`*🟢 Online (${online.length}):*\n${online.join('\n')}`)
  }
  
  if (offline.length > 0) {
    statusSections.push(`*🔴 Offline (${offline.length}):*\n${offline.join('\n')}`)
  }

  let teks = `*╭━━⊰ TAGALL CON ESTADO ⊱━━╮*\n\n`
  teks += `${oi}\n\n`
  teks += `*👥 Grupo:* ${await conn.getName(m.chat)}\n`
  teks += `*👤 Total miembros:* ${participants.length}\n\n`
  teks += statusSections.join('\n\n')
  teks += `\n\n*╰━━━ ${conn.getName(conn.user.jid).split('@')[0]} ━━━╯*`

  // Enviar mensaje con menciones
  await conn.sendMessage(m.chat, { 
    text: teks.trim(), 
    mentions: mentions.filter(m => m) // Filtrar menciones inválidas
  }).catch(e => {
    console.error('Error al enviar mensaje:', e)
    m.reply('❌ Ocurrió un error al enviar el mensaje grupal')
  })
}

handler.help = ['tagall <mensaje>', 'invocar <mensaje>']
handler.tags = ['group']
handler.command = /^(kevin|invocar|invocacion|todos|invocación|tagall)$/i
handler.admin = true
handler.botAdmin = true
handler.group = true

export default handler
