let handler = m => m

handler.before = async function (m, { conn, groupMetadata }) {
  // Verificamos que sea evento de creación de grupo
  if (!m.messageStubType || !m.isGroup) return
  if (m.messageStubType !== 20) return // 20 = Creación de grupo

  let subject = groupMetadata.subject || 'el grupo'
  let welcomeText = `✨ ¡Hola a todos! Soy su nuevo bot en *${subject}*! 🤖\n\n` +
                    `👮 Recuerden seguir las reglas del grupo.\n` +
                    `💡 ¿Necesitan ayuda? Seleccionen una opción:`

  // En Baileys, se envían los botones así:
  await conn.sendMessage(m.chat, {
    text: welcomeText,
    buttons: [
      { buttonId: 'guia1', buttonText: { displayText: '📖 Guía' }, type: 1 },
      { buttonId: 'guia2', buttonText: { displayText: '📘 Guía 2' }, type: 1 }
    ],
    footer: 'Powered by tu-bot',
    headerType: 1
  }, { quoted: m })
}

export default handler
