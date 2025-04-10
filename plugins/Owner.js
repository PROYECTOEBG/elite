let handler = async (m, { conn }) => {
    // Información del creador (personaliza estos datos)
    const creatorInfo = {
        name: "Russell xz 💬️", // Nombre del creador
        number: "593993370003", // Número internacional (formato libre)
        botName: "EliteBot Global", // Nombre de tu bot
        version: "2.0" // Versión del bot
    };

    // Hora actual formateada (ej: "12:03 a. m.")
    const timeString = new Date().toLocaleTimeString('es-MX', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    }).toLowerCase();

    // Mensaje estructurado como en la imagen
    await conn.sendMessage(m.chat, {
        text: `*${creatorInfo.botName.toUpperCase()} ${creatorInfo.version}*\n\n` +
              `${creatorInfo.number}\n\n` +
              `Nos despedimos con cariño; gracias por compartir momentos en ${creatorInfo.botName} 💬️.\n\n` +
              `${timeString}\n\n` +
              `#creador\n` +
              `${timeString} ✓\n\n` +
              `~ ${creatorInfo.botName.toLowerCase()} ${creatorInfo.version}\n` +
              `${creatorInfo.number}\n\n` +
              `${creatorInfo.name}\n\n` +
              `${timeString}`,
        
        footer: "Mensaje | Añadir contacto", // Pie de mensaje como en la imagen
        contextInfo: {
            mentionedJid: [m.sender],
            externalAdReply: {
                title: creatorInfo.botName,
                body: `Creado por ${creatorInfo.name}`,
                thumbnailUrl: "https://example.com/bot-thumbnail.jpg", // URL de miniatura
                mediaType: 1,
                renderLargerThumbnail: true
            }
        }
    }, { quoted: m });
};

// Configuración del comando
handler.help = ['Kevv'];
handler.tags = ['info'];
handler.command = /^(kevv|creador|contacto)$/i;
export default handler;
