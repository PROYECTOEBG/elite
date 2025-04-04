handler.before = async function (m, { conn, groupMetadata }) {
  if (!m.messageStubType || !m.isGroup || m.messageStubType !== 20) return;

  let subject = groupMetadata.subject || "el grupo";
  let welcomeBot = `✨ ¡Hola a todos! Soy su nuevo bot en *${subject}*! 🤖\n\n👮 Sigan las reglas.`;

  await conn.sendMessage(m.chat, {
    text: welcomeBot,
    buttons: [
      { buttonId: '.guia1', buttonText: { displayText: '📖 Guía1' }, type: 1 },
      { buttonId: '.guia2', buttonText: { displayText: '📘 Guía2' }, type: 1 }
    ],
    footer: "Seleccione una opción:",
    headerType: 4 // ¡Clave! Usa el mismo que en .tiktok
  });
};
