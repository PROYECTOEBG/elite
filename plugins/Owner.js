let handler = async (m, { conn, usedPrefix }) => {
    // Número del creador (reemplaza con el número real)
    const creadorNumero = '593993370003@s.whatsapp.net'; // Ejemplo: formato internacional con @s.whatsapp.net
    
    // Mensaje personalizado con botón de contacto
    await conn.sendMessage(m.chat, {
        text: `👑 *Creador de EliteBot Global* 👑\n\n¡Hola! Soy *Kevv*, el desarrollador de este bot. Contáctame para soporte o colaboraciones.`,
        contacts: {
            displayName: 'Kevv (Creador)',
            contacts: [{ vcard: `BEGIN:VCARD\nVERSION:3.0\nFN:Kevv\nTEL;type=CELL;type=VOICE;waid=${creadorNumero.split('@')[0]}:${creadorNumero.split('@')[0]}\nEND:VCARD` }]
        },
        contextInfo: {
            externalAdReply: {
                title: 'EliteBot Global',
                body: 'Creado por Kevv',
                thumbnailUrl: 'https://telegra.ph/file/1a5d3e8d4a9c9a0e7a1c2.jpg', // Imagen opcional
                mediaType: 1,
                renderLargerThumbnail: true
            }
        }
    }, { quoted: m });
};

// Configuración del comando
handler.help = ['Kevv'];
handler.tags = ['info'];
handler.command = /^(kevv|contacto|creador)$/i;
export default handler;
