let handler = async (m, { conn, args, command, usedPrefix, isAdmin, isROwner }) => {
  // Comandos de configuración (.on welcome/.of welcome)
  if (command === 'welcome') {
    if (!m.isGroup) return m.reply('🚫 Este comando solo funciona en grupos');
    if (!isAdmin && !isROwner) return m.reply('🔐 Solo administradores pueden configurar bienvenidas');
    
    if (!global.db.data.chats[m.chat]) global.db.data.chats[m.chat] = {};
    
    if (args[0]?.toLowerCase() === 'on') {
      global.db.data.chats[m.chat].welcome = true;
      m.reply('✅ Bienvenidas activadas');
    } else if (args[0]?.toLowerCase() === 'of') {
      global.db.data.chats[m.chat].welcome = false;
      m.reply('❌ Bienvenidas desactivadas');
    } else {
      m.reply(`📌 Uso:\n*${usedPrefix}on welcome* - Activar\n*${usedPrefix}of welcome* - Desactivar`);
    }
    return;
  }

  // Handler para eventos de grupo
  if (!m.isGroup || !m.messageStubType || ![27, 28].includes(m.messageStubType)) return;

  try {
    const chat = global.db.data.chats[m.chat] || {};
    if (!chat.welcome) return;

    const userJid = m.messageStubParameters?.[0];
    if (!userJid) return;

    // Solución para el error: Verificar si es ADD o REMOVE independientemente del type
    const eventType = m.messageStubType; // 27 (entrada) o 28 (salida)

    // Obtener metadatos del grupo solo cuando sea necesario
    const getGroupData = async () => {
      try {
        return await conn.groupMetadata(m.chat);
      } catch {
        return { subject: "este grupo", desc: "" };
      }
    };

    const groupData = eventType === 27 ? await getGroupData() : null;
    const groupName = groupData?.subject || "el grupo";
    const userName = `@${userJid.split('@')[0]}`;

    // URLs de imágenes (¡cámbialas por las tuyas!)
    const IMAGEN_BIENVENIDA = 'https://ejemplo.com/bienvenida.jpg';
    const IMAGEN_DESPEDIDA = 'https://ejemplo.com/despedida.jpg';

    // Bienvenida
    if (eventType === 27) {
      await conn.sendMessage(m.chat, {
        image: { url: IMAGEN_BIENVENIDA },
        caption: `🎉 ¡Bienvenido/a ${userName} a ${groupName}!`,
        mentions: [userJid]
      });
    } 
    // Despedida
    else if (eventType === 28) {
      await conn.sendMessage(m.chat, {
        image: { url: IMAGEN_DESPEDIDA },
        caption: `😢 ${userName} ha dejado el grupo`,
        mentions: [userJid]
      });
    }
  } catch (error) {
    console.error('Error en handler de bienvenidas:', error);
  }
}

handler.command = /^(welcome)$/i;
export default handler;
