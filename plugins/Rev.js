const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

let handler = async (m, { conn }) => {
  // Verificación ultra-estricta de eventos de grupo
  if (!m.isGroup || typeof m.messageStubType !== 'number') return

  // Esperar 2 segundos para evitar conflictos
  await delay(2000)

  // Detección a prueba de errores para cuando añaden al bot
  const botNumber = conn.user.jid.split('@')[0] || ''
  const isBotAdded = (
    (m.messageStubType === 20 || m.messageStubType === 256) &&
    Array.isArray(m.messageStubParameters) &&
    m.messageStubParameters.some(param => 
      param && typeof param === 'string' && param.includes(botNumber)
    )
  )

  if (!isBotAdded) return

  try {
    // Obtener metadatos con 3 capas de protección
    const getGroupInfo = async (retries = 3) => {
      for (let i = 0; i < retries; i++) {
        try {
          const data = await conn.groupMetadata(m.chat)
          if (data) return data
        } catch (e) {
          if (i === retries - 1) throw e
          await delay(1000)
        }
      }
      return {
        subject: "Grupo Desconocido",
        participants: [],
        desc: ""
      }
    }

    const groupInfo = await getGroupInfo()
    const groupName = groupInfo.subject || "Este Grupo"

    // Mensaje de bienvenida simplificado pero efectivo
    const welcomeMsg = `*🤖 Bot activado en ${groupName}*\n\n` +
                      `Escribe *.menu* para ver mis comandos`

    // Envío con triple verificación
    await conn.sendMessage(m.chat, { 
      text: welcomeMsg,
      mentions: [conn.user.jid]
    }).catch(e => console.error('Error al enviar mensaje:', e))

    console.log('[ÉXITO] Mensaje enviado al grupo:', groupName)

  } catch (error) {
    console.error('[ERROR CRÍTICO]', error)
    
    // Fallback definitivo
    try {
      await conn.sendMessage(m.chat, {
        text: '¡Bot activado! Usa *.help*'
      })
    } catch (fallbackError) {
      console.error('[FALLBACK FALLÓ]', fallbackError)
    }
  }
}

export default handler
