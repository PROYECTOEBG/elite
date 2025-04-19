import { generateWAMessageFromContent } from '@whiskeysockets/baileys'

let handler = async (m, { conn }) => {
    const rows = [
        {title: 'Escuadra 1', description: "Seleccionar Escuadra 1", rowId: '.escuadra1'},
        {title: 'Escuadra 2', description: "Seleccionar Escuadra 2", rowId: '.escuadra2'},
        {title: 'Suplente', description: "Seleccionar Suplente", rowId: '.suplente'},
        {title: 'Limpiar lista', description: "Limpiar todas las listas", rowId: '.limpiarlista'},
    ]
    
    const listMessage = {
        text: `EliteBot
MODALIDAD: CLK
ROPA: verde

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

BOLLLOBOT / MELDEXZZ.`,
        footer: null,
        title: "EliteBot",
        buttonText: "Selecciona una opción",
        sections: [
            {
                title: "BOLLLOBOT / MELDEXZZ",
                rows: rows
            }
        ]
    }

    let message = await generateWAMessageFromContent(m.chat, { listMessage }, { quoted: m })
    await conn.relayMessage(m.chat, message.message, { messageId: message.key.id })
}

handler.help = ['listaff']
handler.tags = ['main']
handler.command = /^listaff$/i

export default handler
