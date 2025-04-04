let handler = m => m

handler.before = async function (m, { conn, groupMetadata }) {
  if (!m.messageStubType || !m.isGroup) return
  if (m.messageStubType !== 20) return // 20 = Creación de grupo
  
  let subject = groupMetadata.subject || "el grupo"
  let welcomeBot = `✨ ¡Hola a todos! Soy su nuevo bot en *${subject}*! 🤖\n\n👮 Recuerden seguir las reglas del grupo.\n💡 Si necesitan ayuda, seleccionen una opción:` 

  let buttons = [
    {buttonId: 'guia1', buttonText: {displayText: '📖 Guía1'}, type: 1},
    {buttonId: 'guia2', buttonText: {displayText: '📘 Guía2'}, type: 1}
  ]

  let buttonMessage = {
    text: welcomeBot,
    footer: "Seleccione una opción:",
    templateButtons: buttons,
    headerType: 1
  }

  try {
    await conn.sendMessage(m.chat, buttonMessage)
  } catch (e) {
    console.error("Error enviando botones:", e)
  }
}

export default handler
