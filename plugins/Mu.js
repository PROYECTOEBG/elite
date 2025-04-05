const fs = require('fs');
const path = require('path');

let mutedUsers = new Set();

// Ruta del archivo JSON para guardar la lista de usuarios muteados
const mutedUsersFile = path.join(__dirname, 'mutedUsers.json');

// Cargar usuarios muteados desde el archivo al iniciar el bot
if (fs.existsSync(mutedUsersFile)) {
    mutedUsers = new Set(JSON.parse(fs.readFileSync(mutedUsersFile, 'utf-8')));
}

// Guardar la lista de muteados en el archivo cada vez que se actualice
const saveMutedUsers = () => {
    fs.writeFileSync(mutedUsersFile, JSON.stringify([...mutedUsers]));
};

let handler = async (m, { conn, usedPrefix, command, isAdmin, isBotAdmin }) => {
    // Aseguramos que el bot sea administrador
    if (!isBotAdmin) return conn.reply(m.chat, '⭐ El bot necesita ser administrador.', m);
    if (!isAdmin) return conn.reply(m.chat, '⭐ Solo los administradores pueden usar este comando.', m);

    let user;

    // Si se menciona a un usuario
    if (m.message.extendedTextMessage && m.message.extendedTextMessage.contextInfo.mentionedJid) {
        user = m.message.extendedTextMessage.contextInfo.mentionedJid[0];
    } else {
        return conn.reply(m.chat, '⭐ Etiqueta a la persona que quieres mutear o desmutear.', m);
    }

    // Si el comando es mute
    if (command === "mute") {
        if (mutedUsers.has(user)) {
            return conn.reply(m.chat, `⭐ El usuario ya está muteado.`, m);
        }
        mutedUsers.add(user);
        saveMutedUsers(); // Guardamos la lista actualizada
        conn.reply(m.chat, `✅ *Usuario muteado:* @${user.split('@')[0]}`, m, { mentions: [user] });
    } else if (command === "unmute") {
        if (!mutedUsers.has(user)) {
            return conn.reply(m.chat, `⭐ El usuario no está muteado.`, m);
        }
        mutedUsers.delete(user);
        saveMutedUsers(); // Guardamos la lista actualizada
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

// Aquí aseguramos que solo se acepte el comando con el punto como prefijo
handler.command = /^\.mute$|^\.unmute$/i;  // Solo acepta `.mute` o `.unmute` (con punto)

// Configuración del bot
handler.exp = 0;
handler.admin = true;
handler.botAdmin = true;

export default handler;
