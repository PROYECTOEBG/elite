let handler = async (m, { conn }) => {
  // Verificación ultra-robusta para eventos de grupo
  if (!m.isGroup || !m.messageStubType) return;

  // Detección mejorada para cuando añaden al bot
  const botNumber = conn.user.jid.split('@')[0];
  const isBotAddedEvent = (
    m.messageStubType === 20 && 
    Array.isArray(m.messageStubParameters) &&
    m.messageStubParameters.some(param => param.includes(botNumber))
  );

  if (!isBotAddedEvent) return;

  try {
    // Obtener metadatos con protección extrema
    const getSafeMetadata = async () => {
      try {
        const metadata = await conn.groupMetadata(m.chat);
        return metadata || {
          subject: "Nuevo Grupo",
          participants: [],
          desc: ""
        };
      } catch (error) {
        console.error('Error al obtener metadatos:', error);
        return {
          subject: "Nuevo Grupo",
          participants: [],
          desc: ""
        };
      }
    };

    const groupInfo = await getSafeMetadata();
    const groupName = groupInfo.subject || "Este Grupo";
    const memberCount = groupInfo.participants?.length || 0;

    // Mensaje de bienvenida optimizado
    const welcomeMessage = `╭━━━━━━━━━━━━━━╮
┃   ¡BOT ACTIVADO!   ┃
╰━━━━━━━━━━━━━━╯
📛 *Grupo:* ${groupName}
👥 *Miembros:* ${memberCount}
🔧 *Prefijo:* !

Escribe *!menu* para ver mis comandos.`;

    // Envío ultra-seguro del mensaje
    await conn.sendMessage(m.chat, {
      text: welcomeMessage,
      mentions: [conn.user.jid]
    });

    console.log(`✅ Mensaje enviado a: ${groupName}`);

  } catch (error) {
    console.error('🚨 Error crítico:', error);
    // Fallback absoluto
    await conn.sendMessage(m.chat, {
      text: '¡Bot activado! Escribe !help para ayuda'
    }).catch(e => console.error('Fallback también falló:', e));
  }
}

export default handler;
