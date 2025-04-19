let handler = async (m, { conn, args, usedPrefix, command }) => {
    let texto = `
*╭━━━━━━━━━━━━━━━━━━━╮*
┃ EliteBot
┃ MODALIDAD: CLK
┃ ROPA: verde
*╰━━━━━━━━━━━━━━━━━━━╯*

*Escuadra 1:*
👤 ➤
👤 ➤
👤 ➤
👤 ➤

*Escuadra 2:*
👤 ➤
👤 ➤
👤 ➤
👤 ➤

*SUPLENTE:*
👤
👤
👤

*BOLLLOBOT / MELDEXZZ.*`

    const templateButtons = [
        {index: 1, urlButton: {displayText: 'Escuadra 1', url: 'https://wa.me/' + conn.user.jid.split('@')[0] + '?text=.escuadra1'}},
        {index: 2, urlButton: {displayText: 'Escuadra 2', url: 'https://wa.me/' + conn.user.jid.split('@')[0] + '?text=.escuadra2'}},
        {index: 3, quickReplyButton: {displayText: 'Suplente', id: '.suplente'}},
        {index: 4, quickReplyButton: {displayText: 'Limpiar lista', id: '.limpiarlista'}}
    ]

    let templateMessage = {
        image: { url: 'https://i.ibb.co/K9JYWBg/avatar-contact.png' },  // Puedes cambiar esta URL por la imagen que desees
        caption: texto,
        footer: 'EliteBot',
        templateButtons: templateButtons,
        viewOnce: true
    }

    await conn.sendMessage(m.chat, templateMessage)
}

handler.help = ['listaff']
handler.tags = ['main']
handler.command = /^(listaff)$/i

export default handler
