let mutedUsers = new Set();

let handler = async (m, { conn, usedPrefix, command, isAdmin, isBotAdmin, args }) => {
    if (!isBotAdmin) return conn.reply(m.chat, '⭐ El bot necesita ser administrador.', m);
    if (!isAdmin) return conn.reply(m.chat, '⭐ Solo los administradores pueden usar este comando.', m);

    // Normalizar el comando eliminando el punto si existe
    const normalizedCmd = command.replace(/^\./, '').toLowerCase();

    let user;

    // Si se menciona a un usuario
    if (m.message.extendedTextMessage && m.message.extendedTextMessage.contextInfo.mentionedJid) {
        user = m.message.extendedTextMessage.contextInfo.mentionedJid[0];
    } else {
        return conn.reply(m.chat, '⭐ Etiqueta a la persona que quieres mutear o desmutear.', m);
    }

    if (normalizedCmd === "mute") {
        mutedUsers.add(user);
        conn.reply(m.chat, `✅ *Usuario muteado:* @${user.split('@')[0]}`, m, { mentions: [user] });
    } else if (normalizedCmd === "unmute") {
        mutedUsers.delete(user);
        conn.reply(m.chat, `✅ *Usuario desmuteado:* @${user.split('@')[0]}`, m, { mentions: [user] });
    }
};

// Interceptar mensajes de usuarios muteados
handler.before = async (m, { conn }) => {
    if (mutedUsers.has(m.sender)) {
        try {
            await conn.sendMessage(m.chat, { delete: m.key });
        } catch (e) {
            console.error('Error eliminando mensaje:', e);
        }
    }
};

handler.help = ['mute', 'unmute'];
handler.tags = ['group'];
// Expresión regular modificada para aceptar con o sin punto
handler.command = /^[.]?(mute|unmute)$/i;
handler.group = true;
handler.admin = true;
handler.botAdmin = true;

export default handler;
