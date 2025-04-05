import makeWASocket from '@whiskeysockets/baileys'
import { useSingleFileAuthState } from '@whiskeysockets/baileys'
import { Boom } from '@hapi/boom'
import P from 'pino'

const { state, saveState } = useSingleFileAuthState('./session.json')

const sock = makeWASocket({
  auth: state,
  printQRInTerminal: true,
  logger: P({ level: 'silent' })
})

sock.ev.on('creds.update', saveState)

sock.ev.on('messages.upsert', async ({ messages }) => {
  const msg = messages[0]
  if (!msg.message || !msg.key.fromMe) return

  const texto = msg.message.conversation || msg.message.extendedTextMessage?.text
  if (!texto) return

  if (texto.startsWith('.salir ')) {
    const groupId = texto.slice(7).trim()

    if (!groupId.endsWith('@g.us')) {
      await sock.sendMessage(msg.key.remoteJid, { text: `ID inválido. Asegúrate de usar el formato correcto: 1203xxxx@g.us` })
      return
    }

    try {
      await sock.sendMessage(groupId, { text: 'Saliendo del grupo...' })
      await sock.groupLeave(groupId)
      await sock.sendMessage(msg.key.remoteJid, { text: `Salí del grupo: ${groupId}` })
    } catch (error) {
      await sock.sendMessage(msg.key.remoteJid, { text: `Error al salir del grupo: ${error.message}` })
    }
  }
})
