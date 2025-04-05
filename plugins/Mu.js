let mutedUsers = new Set();

let handler = async (m, { conn, usedPrefix, command, isAdmin, isBotAdmin, args }) => {
    // Verificar si el mensaje comienza con mute/unmute (con o sin punto)
    const isMuteCmd = /^[.]?mute$/i.test(command);
    const isUnmuteCmd = /^[.]?unmute$/i.test(command);
    
    if (!(isMuteCmd || isUnmuteCmd)) return; // No es un comando válido

    if (!isBotAdmin) return conn.reply(m.chat, '⭐ El bot necesita ser administrador.', m);
    if (!isAdmin) return conn.reply(m.chat, '⭐ Solo los administradores pueden usar este comando.', m);

    let user;

    // Detectar menciones (funciona con @usuario o al citar mensaje)
    if (m.mentionedJid && m.mentionedJid.length > 0) {
        user = m.mentionedJid[0];
    } else if (m.quoted?.sender) {
        user = m.quoted.sender;
    } else {
        return conn.reply(m.chat, '⭐ Etiqueta a la persona o responde a su mensaje.', m);
    }

    if (isMuteCmd) {
        mutedUsers.add(user);
        await conn.sendMessage(m.chat, { 
            text: `✅ *Usuario muteado:* @${user.split('@')[0]}\n\n⚠️ Sus mensajes serán eliminados automáticamente.`, 
            mentions: [user] 
        }, { quoted: m });
    } else if (isUnmuteCmd) {
        mutedUsers.delete(user);
        await conn.sendMessage(m.chat, { 
            text: `✅ *Usuario desmuteado:* @${user.split('@')[0]}\n\n⚠️ Ya puede enviar mensajes normalmente.`, 
            mentions: [user] 
        }, { quoted: m });
    }
};

// Interceptar mensajes de usuarios muteados (mejorado)
handler.before = async (m, { conn }) => {
    if (mutedUsers.has(m.sender) {
        try {
            // Eliminar mensaje y notificar (opcional)
            await Promise.all([
                conn.sendMessage(m.chat, { delete: m.key }),
                conn.sendMessage(m.chat, { 
                    text: `⚠️ @${m.sender.split('@')[0]} está muteado y no puede enviar mensajes.`,
                    mentions: [m.sender] 
                }, { quoted: m })
            ]);
        } catch (e) {
            console.error('Error al manejar mensaje muteado:', e);
        }
        return true; // Detener procesamiento del mensaje
    }
};

// Configuración mejorada del comando
handler.help = ['mute @usuario', 'unmute @usuario'];
handler.tags = ['moderación'];
handler.command = /^(\.?mute|\.?unmute)$/i; // Acepta con/sin punto
handler.group = true;
handler.admin = true;
handler.botAdmin = true;

export default handler;
