let handler = m => m;

handler.before = async function (m, { conn, groupMetadata, usedPrefix }) {
  // 1. Verificar si es la creación de un grupo (stubType 20) y si el bot está presente
  if (!m.messageStubType || m.messageStubType !== 20 || !m.isGroup) return;

  // 2. Obtener metadatos del grupo (asegurarse de que el bot es miembro)
  try {
    const groupData = await conn.groupMetadata(m.chat);
    const botId = conn.user.jid.split('@')[0] + '@s.whatsapp.net';
    const isBotInGroup = groupData.participants.some(p => p.id === botId);

    if (!isBotInGroup) return; // Si el bot no está en el grupo, no hacer nada

    // 3. Mensaje y botones (estructura idéntica a tu .init)
    const subject = groupMetadata.subject || "el grupo";
    const welcomeMsg = `✨ ¡Hola a todos! Soy su nuevo bot en *${subject}*! 🤖\n\n👮 Recuerden seguir las reglas.\n💡 Usen *${usedPrefix}menu* para ver mis comandos.`;

    const buttons = [
      {
        buttonId: `${usedPrefix}menu`,
        buttonText: { displayText: "📜 VER MENÚ" },
        type: 1
      },
      {
        buttonId: `${usedPrefix}owner`,
        buttonText: { displayText: "👑 CREADOR" },
        type: 1
      }
    ];

    // 4. Enviar mensaje con botones (¡clave!)
    await conn.sendMessage(
      m.chat,
      {
        text: welcomeMsg,
        buttons: buttons,
        footer: "¡Gracias por agregarme!",
        mentions: [m.sender] // Opcional: menciona al creador del grupo
      },
      { quoted: m }
    );

  } catch (error) {
    console.error("Error en welcomeBot:", error); // Debug
  }
};

export default handler;
