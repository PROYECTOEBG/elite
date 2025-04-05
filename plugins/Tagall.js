let handler = async(m, { isOwner, isAdmin, conn, participants, args, command }) => {
    if (!(isAdmin || isOwner)) {
        global.dfail('admin', m, conn)
        throw false
    }

    // Mutea a todos los miembros del grupo, excepto a los administradores
    let adminIds = participants.filter(p => p.isAdmin).map(p => p.id);
    let muteMessage = "🔇 **El grupo está en modo silencio, solo los administradores pueden hablar.** 🔇";

    // Enviar mensaje a todos los miembros excepto administradores
    for (let mem of participants) {
        if (!mem.isAdmin) {
            // Aquí es donde puedes aplicar el mute, dependiendo de la plataforma que estés usando (por ejemplo, WhatsApp)
            // Suponiendo que estamos usando un bot que puede enviar un mensaje:
            conn.sendMessage(m.chat, { text: muteMessage }, { mentions: [mem.id] });
        }
    }

    // Eliminar mensajes de miembros que no son administradores
    conn.on('message_create', async (msg) => {
        if (!msg.isGroup || adminIds.includes(msg.from)) return; // Si es un mensaje de un admin, no lo eliminamos

        // Eliminar el mensaje del usuario
        await conn.deleteMessage(m.chat, msg.key);
    });

    let info = `✅ **¡El grupo ha sido silenciado!**\nSolo los administradores pueden hablar.`;
    conn.sendMessage(m.chat, { text: info });
}

handler.command = /^(mute|silencio)$/i
handler.admin = true
handler.botAdmin = true
handler.group = true
export default handler
