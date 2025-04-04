let handler = async (m, { conn, args, command, usedPrefix, isAdmin, isROwner }) => {
  // Sistema de activación/desactivación
  if (command === 'welcome') {
    if (!m.isGroup) return m.reply('🚫 Solo para grupos');
    if (!isAdmin && !isROwner) return m.reply('🔐 Solo admins');
    
    global.db.data.chats[m.chat] = global.db.data.chats[m.chat] || {};
    
    if (args[0]?.toLowerCase() === 'on') {
      global.db.data.chats[m.chat].welcome = true;
      m.reply('✅ Bienvenidas activadas');
    } else if (args[0]?.toLowerCase() === 'of') {
      global.db.data.chats[m.chat].welcome = false;
      m.reply('❌ Bienvenidas desactivadas');
    } else {
      m.reply(`📌 Uso:\n${usedPrefix}on welcome\n${usedPrefix}of welcome`);
    }
    return;
  }

  // Handler de eventos
  if (!m.isGroup || !m.messageStubType) return;

  try {
    const chat = global.db.data.chats[m.chat] || {};
    if (!chat.welcome) return;

    const userJid = m.messageStubParameters?.[0];
    if (!userJid) return;

    // Solución definitiva para el error
    const eventType = m.messageStubType; // Usamos solo este valor

    // Configuración de imágenes (reemplázalas)
    const IMAGENES = {
      bienvenida: 'https://telegra.ph/file/bienvenida.jpg',
      despedida: 'https://telegra.ph/file/despedida.jpg'
    };

    const userName = `@${userJid.split('@')[0]}`;
    
    if (eventType === 27) { // Entrada
      const groupData = await conn.groupMetadata(m.chat).catch(() => null);
      await conn.sendMessage(m.chat, {
        image: { url: IMAGENES.bienvenida },
        caption: `🎊 ¡Bienvenido/a ${userName}!\nAl grupo: ${groupData?.subject || ''}`,
        mentions: [userJid]
      });
    } 
    else if (eventType === 28) { // Salida
      await conn.sendMessage(m.chat, {
        image: { url: IMAGENES.despedida },
        caption: `👋 Adiós ${userName}`,
        mentions: [userJid]
      });
    }
  } catch (error) {
    console.error('Error en bienvenidas:', error);
  }
}

handler.command = /^(welcome)$/i;
export default handler;
