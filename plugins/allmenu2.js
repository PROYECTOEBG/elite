let handler = async (m, { conn }) => {
    let texto = `EliteBot
MODALIDAD: CLK
ROPA: verde

Escuadra 1:
👤 ➢
👤 ➢
👤 ➢
👤 ➢

Escuadra 2:
👤 ➢
👤 ➢
👤 ➢
👤 ➢

SUPLENTE:
👤
👤
👤

BOLLLOBOT / MELDEXZZ.`

    const templateButtons = [
        {index: 1, quickReplyButton: {displayText: 'Escuadra 1', id: 'escuadra1'}},
        {index: 2, quickReplyButton: {displayText: 'Escuadra 2', id: 'escuadra2'}},
        {index: 3, quickReplyButton: {displayText: 'Suplente', id: 'suplente'}},
        {index: 4, quickReplyButton: {displayText: 'Limpiar lista', id: 'limpiarlista'}}
    ]

    const templateMessage = {
        text: texto,
        footer: 'Selecciona una opción:',
        templateButtons: templateButtons
    }

    await conn.sendMessage(m.chat, templateMessage)
}

handler.command = ['listaff']
export default handler
