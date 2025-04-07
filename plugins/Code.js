import { useMultiFileAuthState, makeWASocket, makeCacheableSignalKeyStore, fetchLatestBaileysVersion, PHONENUMBER_MCC } from '@whiskeysockets/baileys'
import fs from 'fs'
import pino from 'pino'
import path from 'path'

const handler = async (m, { args, conn, usedPrefix, command }) => {
  let phone = (args[0] || '').replace(/[^0-9]/g, '')
  if (!phone) return m.reply(`*Formato incorrecto.*\n\nUsa así:\n${usedPrefix + command} 51987654321`)

  if (!Object.keys(PHONENUMBER_MCC).some(v => phone.startsWith(v))) {
    return m.reply('Número no válido o sin prefijo internacional.')
  }

  const folderPath = `./GataJadiBot/${phone}`
  if (!fs.existsSync(folderPath)) fs.mkdirSync(folderPath, { recursive: true })

  const { state, saveCreds } = await useMultiFileAuthState(folderPath)
  const { version } = await fetchLatestBaileysVersion()

  const sock = makeWASocket({
    version,
    logger: pino({ level: 'silent' }),
    browser: ["Ubuntu", "Chrome", "20.0.04"],
    printQRInTerminal: false,
    auth: {
      creds: state.creds,
      keys: makeCacheableSignalKeyStore(state.keys, pino({ level: 'fatal' }))
    }
  })

  sock.ev.on('connection.update', async (update) => {
    const { connection, lastDisconnect } = update

    if (connection === 'open') {
      await m.reply(`*Sesión conectada correctamente con el número:* wa.me/${phone}`)
    }

    if (connection === 'close') {
      console.log('Conexión cerrada', lastDisconnect?.error)
    }
  })

  // Esperamos a que esté listo
  await new Promise(resolve => setTimeout(resolve, 3000))

  if (!sock.authState.creds.registered) {
    try {
      let code = await sock.requestPairingCode(phone)
      code = code?.match(/.{1,4}/g)?.join('-')
      await m.reply(`*Código de vinculación para* wa.me/${phone}:\n\n> ${code}\n\n1. Abre WhatsApp\n2. Ve a Dispositivos vinculados\n3. Opción "Vincular usando número"\n4. Ingresa este código`)
    } catch (e) {
      await m.reply('Error al generar código. ¿El número tiene WhatsApp y está habilitado para recibir código de vinculación?')
      console.error(e)
    }
  }
}

handler.command = ['code']
handler.help = ['code <número>']
handler.tags = ['subbot']
handler.rowner = true // Solo el dueño puede usarlo

export default handler
