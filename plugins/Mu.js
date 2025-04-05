let mutedUsers = new Set();

let handler = async (m, { conn, usedPrefix, command, isAdmin, isBotAdmin }) => {
    // Extraer el comando sin prefijo
    let cmd = command.toLowerCase().replace(/^[\.\/]/, ''); // Elimina . o / del inicio

    // Asegurar que el bot sea admin
    if (!isBotAdmin) return conn.reply(m.chat, '⭐ El bot necesita ser administrador.', m);
    if (!isAdmin) return conn.reply(m.chat, '⭐ Solo los administradores pueden usar este comando.', m);

    let user;

    // Si se menciona a un usuario
    if (m.message.extendedTextMessage?.contextInfo?.mentionedJid) {
        user = m.message.extendedTextMessage.contextInfo.mentionedJid[0];
    } else {
        return conn.reply(m.chat, '⭐ Etiqueta a la persona que quieres mutear o desmutear.', m);
    }

    // Dependiendo del comando, muteamos o desmuteamos
    if (cmd === "mute") {
        mutedUsers.add(user);
        conn.reply(m.chat, `✅ *Usuario muteado:* @${user.split('@')[0]}`, m, { mentions: [user] });
    } else if (cmd === "unmute") {
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

// Registrar tanto las versiones con prefijo como sin prefijo
handler.command = /^(\.?mute|\.?unmute)$/i;  // Acepta .mute, mute, .unmute, unmute
handler.exp = 0;
handler.admin = true;
handler.botAdmin = true;

export default handler;
