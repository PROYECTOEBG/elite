import { generateWAMessageFromContent } from '@whiskeysockets/baileys'

let handler = async (m, { conn }) => {
    const template = generateWAMessageFromContent(m.chat, {
        templateMessage: {
            hydratedTemplate: {
                hydratedContentText: `
EliteBot
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
                hydratedButtons: [{
                    urlButton: {
                        displayText: 'Escuadra 1',
                        url: '.escuadra1'
                    }
                }, {
                    urlButton: {
                        displayText: 'Escuadra 2',
                        url: '.escuadra2'
                    }
                }, {
                    quickReplyButton: {
                        displayText: 'Suplente',
                        id: '.suplente'
                    }
                }, {
                    quickReplyButton: {
                        displayText: 'Limpiar lista',
                        id: '.limpiarlista'
                    }
                }]
            }
        }
    }, { quoted: m })
    
    return await conn.relayMessage(m.chat, template.message, { messageId: template.key.id })
}

handler.command = ['listaff']
handler.tags = ['main']

export default handler
