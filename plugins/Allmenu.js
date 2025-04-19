let handler = async (m, { conn, args, usedPrefix, command }) => {
    let texto = `
╭━━━━━━━━━━━━━━━━━━━╮
┃ EliteBot
┃ MODALIDAD: CLK
┃ ROPA: verde
╰━━━━━━━━━━━━━━━━━━━╯

Escuadra 1:
👤 ➤
👤 ➤
👤 ➤
👤 ➤

Escuadra 2:
👤 ➤
👤 ➤
👤 ➤
👤 ➤

SUPLENTE:
👤
👤
👤

BOLLLOBOT / MELDEXZZ.`

    const buttons = [
        {buttonId: '.escuadra1', buttonText: {displayText: 'Escuadra 1'}, type: 1},
        {buttonId: '.escuadra2', buttonText: {displayText: 'Escuadra 2'}, type: 1},
        {buttonId: '.suplente', buttonText: {displayText: 'Suplente'}, type: 1},
        {buttonId: '.limpiarlista', buttonText: {displayText: 'Limpiar lista'}, type: 1}
    ]

    const buttonMessage = {
        text: texto,
        footer: 'EliteBot',
        buttons: buttons,
        headerType: 1
    }

    await conn.sendMessage(m.chat, buttonMessage)
}

handler.help = ['listaff']
handler.tags = ['main']
handler.command = /^(listaff)$/i

export default handler
