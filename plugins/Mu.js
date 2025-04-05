let mutedUsers = new Set();

let handler = async (m, { conn, isAdmin, isBotAdmin }) => {
    // Detección mejorada de comandos (con o sin punto)
    const commandBody = m.text.trim().split(' ')[0].toLowerCase();
    const isMute = ['mute', '.mute'].includes(commandBody);
    const isUnmute = ['unmute', '.unmute'].includes(commandBody);
    
    if (!isMute && !isUnmute) return;

    // Verificación de permisos mejorada
    if (!isBotAdmin) {
        return conn.sendMessage(m.chat, { 
            text: '❌ *Error:* El bot necesita ser administrador para esta acción',
            mentions: [m.sender]
        }, { quoted: m });
    }
    
    if (!isAdmin) {
        return conn.sendMessage(m.chat, { 
            text: '❌ *Error:* Solo administradores pueden usar este comando',
            mentions: [m.sender]
        }, { quoted: m });
    }

    // Obtención del usuario mencionado
    const mentionedUser = m.mentionedJid?.[0];
    if (!mentionedUser) {
        return conn.sendMessage(m.chat, { 
            text: 'ℹ️ *Uso correcto:*\n' + 
                  '• `mute @usuario` - Mutea a un usuario\n' +
                  '• `unmute @usuario` - Desmutea a un usuario\n\n' +
                  'Ejemplo: `mute @593123456789`',
            mentions: [m.sender]
        }, { quoted: m });
    }

    // Ejecución de la acción
    try {
        if (isMute) {
            mutedUsers.add(mentionedUser);
            await conn.sendMessage(m.chat, { 
                text: `✅ *Usuario muteado:* @${mentionedUser.split('@')[0]}\n` +
                      `El usuario ya no podrá enviar mensajes en este grupo.`,
                mentions: [mentionedUser]
            }, { quoted: m });
        } else if (isUnmute) {
            mutedUsers.delete(mentionedUser);
            await conn.sendMessage(m.chat, { 
                text: `✅ *Usuario desmuteado:* @${mentionedUser.split('@')[0]}\n` +
                      `El usuario puede volver a enviar mensajes en este grupo.`,
                mentions: [mentionedUser]
            }, { quoted: m });
        }
    } catch (error) {
        console.error('Error al procesar el comando:', error);
        await conn.sendMessage(m.chat, { 
            text: '❌ *Error:* No se pudo completar la acción',
            mentions: [m.sender]
        }, { quoted: m });
    }
};

// Middleware para eliminar mensajes de usuarios muteados
handler.before = async (m, { conn }) => {
    if (mutedUsers.has(m.sender) && !m.key.fromMe) {
        try {
            await conn.sendMessage(m.chat, { delete: m.key });
            console.log(`Mensaje de ${m.sender} eliminado (usuario muteado)`);
        } catch (error) {
            console.error('Error al eliminar mensaje:', error);
        }
    }
};

// Configuración del handler
handler.tags = ['moderación'];
handler.help = [
    'mute @usuario - Mutea a un usuario en el grupo',
    'unmute @usuario - Desmutea a un usuario en el grupo'
];
handler.command = /^(\.?mute|\.?unmute)$/i;
handler.group = true;
handler.admin = true;
handler.botAdmin = true;

export default handler;
