import { generateWAMessageFromContent } from '@whiskeysockets/baileys'

let handler = async (m, { conn }) => {
    let msg = await generateWAMessageFromContent(m.chat, {
        listMessage: {
            title: "EliteBot",
            description: `
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
👤 ✓ 
👤 ✓ 
👤 ✓ 

BOLLLOBOT / MELDEXZZ.`,
            buttonText: "Selecciona una opción",
            listType: 1,
            sections: [{
                title: "Opciones Disponibles",
                rows: [
                    { title: 'Escuadra 1', rowId: '.escuadra1' },
                    { title: 'Escuadra 2', rowId: '.escuadra2' },
                    { title: 'Suplente', rowId: '.suplente' },
                    { title: 'Limpiar lista', rowId: '.limpiarlista' }
                ]
            }]
        }
    }, {})
    
    return await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id })
}

handler.help = ['listaff']
handler.tags = ['main']
handler.command = /^listaff$/i

export default handler 
