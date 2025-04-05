let isMuted = false;  // Estado para verificar si el grupo está silenciado
let groupMuteState = {};  // Para mantener el estado del silencio por grupo (opcional)

// Comando para silenciar el grupo
let handler = async (m, { isOwner, isAdmin, conn, participants, args, command }) => {
    if (!(isAdmin || isOwner)) {
        global.dfail('admin', m, conn);
        throw false;
    }

    // Estado de silenciar para un grupo específico
    const groupId = m.chat;

    if (command === 'silencio') {
        // Activar el mute para el grupo
        isMuted = true;
        groupMuteState[groupId] = true; // Guardar el estado del mute por grupo

        let muteMessage = "🔇 **El grupo está en modo silencio, solo los administradores pueden hablar.** 🔇";

        // Enviar mensaje a todos los miembros no administradores
        for (let mem of participants) {
            if (!mem.isAdmin) {
                await conn.sendMessage(m.chat, { text: muteMessage }, { mentions: [mem.id] });
            }
        }

        // Enviar un mensaje indicando que el grupo está silenciado
        let info = `✅ **¡El grupo ha sido silenciado!**\nSolo los administradores pueden hablar.`;
        conn.sendMessage(m.chat, { text: info });

    } else if (command === 'unsilencio') {
        // Desactivar el mute para el grupo
        if (!isMuted) {
            conn.sendMessage(m.chat, { text: "El grupo no está silenciado." });
            return;
        }

        isMuted = false;
        groupMuteState[groupId] = false; // Guardar el estado de no mute por grupo

        // Informar que el grupo ya no está en silencio
        let info = `✅ **¡El grupo ya no está silenciado!**\nAhora todos los miembros pueden hablar nuevamente.`;
        conn.sendMessage(m.chat, { text: info });

        let unmuteMessage = "🔊 **El modo silencio ha sido levantado, ahora todos pueden hablar.** 🔊";
        for (let mem of participants) {
            if (!mem.isAdmin) {
                await conn.sendMessage(m.chat, { text: unmuteMessage }, { mentions: [mem.id] });
            }
        }
    }
};

// Event listener para eliminar mensajes de miembros no administradores cuando el grupo está silenciado
client.on('message_create', async (msg) => {
    // Verificar si el mensaje es de un grupo y si el grupo está silenciado
    if (!msg.isGroup) return;  // Solo procesar si es un grupo

    let groupId = msg.chat.id;
    let groupAdmins = await client.getGroupAdmins(groupId); // Obtener administradores del grupo

    // Verificar si el grupo está en modo silencio
    if (groupMuteState[groupId]) {
        // Si el mensaje no es de un administrador, lo eliminamos
        if (!groupAdmins.includes(msg.from)) {
            // Eliminar el mensaje de un miembro no administrador
            await client.deleteMessage(groupId, msg.key);

            // Enviar mensaje notificando al miembro que está silenciado
            await client.sendMessage(groupId, {
                text: `🔇 @${msg.from.split('@')[0]}, **estás silenciado. Solo los administradores pueden hablar.**`,
                mentions: [msg.from]
            });
        }
    }
});

handler.command = /^(silencio|unsilencio)$/i;
handler.admin = true;
handler.botAdmin = true;
handler.group = true;
export default handler;
