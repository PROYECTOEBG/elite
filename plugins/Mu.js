let mutedUsers = new Set();

let handler = async (m, { conn, usedPrefix, command, isAdmin, isBotAdmin, text }) => {
    // Verificar si el bot y el usuario son administradores
    if (!isBotAdmin) return conn.reply(m.chat, '⭐ El bot necesita ser administrador.', m);
    if (!isAdmin) return conn.reply(m.chat, '⭐ Solo los administradores pueden usar este comando.', m);

    // Extraer el comando sin prefijo (por si acaso)
    let cmd = command.toLowerCase().replace(/^[\.\/]/, '');

    // Verificar si se mencionó a alguien
    let user;
    if (m.mentionedJid && m.mentionedJid.length > 0) {
        user = m.mentionedJid[0];
    } else if (text) {
        // Si se envía un número de teléfono (opcional)
        user = text.replace(/[^0-9]/g, '') + '@s.whatsapp.net';
    } else {
        return conn.reply(m.chat, '⭐ Etiqueta a la persona que quieres mutear o desmutear.', m);
    }

    // Manejar mute/unmute (funciona con o sin punto)
    if (cmd === 'mute') {
        mutedUsers.add(user);
        conn.reply(m.chat, `✅ *Usuario muteado:* @${user.split('@')[0]}`, m, { mentions: [user] });
    } else if (cmd === 'unmute') {
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

// Aceptar tanto `.mute` como `mute` (y lo mismo para unmute)
handler.command = /^(\.?mute|\.?unmute)$/i;
handler.group = true;  // Solo funciona en grupos
handler.admin = true;  // Solo admins pueden usarlo
handler.botAdmin = true;  // El bot debe ser admin

export default handler;
