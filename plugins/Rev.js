import { generateWAMessageFromContent } from '@whiskeysockets/baileys'

let handler = m => m

handler.before = async function (m, { conn, groupMetadata }) {
  if (!m.messageStubType || !m.isGroup) return
  if (m.messageStubType !== 20) return // 20 = Creación de grupo
  
  let subject = groupMetadata.subject || "el grupo"
  let welcomeBot = `✨ ¡Hola a todos! Soy su nuevo bot en *${subject}*! 🤖\n\n👮 Recuerden seguir las reglas del grupo.\n💡 Si necesitan ayuda, elijan una opción:`

  let buttons = [
    { buttonId: '#menu', buttonText: { displayText: '📜 Menú' }, type: 1 },
    { buttonId: '#reglas', buttonText: { displayText: '📌 Reglas' }, type: 1 },
    { buttonId: '#info', buttonText: { displayText: 'ℹ️ Info del bot' }, type: 1 }
  ]

  let buttonMessage = {
    text: welcomeBot,
    footer: 'Super Bot 🤖',
    buttons: buttons,
    headerType: 1
  }

  await conn.sendMessage(m.chat, buttonMessage, { quoted: m })
}

export default handler
