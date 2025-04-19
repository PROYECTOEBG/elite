// Lista global para mantener el estado
export const listas = {
    escuadra1: [],
    escuadra2: [], 
    suplente: []
}

let handler = async (m, { conn }) => {
    let texto = `EliteBot
MODALIDAD: CLK
ROPA: verde

Escuadra 1:
${listas.escuadra1.map(u => `👤 ➢ ${u}`).join('\n')}${'\n👤 ➢'.repeat(Math.max(0, 4-listas.escuadra1.length))}

Escuadra 2:
${listas.escuadra2.map(u => `👤 ➢ ${u}`).join('\n')}${'\n👤 ➢'.repeat(Math.max(0, 4-listas.escuadra2.length))}

SUPLENTE:
${listas.suplente.map(u => '👤').join('\n')}${'\n👤'.repeat(Math.max(0, 3-listas.suplente.length))}

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
        templateButtons: templateButtons,
        mentions: [...listas.escuadra1, ...listas.escuadra2, ...listas.suplente].map(u => u.replace('@', '') + '@s.whatsapp.net')
    }

    await conn.sendMessage(m.chat, templateMessage)
}

handler.help = ['listaff']
handler.tags = ['main']
handler.command = ['listaff']

export default handler
