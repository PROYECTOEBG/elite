let handler = async(m, { isOwner, isAdmin, conn, text, participants, args, command }) => {
    if (!(isAdmin || isOwner)) {
        global.dfail('admin', m, conn)
        throw false
    }
    let pesan = args.join` `
    let oi = `📩 ${lenguajeGB['smsAddB5']()} ${pesan}`
    let teks = `*╭━* ${lenguajeGB['smstagaa']()} \n\n${oi}\n`
    
    teks += `👤 𝙈𝙄𝙀𝙈𝘽𝙍𝙊𝙎: *${participants.length}*\n\n`

    // Agregar las menciones de manera horizontal con líneas
    let horizontalMenciones = '┃ ';
    for (let mem of participants) {
        horizontalMenciones += `@${mem.id.split('@')[0]}  |  `; // Agrega cada mención separada por "|"
    }

    // Eliminar el último " | " extra
    horizontalMenciones = horizontalMenciones.slice(0, -3);

    teks += `${horizontalMenciones}\n`; // Coloca las menciones en una sola línea horizontal

    // Fecha y hora
    let fecha = new Date().toLocaleString();
    teks += `\n*Fecha y Hora*: *${fecha}*\n`;

    // Agregar un mensaje visual con un borde
    teks += `\n*╰━* 𝙀𝙇𝙄𝙏𝙀 𝘽𝙊𝙏 𝙂𝙇𝙊𝘽𝘼𝙇\n▌│█║▌║▌║║▌║▌║▌║█`;

    // Enviar el mensaje con las menciones horizontales
    conn.sendMessage(m.chat, { text: teks, mentions: participants.map(a => a.id) });
}

handler.command = /^(kevin|invocar|invocacion|todos|invocación)$/i
handler.admin = true
handler.botAdmin = true
handler.group = true
export default handler
