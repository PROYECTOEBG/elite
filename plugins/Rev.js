let handler = async (m, { conn }) => {
  // Verificación mejorada para eventos de grupo
  if (!m.isGroup) return;

  // Detección robusta de cuando añaden al bot
  const isBotAdded = (
    (m.messageStubType === 20 || m.messageStubType === 256) &&
    conn.user.jid && 
    m.messageStubParameters?.some(param => param.includes(conn.user.jid.split('@')[0]))
  );

  if (!isBotAdded) return;

  try {
    // Obtener metadatos con triple protección contra errores
    const getGroupData = async () => {
      try {
        const data = await conn.groupMetadata(m.chat);
        return data || { subject: "Grupo Desconocido", participants: [] };
      } catch {
        return { subject: "Grupo Desconocido", participants: [] };
      }
    };

    const groupData = await getGroupData();
    const groupName = groupData.subject || "Este Grupo";
    const members = groupData.participants || [];

    // Mensaje de bienvenida ultra-optimizado
    const welcomeMsg = `╔══════════════╗
║   ¡BOT ACTIVADO!   ║
╚══════════════╝
📌 *Grupo:* ${groupName}
👥 *Miembros:* ${members.length}
🛠️ *Prefijo:* ${usedPrefix}

Escribe *${usedPrefix}menu* para ver mis funciones`;

    // Envío seguro del mensaje
    await conn.sendMessage(m.chat, { 
      text: welcomeMsg,
      mentions: members.map(p => p.id)
    });

    console.log(`✅ Bienvenida enviada a: ${groupName}`);

  } catch (e) {
    console.error('🚨 Error en bienvenida:', e);
    // Fallback absoluto
    await conn.sendMessage(m.chat, {
      text: '¡Bot activado! Escribe *.menu* para ayuda'
    }).catch(() => null);
  }
}

export default handler;
