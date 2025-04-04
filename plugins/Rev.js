let handler = m => m;

handler.before = async function (m, { conn, groupMetadata }) {
  if (!m.messageStubType || !m.isGroup) return;
  if (m.messageStubType !== 20) return; // 20 = Creación de grupo

  let subject = groupMetadata.subject || "el grupo";
  let welcomeBot = `✨ ¡Hola a todos! Soy su nuevo bot en *${subject}*! 🤖\n\n👮 Recuerden seguir las reglas del grupo.\n💡 Seleccionen una opción para obtener más información:` 

  let templateButtons = [
    { index: 1, quickReplyButton: { displayText: "📖 Guía1", id: ".guia1" } },
    { index: 2, quickReplyButton: { displayText: "📘 Guía2", id: ".guia2" } }
  ];

  let templateMessage = {
    text: welcomeBot,
    footer: "Seleccione una opción:",
    templateButtons: templateButtons
  };

  try {
    await conn.sendMessage(m.chat, templateMessage, { quoted: m });
  } catch (e) {
    console.error("Error enviando botones:", e);
  }
};

export default handler;
