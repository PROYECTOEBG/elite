let mutedUsers = new Set();

let handler = async (m, { conn, isAdmin, isBotAdmin, participants }) => {
    // Verificar si es un comando mute/unmute (con o sin punto)
    const isMuteCmd = /^(\.?mute|mute)$/i.test(m.text) && !m.text.includes('unmute');
    const isUnmuteCmd = /^(\.?unmute|unmute)$/i.test(m.text);
    
    // Solo procesar si es un comando válido
    if (!isMuteCmd && !isUnmuteCmd) return;

    // Verificar permisos
    if (!isBotAdmin) return conn.reply(m.chat, '⭐ El bot necesita ser administrador.', m);
    if (!isAdmin) return conn.reply(m.chat, '⭐ Solo los administradores pueden usar este comando.', m);

    // Obtener usuario mencionado
    let user;
    if (m.mentionedJid && m.mentionedJid.length > 0) {
        user = m.mentionedJid[0];
    } else {
        return conn.reply(m.chat, '⭐ Etiqueta a la persona que quieres mutear o desmutear.', m);
    }

    // Procesar comando
    if (isMuteCmd) {
        mutedUsers.add(user);
        conn.reply(m.chat, `✅ *Usuario muteado:* @${user.split('@')[0]}`, m, { mentions: [user] });
    } else if (isUnmuteCmd) {
        mutedUsers.delete(user);
        conn.reply(m.chat, `✅ *Usuario desmuteado:* @${user.split('@')[0]}`, m, { mentions: [user] });
    }
};

// Eliminar mensajes de usuarios muteados
handler.before = async (m, { conn }) => {
    if (mutedUsers.has(m.sender)) {
        try {
            await conn.sendMessage(m.chat, { delete: m.key });
        } catch (e) {
            console.error('Error eliminando mensaje:', e);
        }
    }
};

// Configuración del handler
handler.group = true;
handler.admin = true;
handler.botAdmin = true;

export default handler;
