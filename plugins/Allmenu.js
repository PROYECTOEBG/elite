import { generateWAMessageFromContent } from '@whiskeysockets/baileys'

export const listas = {
    escuadra1: [],
    escuadra2: [], 
    suplente: []
}

let handler = async (m, { conn }) => {
    let msg = `*[ LISTA DE STAFF ]*\n\n`
    
    msg += `*ESCUADRA 1:*\n`
    if (listas.escuadra1.length) {
        listas.escuadra1.forEach((user, i) => {
            msg += `${i + 1}. ${user}\n`
        })
    } else {
        msg += `_No hay miembros_\n`
    }
    
    msg += `\n*ESCUADRA 2:*\n`
    if (listas.escuadra2.length) {
        listas.escuadra2.forEach((user, i) => {
            msg += `${i + 1}. ${user}\n`
        })
    } else {
        msg += `_No hay miembros_\n`
    }
    
    msg += `\n*SUPLENTES:*\n`
    if (listas.suplente.length) {
        listas.suplente.forEach((user, i) => {
            msg += `${i + 1}. ${user}\n`
        })
    } else {
        msg += `_No hay suplentes_\n`
    }

    const template = generateWAMessageFromContent(m.chat, {
        templateMessage: {
            hydratedTemplate: {
                hydratedContentText: msg,
                hydratedFooterText: '\nSelecciona una opción:',
                hydratedButtons: [
                    {
                        quickReplyButton: {
                            displayText: 'Escuadra 1',
                            id: '.escuadra1'
                        }
                    },
                    {
                        quickReplyButton: {
                            displayText: 'Escuadra 2',
                            id: '.escuadra2'
                        }
                    },
                    {
                        quickReplyButton: {
                            displayText: 'Suplente',
                            id: '.suplente'
                        }
                    },
                    {
                        quickReplyButton: {
                            displayText: 'Limpiar Lista',
                            id: '.limpiarlista'
                        }
                    }
                ]
            }
        }
    }, { quoted: m })

    await conn.relayMessage(m.chat, template.message, { messageId: template.key.id })
}

handler.help = ['listaff']
handler.tags = ['main']
handler.command = /^listaff$/i

export default handler
