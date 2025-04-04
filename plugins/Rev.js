let handler = async (m, { conn }) => {
  // Verificación más robusta para eventos de grupo
  if (!m.isGroup) return;
  
  // Solución definitiva para el error - Detección mejorada
  const isBotAdded = (
    (m.messageStubType === 20 || m.messageStubType === 256) && 
    m.messageStubParameters?.includes(conn.user.jid.split('@')[0])
  );

  if (!isBotAdded) return;

  try {
    // Obtener metadatos con múltiples fallbacks
    const groupData = await conn.groupMetadata(m.chat).catch(() => ({ 
      subject: "Nuevo Grupo", 
      participants: [] 
    }));

    const groupName = groupData.subject || "Este Grupo";
    const memberCount = groupData.participants?.length || 0;

    // Mensaje de bienvenida optimizado
    await conn.sendMessage(m.chat, {
      text: `🤖 *¡Bot activado!*\n\n` +
            `📌 Grupo: *${groupName}*\n` +
            `👥 Miembros: *${memberCount}*\n\n` +
            `Escribe *.menu* para ver mis funciones`,
      mentions: [conn.user.jid]
    });

  } catch (e) {
    console.error('Error en bienvenida del bot:', e);
    // Fallback básico si todo falla
    await conn.sendMessage(m.chat, {
      text: '¡Bot activado! Escribe *.menu* para ayuda'
    });
  }
}

export default handler;
