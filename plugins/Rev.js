let handler = m => m;

handler.before = async function (m, { conn, groupMetadata }) => {
  if (!m.messageStubType || !m.isGroup) return;
  if (m.messageStubType !== 20) return;

  let subject = groupMetadata.subject || "el grupo";
  let welcomeBot = `✨ ¡Hola a todos! Soy su nuevo bot en *${subject}*! 🤖\n\n👮 Recuerden seguir las reglas.`;

  try {
    await conn.sendMessage(m.chat, {
      text: welcomeBot,
      buttons: [
        { buttonId: ".guia1", buttonText: { displayText: "📖 Guía1" }, type: 1 },
        { buttonId: ".guia2", buttonText: { displayText: "📘 Guía2" }, type: 1 }
      ],
      footer: "Seleccione una opción:"
    });
  } catch (e) {
    console.error("Error:", e);
    await conn.sendMessage(m.chat, { text: "❌ Fallo al enviar botones. ¿El bot es admin?" });
  }
};

export default handler;
