let handler = m => m;

handler.before = async function (m, { conn, groupMetadata }) {
  if (!m.messageStubType || !m.isGroup) return;
  if (m.messageStubType !== 20) return; // 20 = Grupo creado

  let subject = groupMetadata.subject || "el grupo";
  let welcomeBot = `✨ ¡Hola a todos! Soy su nuevo bot en *${subject}*! 🤖\n\n👮 Recuerden seguir las reglas del grupo.\n💡 Seleccionen una opción para obtener más información:`; 

  let buttons = [
    { buttonId: ".guia1", buttonText: { displayText: "📖 Guía1" }, type: 1 },
    { buttonId: ".guia2", buttonText: { displayText: "📘 Guía2" }, type: 1 }
  ];

  let buttonMessage = {
    text: welcomeBot,
    footer: "Seleccione una opción:",
    buttons: buttons,
    headerType: 1
  };

  try {
    console.log("Intentando enviar mensaje al grupo:", m.chat);
    
    // FORZAR EL ENVÍO DE MENSAJE
    await conn.sendMessage(m.chat, buttonMessage); 

    console.log("Mensaje enviado correctamente");
  } catch (e) {
    console.error("❌ Error enviando botones:", e);

    // Enviar mensaje de error al grupo
    await conn.sendMessage(m.chat, { text: "⚠️ No se pudo enviar los botones. Verifica los permisos del bot." });
  }
};

export default handler;
