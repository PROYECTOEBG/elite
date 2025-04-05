let mutedUsers = new Set();

let handler = async (m, { conn, isAdmin, isBotAdmin }) => {
    // Verificar si el mensaje comienza con mute/unmute (con o sin punto)
    const isMute = /^[\.]?mute$/i.test(m.text.split(' ')[0]);
    const isUnmute = /^[\.]?unmute$/i.test(m.text.split(' ')[0]);
    
    if (!isMute && !isUnmute) return; // No es un comando válido

    // Verificar permisos
    if (!isBotAdmin) {
        return conn.sendMessage(m.chat, { text: '⚠️ El bot necesita ser administrador para esta acción' }, { quoted: m });
    }
    if (!isAdmin) {
        return conn.sendMessage(m.chat, { text: '⚠️ Solo administradores pueden usar este comando' }, { quoted: m });
    }

    // Obtener usuario mencionado
    const mentioned = m.mentionedJid?.[0];
    if (!mentioned) {
        return conn.sendMessage(m.chat, { text: '🔍 Etiqueta al usuario que deseas mutear/desmutear' }, { quoted: m });
    }

    // Procesar comando
    if (isMute) {
        mutedUsers.add(mentioned);
        conn.sendMessage(m.chat, { 
            text: `🔇 Usuario muteado: @${mentioned.split('@')[0]}`,
            mentions: [mentioned]
        }, { quoted: m });
    } 
    else if (isUnmute) {
        mutedUsers.delete(mentioned);
        conn.sendMessage(m.chat, { 
            text: `🔊 Usuario desmuteado: @${mentioned.split('@')[0]}`,
            mentions: [mentioned]
        }, { quoted: m });
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

// Configuración
handler.tags = ['group'];
handler.command = /^(\.?mute|\.?unmute)$/i;
handler.group = true;
handler.admin = true;
handler.botAdmin = true;

export default handler;
