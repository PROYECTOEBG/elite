const handler = async (m, { conn, usedPrefix }) => { // Añadido usedPrefix en los parámetros
  // Datos del creador (personalizables)
  const creatorInfo = {
    name: "Russell xz 😊",
    number: "15167096032@s.whatsapp.net",
    botName: "Azura Ultra Subbot",
    description: "Desarrollador de bots WhatsApp"
  };

  // Mensaje único con toda la información
  const fullMessage = `
🌟 *INFORMACIÓN DEL CREADOR* 🌟

🤖 *Bot:* ${creatorInfo.botName}
👤 *Nombre:* ${creatorInfo.name}
📞 *Número:* https://wa.me/${creatorInfo.number.split('@')[0]}
📝 *Descripción:* ${creatorInfo.description}

💬 *Puedes contactarme para:*
• Soporte técnico
• Consultas sobre el bot
• Desarrollo de bots personalizados
• Reporte de errores

*¡Toca el enlace del número para enviar un mensaje directo!*
  `.trim();

  // Enviar el mensaje único con botones interactivos
  await conn.sendMessage(m.chat, {
    text: fullMessage,
    footer: "Azura Ultra Subbot - Soporte",
    templateButtons: [
      {
        urlButton: {
          displayText: "📲 Contactar por WhatsApp",
          url: `https://wa.me/${creatorInfo.number.split('@')[0]}`
        }
      },
      {
        quickReplyButton: {
          displayText: "📋 Más información",
          id: `${usedPrefix || '#'}info` // Usamos usedPrefix si existe, o '#' como valor por defecto
        }
      }
    ]
  }, { quoted: m });
};

handler.help = ['creador', 'owner', 'contacto'];
handler.tags = ['info'];
handler.command = /^(creador|owner|contacto|soporte|developer)$/i;

export default handler;
