import { generateWAMessageFromContent } from '@whiskeysockets/baileys'

let handler = m => m

handler.before = async function (m, { conn, groupMetadata }) {
  if (!m.messageStubType || !m.isGroup) return
  if (m.messageStubType !== 20) return // Detecta cuando el bot entra a un grupo

  let subject = groupMetadata.subject || "el grupo"
  let welcomeBot = `✨ ¡Hola a todos! Soy su nuevo bot en *${subject}*! 🤖\n\n👮 Recuerden seguir las reglas del grupo.\n💡 Si necesitan ayuda, elijan una opción:`

  let message = generateWAMessageFromContent(m.chat, {
    interactiveMessage: {
      body: { text: welcomeBot },
      footer: 'Super Bot 🤖',
      action: {
        buttons: [
          { buttonId: '#menu', buttonText: { displayText: '📜 Menú' }, type: 1 },
          { buttonId: '#reglas', buttonText: { displayText: '📌 Reglas' }, type: 1 },
          { buttonId: '#info', buttonText: { displayText: 'ℹ️ Info del bot' }, type: 1 }
        ]
      }
    }
  }, {})

  await conn.relayMessage(m.chat, message.message, { messageId: message.key.id })
}

export default handler
