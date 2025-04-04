let handler = async (m, { conn }) => {
  // Detectar cuando el bot es añadido a un grupo (messageStubType 20)
  if (!m.isGroup || m.messageStubType !== 20) return;

  try {
    const groupMetadata = await conn.groupMetadata(m.chat).catch(() => null);
    if (!groupMetadata) return;

    const groupName = groupMetadata.subject || "este grupo";
    const participants = groupMetadata.participants || [];
    const botNumber = conn.user.jid.split('@')[0];

    // Mensaje de bienvenida mejorado
    const welcomeMessage = `╭━━━━━━━━━━━━━━╮
┃   *¡GRACIAS POR INVITARME!*   ┃
╰━━━━━━━━━━━━━━╯
📛 *Nombre del grupo:* ${groupName}
👥 *Miembros:* ${participants.length}
🤖 *Mi prefijo:* !

Escribe *!menu* para ver mis comandos.`;

    // Enviar solo mensaje de texto (más confiable)
    await conn.sendMessage(m.chat, { 
      text: welcomeMessage,
      mentions: participants.map(p => p.id)
    });

    console.log(`Mensaje de bienvenida enviado al grupo: ${groupName}`);

  } catch (error) {
    console.error('Error al enviar bienvenida:', error);
  }
}

export default handler;
