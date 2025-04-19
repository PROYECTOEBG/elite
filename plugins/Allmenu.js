let handler = async (m, { conn }) => {
    let texto = `╭━━━━━━━━━━━━━━━━━━━╮
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

Selecciona una opción:
1. .escuadra1
2. .escuadra2
3. .suplente
4. .limpiarlista`

    await m.reply(texto)
}

handler.command = ['listaff']
handler.tags = ['main']

export default handler
