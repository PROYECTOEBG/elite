handler.before = async function (m, { conn, groupMetadata }) {
  if (!m.messageStubType || !m.isGroup || m.messageStubType !== 20) return;

  let subject = groupMetadata.subject || "el grupo";
  let welcomeBot = `✨ ¡Hola a todos! Soy su nuevo bot en *${subject}*! 🤖\n\n👮 Sigan las reglas.`;

  // Opción 1: Solo texto (prueba primero)
  await conn.sendMessage(m.chat, { text: welcomeBot });

  // Opción 2: Con botones (si Opción 1 funciona)
  /*
  await conn.sendMessage(m.chat, {
    text: welcomeBot,
    buttons: [
      { buttonId: 'id1', buttonText: { displayText: '📖 Guía1' }, type: 1 },
      { buttonId: 'id2', buttonText: { displayText: '📘 Guía2' }, type: 1 }
    ],
    footer: "Seleccione:"
  });
  */
};
