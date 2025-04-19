import { generateWAMessageFromContent } from '@whiskeysockets/baileys'

// Estado global para las listas
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

    const buttons = [
        { buttonId: '.escuadra1', buttonText: { displayText: '⚔️ Escuadra 1' }, type: 1 },
        { buttonId: '.escuadra2', buttonText: { displayText: '⚔️ Escuadra 2' }, type: 1 },
        { buttonId: '.suplente', buttonText: { displayText: '🔄 Suplente' }, type: 1 },
        { buttonId: '.limpiarlista', buttonText: { displayText: '🗑️ Limpiar Lista' }, type: 1 }
    ]

    const buttonMessage = {
        text: msg,
        footer: '\nSelecciona una opción:',
        buttons: buttons,
        headerType: 1
    }

    await conn.sendMessage(m.chat, buttonMessage)
}

handler.help = ['listaff']
handler.tags = ['main']
handler.command = /^listaff$/i

export default handler
