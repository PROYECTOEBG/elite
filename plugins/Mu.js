let mutedUsers = new Set();

let handler = async (m, { conn, usedPrefix, command, isAdmin, isBotAdmin, args }) => {
    // Verificar si el comando es mute/unmute (con o sin prefijo)
    const isMuteCommand = /^(\.?mute)$/i.test(command);
    const isUnmuteCommand = /^(\.?unmute)$/i.test(command);
    
    if (!isMuteCommand && !isUnmuteCommand) return; // No es un comando válido

    if (!isBotAdmin) return conn.reply(m.chat, '⭐ El bot necesita ser administrador.', m);
    if (!isAdmin) return conn.reply(m.chat, '⭐ Solo los administradores pueden usar este comando.', m);

    let user;

    // Detección mejorada de usuarios (menciones o mensajes citados)
    if (m.mentionedJid?.length > 0) {
        user = m.mentionedJid[0];
    } else if (m.quoted?.sender) {
        user = m.quoted.sender;
    } else {
        return conn.reply(m.chat, 
            '⭐ Etiqueta a la persona o responde a su mensaje.\n' +
            `Ejemplo: ${usedPrefix}mute @usuario`, 
            m
        );
    }

    // Ejecutar acción según comando
    try {
        if (isMuteCommand) {
            mutedUsers.add(user);
            await conn.sendMessage(m.chat, { 
                text: `✅ *Usuario muteado:* @${user.split('@')[0]}\n\n⚠️ Sus mensajes serán eliminados automáticamente.`,
                mentions: [user]
            }, { quoted: m });
        } else if (isUnmuteCommand) {
            mutedUsers.delete(user);
            await conn.sendMessage(m.chat, { 
                text: `✅ *Usuario desmuteado:* @${user.split('@')[0]}\n\n⚠️ Ya puede enviar mensajes normalmente.`,
                mentions: [user]
            }, { quoted: m });
        }
    } catch (e) {
        console.error('Error al procesar comando:', e);
        await conn.reply(m.chat, '❌ Ocurrió un error al procesar el comando', m);
    }
};

// Interceptor mejorado para mensajes de usuarios muteados
handler.before = async (m, { conn }) => {
    if (mutedUsers.has(m.sender) {
        try {
            await conn.sendMessage(m.chat, { delete: m.key });
            await conn.sendMessage(m.chat, {
                text: `🚫 @${m.sender.split('@')[0]} está muteado y no puede enviar mensajes.`,
                mentions: [m.sender]
            });
        } catch (e) {
            console.error('Error al manejar usuario muteado:', e);
        }
        return true; // Detener procesamiento del mensaje
    }
};

// Configuración correcta del handler
handler.help = ['mute @usuario', 'unmute @usuario'];
handler.tags = ['moderación'];
handler.command = /^(\.?mute|\.?unmute)$/i;
handler.group = true;
handler.admin = true;
handler.botAdmin = true;

export default handler;
