import { generateWAMessageFromContent, proto } from '@whiskeysockets/baileys'

let handler = m => m

handler.before = async function (m, { conn, groupMetadata }) {
  if (!m.messageStubType || !m.isGroup) return
  if (m.messageStubType !== 20) return // 20 = Creación de grupo
  
  let subject = groupMetadata.subject || "el grupo"
  let welcomeBot = `✨ ¡Hola a todos! Soy su nuevo bot en *${subject}*! 🤖\n\n👮 Recuerden seguir las reglas del grupo.\n💡 Si necesitan ayuda, seleccionen una opción:`

  let templateMessage = {
    hydratedTemplate: {
      hydratedContentText: welcomeBot,
      hydratedFooterText: '📌 Super Bot 🤖',
      hydratedButtons: [
        {
          urlButton: {
            displayText: "🌐 Página Web",
            url: "https://example.com"
          }
        },
        {
          quickReplyButton: {
            displayText: "📜 Menú",
            id: "#menu"
          }
        },
        {
          quickReplyButton: {
            displayText: "📌 Reglas",
            id: "#reglas"
          }
        },
        {
          quickReplyButton: {
            displayText: "ℹ️ Info del bot",
            id: "#info"
          }
        }
      ]
    }
  }

  let message = generateWAMessageFromContent(m.chat, proto.Message.fromObject({
    viewOnceMessage: {
      message: {
        templateMessage
      }
    }
  }), { userJid: m.sender })

  await conn.relayMessage(m.chat, message.message, {})
}

export default handler
