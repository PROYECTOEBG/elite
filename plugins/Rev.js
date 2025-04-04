let handler = async (m, { conn, usedPrefix }) => {
  // Verificar si es un evento de creación de grupo donde el bot fue agregado
  if (!m.messageStubType === 21 || !m.isGroup) return;
  
  try {
    const groupData = await conn.groupMetadata(m.chat);
    const botId = conn.user.jid;
    const wasBotAdded = m.messageStubParameters.includes(botId);

    if (!wasBotAdded) return;

    const groupName = groupData.subject || "este grupo";
    const welcomeMsg = `✨ ¡Hola a todos! Soy su nuevo bot en *${groupName}*! 🤖\n\n` +
                     `👮 Recuerden seguir las reglas del grupo.\n` +
                     `💡 Usen *${usedPrefix}menu* para ver mis comandos.`;

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

    await conn.sendMessage(
      m.chat,
      {
        text: welcomeMsg,
        buttons: buttons,
        footer: "¡Gracias por agregarme!",
        headerType: 1
      },
      { quoted: m }
    );
    
    console.log(`Mensaje de bienvenida enviado a ${groupName}`);
  } catch (error) {
    console.error("Error al enviar mensaje de bienvenida:", error);
  }
};

handler.event = 'group-participants-update';
handler.action = 'add';

export default handler;
