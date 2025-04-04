let handler = m => m

handler.before = async function (m, { conn, groupMetadata }) {
  if (!m.messageStubType || !m.isGroup) return
  if (m.messageStubType !== 20) return // 20 = Creación de grupo

  let subject = groupMetadata.subject || "el grupo"
  let welcomeBot = `✨ ¡Hola a todos! Soy su nuevo bot en *${subject}*! 🤖\n\n👮 Recuerden seguir las reglas del grupo.\n💡 Si necesitan ayuda, escriban *#menu* para ver mis comandos.`

  await this.sendMessage(m.chat, { text: welcomeBot }, { quoted: m })

  // Enviar opciones de guía como menú simulado
  let menuBotones = `¿Qué deseas consultar?\n\n1️⃣ Ver Guía\n2️⃣ Ver Guía 2\n\nEscribe el número de la opción.`
  await this.sendMessage(m.chat, { text: menuBotones }, { quoted: m })
}

export default handler
