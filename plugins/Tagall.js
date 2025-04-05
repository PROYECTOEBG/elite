let isMuted = false; // Variable global para almacenar el estado de mute en el grupo

// Comando para silenciar el grupo
let handler = async (m, { isOwner, isAdmin, conn, participants, args, command }) => {
    if (!(isAdmin || isOwner)) {
        global.dfail('admin', m, conn);
        throw false;
    }

    if (command === 'silencio') {
        // Cambiar el estado de mute a verdadero
        isMuted = true;

        // Filtrar administradores
        let adminIds = participants.filter(p => p.isAdmin).map(p => p.id);
        let muteMessage = "🔇 **El grupo está en modo silencio, solo los administradores pueden hablar.** 🔇";

        // Enviar mensaje a todos los miembros excepto administradores
        for (let mem of participants) {
            if (!mem.isAdmin) {
                // Notificar al miembro que el grupo está silenciado
                conn.sendMessage(m.chat, { text: muteMessage }, { mentions: [mem.id] });
            }
        }

        // Informa que el comando fue ejecutado correctamente
        let info = `✅ **¡El grupo ha sido silenciado!**\nSolo los administradores pueden hablar.`;
        conn.sendMessage(m.chat, { text: info });

    } else if (command === 'unsilencio') {
        // Si el grupo no está silenciado, no hacer nada
        if (!isMuted) {
            conn.sendMessage(m.chat, { text: "El grupo no está silenciado." });
            return;
        }

        // Cambiar el estado de mute a falso
        isMuted = false;

        // Notificar a los miembros que el mute ha sido levantado
        let info = `✅ **¡El grupo ya no está silenciado!**\nAhora todos los miembros pueden hablar nuevamente.`;
        conn.sendMessage(m.chat, { text: info });

        // También podemos enviar un mensaje a los administradores si es necesario
        let unmuteMessage = "🔊 **El modo silencio ha sido levantado, ahora todos pueden hablar.** 🔊";
        for (let mem of participants) {
            if (!mem.isAdmin) {
                // Notificar a los miembros que el mute ha sido levantado
                conn.sendMessage(m.chat, { text: unmuteMessage }, { mentions: [mem.id] });
            }
        }
    }
};

handler.command = /^(silencio|unsilencio)$/i;
handler.admin = true;
handler.botAdmin = true;
handler.group = true;
export default handler;
