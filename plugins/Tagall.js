let handler = async(m, { isOwner, isAdmin, conn, participants, args, command }) => {
    if (!(isAdmin || isOwner)) {
        global.dfail('admin', m, conn);
        throw false;
    }

    // Filtra los administradores
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
}

handler.command = /^(mute|silencio)$/i;
handler.admin = true;
handler.botAdmin = true;
handler.group = true;
export default handler;
