const handler = async (m, { conn }) => {
  if (!m.isGroup) return; // Verificar que el mensaje es en un grupo
  
  const groupMetadata = await conn.groupMetadata(m.chat); // Obtener metadata del grupo
  const participants = groupMetadata.participants; // Obtener lista de participantes

  // Verificar si el miembro mencionado o el que ha ingresado es un bot
  const newMember = m.mentionedJid && m.mentionedJid[0] || m.sender;

  // Verifica si el nuevo miembro es un bot
  const contact = await conn.getContact(newMember); 

  if (contact.isBot) {
    // Expulsar al bot del grupo
    await conn.groupRemove(m.chat, [newMember]);
    
    // Enviar mensaje al grupo informando sobre la expulsión
    await conn.sendMessage(m.chat, {
      text: `⚠️ *¡Un bot ha sido expulsado del grupo! El miembro con ID ${newMember} ha sido detectado como un bot.*`,
    });
  }
};

handler.help = ['botcheck'];
handler.tags = ['moderación'];
handler.command = /^(botcheck)$/i;

export default handler;
