let handler = m => m;

handler.before = async function (m, { conn, groupMetadata, usedPrefix }) {
  if (!m.messageStubType || !m.isGroup) return;
  if (m.messageStubType !== 20) return; // 20 = Creación de grupo

  // 1. Texto de bienvenida (similar a tu init)
  let subject = groupMetadata.subject || "el grupo";
  let welcomeBot = `✨ ¡Hola a todos! Soy su nuevo bot en *${subject}*! 🤖\n\n👮 Recuerden seguir las reglas.\n💡 Usen *${usedPrefix}menu* para ver mis comandos.`;

  // 2. Botones (estructura idéntica a tu initHandler)
  const buttons = [
    {
      buttonId: `${usedPrefix}menu`,
      buttonText: { displayText: "📜 VER MENÚ" },
      type: 1,
    },
    {
      buttonId: `${usedPrefix}owner`,
      buttonText: { displayText: "👑 CREADOR" },
      type: 1,
    },
  ];

  // 3. Envío con botones (como en tu init)
  await conn.sendMessage(
    m.chat,
    {
      text: welcomeBot,
      buttons: buttons,
      footer: "¡Gracias por agregarme!",
      // viewOnce: true // Opcional (si lo usabas en init)
    },
    { quoted: m }
  );
};

export default handler;
