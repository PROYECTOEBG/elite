// Función para verificar si un miembro es un bot y expulsarlo si lo es
const handler = async (m, { conn }) => {
  if (!m.isGroup) return; // Verificar que el mensaje es en un grupo

  const groupMetadata = await conn.groupMetadata(m.chat);
  const participants = groupMetadata.participants;
  
  // Verificar si el nuevo miembro es un bot
  const newMember = m.mentionedJid && m.mentionedJid[0] || m.sender;

  // Verifica si el nuevo miembro es un bot
  if (await conn.getContact(newMember).then(contact => contact.isBot)) {
    // Expulsar al bot del grupo
    await conn.groupRemove(m.chat, [newMember]);
    // Enviar un mensaje de expulsión al grupo
    await conn.sendMessage(m.chat, {
      text: `⚠️ *¡Atención! El bot ${newMember} fue expulsado del grupo por ser detectado como un bot.*`,
    });
  }
};

handler.help = ['botcheck'];
handler.tags = ['moderación'];
handler.command = /^(botcheck)$/i;

export default handler;
