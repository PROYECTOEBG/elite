/*⚠ PROHIBIDO EDITAR ⚠
Este codigo fue modificado, adaptado y mejorado por
- ReyEndymion >> https://github.com/ReyEndymion
El codigo de este archivo esta inspirado en el codigo original de:
- Aiden_NotLogic >> https://github.com/ferhacks
*El archivo original del MysticBot-MD fue liberado en mayo del 2024 aceptando su liberacion*
El codigo de este archivo fue parchado en su momento por:
- BrunoSobrino >> https://github.com/BrunoSobrino
Contenido adaptado para GataBot-MD por:
- GataNina-Li >> https://github.com/GataNina-Li
- elrebelde21 >> https://github.com/elrebelde21
*/

import { useMultiFileAuthState, makeWASocket, makeCacheableSignalKeyStore, fetchLatestBaileysVersion, PHONENUMBER_MCC } from '@whiskeysockets/baileys'
import fs from 'fs'
import pino from 'pino'
import path from 'path'
import chalk from 'chalk'
import '../plugins/_content.js'

const handler = async (m, { args, conn, usedPrefix, command, isOwner }) => {
if (!global.db.data.settings[conn.user.jid].jadibotmd) return m.reply(`${lenguajeGB['smsSoloOwnerJB']()}`)
if (m.fromMe || conn.user.jid === m.sender) return

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
browser: ["GataBot-MD (Sub Bot)", "Chrome", "2.0.0"],
printQRInTerminal: false,
auth: {
creds: state.creds,
keys: makeCacheableSignalKeyStore(state.keys, pino({ level: 'fatal' }))
}
})

sock.ev.on('connection.update', async (update) => {
const { connection, lastDisconnect } = update

if (connection === 'open') {
console.log(chalk.bold.cyanBright(`\n❒⸺⸺⸺⸺【• SUB-BOT •】⸺⸺⸺⸺❒\n│\n│ 🟢 ${phone} conectado exitosamente.\n│\n❒⸺⸺⸺【• CONECTADO •】⸺⸺⸺❒`))
await m.reply(`${lenguajeGB['smsJBConexionTrue2']()} ${usedPrefix + command}`)

let chtxt = `
👤 *Usuario:* ${phone}
🔑 *Método de conexión:* Código de vinculación
💻 *Browser:* Chrome
📱 *WhatsApp:* ${m?.isWABusiness ? 'Business' : 'Messenger'}
🐈 *Bot:* ${gt}
⭐ *Versión del bot:* \`${vs}\`
💫 *Versión sub bot:* \`${vsJB}\`
`.trim()

await global.conn.sendMessage(ch.ch1, { text: chtxt, contextInfo: {
externalAdReply: {
title: "【 🔔 Notificación General 🔔 】",
body: '🙀 ¡Nuevo sub-bot encontrado!',
thumbnail: gataMenu,
mediaType: 1,
mediaUrl: '',
sourceUrl: ''
}}}, { quoted: m })
}

if (connection === 'close') {
console.log(chalk.redBright('Conexión cerrada:', lastDisconnect?.error))
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

handler.command = /^(serbotcode|codebot|vincularbot)/i
handler.help = ['serbotcode <número>']
handler.tags = ['subbot']
handler.rowner = true

export default handler
