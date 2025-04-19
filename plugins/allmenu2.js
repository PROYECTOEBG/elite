import pkg from '@whiskeysockets/baileys'
const { generateWAMessageFromContent, proto } = pkg

// Estado global
let listasGrupos = new Map()
let mensajesGrupos = new Map()

const getListasGrupo = (groupId) => {
  if (!listasGrupos.has(groupId)) {
    listasGrupos.set(groupId, {
      squad1: ['➤', '➤', '➤', '➤'],
      squad2: ['➤', '➤', '➤', '➤'],
      suplente: ['➤', '➤', '➤', '➤']
    })
  }
  return listasGrupos.get(groupId)
}

const reiniciarListas = (groupId) => {
  listasGrupos.set(groupId, {
    squad1: ['➤', '➤', '➤', '➤'],
    squad2: ['➤', '➤', '➤', '➤'],
    suplente: ['➤', '➤', '➤', '➤']
  })
}

let handler = async (m, { conn }) => {
  const groupId = m.chat
  const msgText = m.text
  let listas = getListasGrupo(groupId)

  if (msgText.toLowerCase().startsWith('.listaff')) {
    const mensaje = msgText.substring(8).trim()
    if (!mensaje) {
      await conn.sendMessage(m.chat, {
        text: `❌ 𝗗𝗘𝗕𝗘𝗦 𝗜𝗡𝗚𝗥𝗘𝗦𝗔𝗥 𝗨𝗡 𝗧𝗘𝗫𝗧𝗢\n\n𝗘𝗷𝗲𝗺𝗽𝗹𝗼:\n.listaff Actívense para la ranked 🎮`
      })
      return
    }

    reiniciarListas(groupId)
    listas = getListasGrupo(groupId)
    mensajesGrupos.set(groupId, mensaje)

    await enviarLista(conn, m.chat, listas, mensaje)
  }

  return
}

// Función para enviar la lista con botones
async function enviarLista(conn, chat, listas, mensaje) {
  const texto = `*${mensaje}*\n
╭─────────────╮
│ 𝗘𝗦𝗖𝗨𝗔𝗗𝗥𝗔 1
│👑 ${listas.squad1[0]}
│🥷🏻 ${listas.squad1[1]}
│🥷🏻 ${listas.squad1[2]}
│🥷🏻 ${listas.squad1[3]}
╰─────────────╯
╭─────────────╮
│ 𝗘𝗦𝗖𝗨𝗔𝗗𝗥𝗔 2
│👑 ${listas.squad2[0]}
│🥷🏻 ${listas.squad2[1]}
│🥷🏻 ${listas.squad2[2]}
│🥷🏻 ${listas.squad2[3]}
╰─────────────╯
╭─────────────╮
│ 𝗦𝗨𝗣𝗟𝗘𝗡𝗧𝗘𝗦
│🥷🏻 ${listas.suplente[0]}
│🥷🏻 ${listas.suplente[1]}
│🥷🏻 ${listas.suplente[2]}
│🥷🏻 ${listas.suplente[3]}
╰─────────────╯
𝗘𝗟𝗜𝗧𝗘 𝗕𝗢𝗧 𝗚𝗟𝗢𝗕𝗔𝗟
❙❘❙❙❘❙❚❙❘❙❙❚❙❘❙❘❙❚❙❘❙❙❚❙❘❙❙❘❙❚❙❘`

  const buttons = [
    {
      name: 'quick_reply',
      buttonParamsJson: JSON.stringify({
        display_text: 'Escuadra 1',
        id: 'escuadra1'
      })
    },
    {
      name: 'quick_reply',
      buttonParamsJson: JSON.stringify({
        display_text: 'Escuadra 2',
        id: 'escuadra2'
      })
    },
    {
      name: 'quick_reply',
      buttonParamsJson: JSON.stringify({
        display_text: 'Suplente',
        id: 'suplente'
      })
    }
  ]

  const msg = generateWAMessageFromContent(chat, {
    viewOnceMessage: {
      message: {
        messageContextInfo: {
          deviceListMetadata: {},
          mentionedJid: []
        },
        interactiveMessage: proto.Message.InteractiveMessage.create({
          body: { text: texto },
          footer: { text: 'Selecciona una opción:' },
          nativeFlowMessage: { buttons }
        })
      }
    }
  }, {})

  await conn.relayMessage(chat, msg.message, { messageId: msg.key.id })
}

// Función after: para cuando presionan botón
export async function after(m, { conn }) {
  try {
    const button = m?.message?.buttonsResponseMessage
    if (!button) return

    const id = button.selectedButtonId
    const groupId = m.chat
    const nombreUsuario = m.pushName || m.sender.split('@')[0]
    const tag = m.sender
    const listas = getListasGrupo(groupId)

    // Borrar de otras escuadras
    Object.keys(listas).forEach(key => {
      const index = listas[key].findIndex(p => p.includes(`@${nombreUsuario}`))
      if (index !== -1) listas[key][index] = '➤'
    })

    const squadType = id === 'escuadra1' ? 'squad1' : id === 'escuadra2' ? 'squad2' : 'suplente'
    const libre = listas[squadType].findIndex(p => p === '➤')

    if (libre !== -1) {
      listas[squadType][libre] = `@${nombreUsuario}`
    }

    const mensajeGuardado = mensajesGrupos.get(groupId)
    if (mensajeGuardado) {
      await enviarLista(conn, m.chat, listas, mensajeGuardado)
    }
  } catch (e) {
    console.error('❌ Error en after:', e)
    await conn.sendMessage(m.chat, { text: '❌ Error al procesar tu selección' })
  }
}

handler.customPrefix = /^(?=\.listaff\s|escuadra\s[12]|suplente)/i
handler.command = new RegExp
handler.group = true

export default handler
