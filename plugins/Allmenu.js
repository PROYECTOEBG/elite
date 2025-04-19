let handler = async (m, { conn }) => {
    m.reply(`
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

BOLLLOBOT / MELDEXZZ.

Opciones disponibles:
• .escuadra1
• .escuadra2
• .suplente
• .limpiarlista`)
}

handler.command = ['listaff']
handler.tags = ['main']

export default handler
