const handler = async (m, { conn }) => {
  if (!m.isGroup) return;  // Asegúrate de que el mensaje es en un grupo
  
  // Obtén los participantes del grupo
  const groupMetadata = await conn.groupMetadata(m.chat);
  const participants = groupMetadata.participants;

  // Si el mensaje contiene un nuevo miembro, o si es el último miembro que interactuó
  const newMember = m.mentionedJid && m.mentionedJid[0] || m.sender;

  // Obtener información del contacto (esto incluye si es un bot)
  const contact = await conn.getContact(newMember); 

  // Verificar si el nuevo miembro es un bot
  if (contact.isBot) {
    // Expulsar al bot del grupo
    await conn.groupRemove(m.chat, [newMember]);

    // Enviar un mensaje de alerta al grupo
    await conn.sendMessage(m.chat, {
      text: `⚠️ *¡Un bot ha sido expulsado del grupo!* \nEl miembro con número ${newMember} fue detectado como un bot.`,
    });
  }
};

handler.help = ['botcheck'];
handler.tags = ['moderación'];
handler.command = /^(botcheck)$/i;

export default handler;
