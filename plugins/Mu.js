let mutedUsers = new Set();

let handler = async (m, { conn, isAdmin, isBotAdmin }) => {
    // Sistema de detección de comandos mejorado
    const text = m.text || '';
    const isCommand = text.startsWith('.') || text.startsWith('!') || text.startsWith('/') || 
                     ['mute', 'unmute'].includes(text.split(' ')[0].toLowerCase());
    
    if (!isCommand) return;

    // Extraer comando base (sin punto ni otros prefijos)
    const command = text.split(' ')[0].toLowerCase().replace(/^[\.\!\\/]/, '');

    // Verificar si es mute/unmute
    const isMute = command === 'mute';
    const isUnmute = command === 'unmute';
    
    if (!isMute && !isUnmute) return;

    // Verificación de permisos
    if (!isBotAdmin) {
        return conn.reply(m.chat, '❌ El bot necesita ser administrador para esta acción', m);
    }
    
    if (!isAdmin) {
        return conn.reply(m.chat, '❌ Solo administradores pueden usar este comando', m);
    }

    // Obtener usuario mencionado
    const mentionedUser = m.mentionedJid?.[0];
    if (!mentionedUser) {
        return conn.reply(m.chat, 
            'ℹ️ *Uso correcto:*\n' + 
            '• `mute @usuario` - Mutea a un usuario\n' +
            '• `unmute @usuario` - Desmutea a un usuario\n\n' +
            'Ejemplo: `mute @593123456789`', 
            m
        );
    }

    // Ejecutar acción
    try {
        if (isMute) {
            mutedUsers.add(mentionedUser);
            await conn.sendMessage(m.chat, { 
                text: `✅ Usuario @${mentionedUser.split('@')[0]} ha sido muteado`,
                mentions: [mentionedUser]
            });
        } else if (isUnmute) {
            mutedUsers.delete(mentionedUser);
            await conn.sendMessage(m.chat, { 
                text: `✅ Usuario @${mentionedUser.split('@')[0]} ha sido desmuteado`,
                mentions: [mentionedUser]
            });
        }
    } catch (error) {
        console.error('Error:', error);
        conn.reply(m.chat, '❌ Ocurrió un error al procesar el comando', m);
    }
};

// Eliminar mensajes de usuarios muteados
handler.before = async (m, { conn }) => {
    if (mutedUsers.has(m.sender) {
        try {
            await conn.sendMessage(m.chat, { delete: m.key });
        } catch (error) {
            console.error('Error eliminando mensaje:', error);
        }
    }
};

// Configuración
handler.tags = ['group'];
handler.command = /^(mute|unmute)$/i;
handler.group = true;
handler.admin = true;
handler.botAdmin = true;

export default handler;
