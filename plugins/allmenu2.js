import { listas } from './listaff.js'

let handler = async (m, { conn, text, command }) => {
    const usuario = m.sender.split('@s.whatsapp.net')[0]
    const tag = m.sender
    const comando = (text || '').toLowerCase()

    if (command == 'escuadra1' || command == 'escuadra 1') {
        if (listas.squad1.includes(`@${usuario}`) || listas.squad2.includes(`@${usuario}`) || listas.suplente.includes(`@${usuario}`)) {
            m.reply('Ya estás en una escuadra')
            return
        }
        
        const libre = listas.squad1.findIndex(p => p === '➢')
        if (libre === -1) {
            m.reply('Escuadra 1 está llena')
            return
        }
        
        listas.squad1[libre] = `@${usuario}`
        await conn.sendMessage(m.chat, {
            text: `✅ @${usuario} agregado a Escuadra 1`,
            mentions: [tag]
        })
    }
    
    else if (command == 'escuadra2' || command == 'escuadra 2') {
        if (listas.squad1.includes(`@${usuario}`) || listas.squad2.includes(`@${usuario}`) || listas.suplente.includes(`@${usuario}`)) {
            m.reply('Ya estás en una escuadra')
            return
        }
        
        const libre = listas.squad2.findIndex(p => p === '➢')
        if (libre === -1) {
            m.reply('Escuadra 2 está llena')
            return
        }
        
        listas.squad2[libre] = `@${usuario}`
        await conn.sendMessage(m.chat, {
            text: `✅ @${usuario} agregado a Escuadra 2`,
            mentions: [tag]
        })
    }
    
    else if (command == 'suplente') {
        if (listas.squad1.includes(`@${usuario}`) || listas.squad2.includes(`@${usuario}`) || listas.suplente.includes(`@${usuario}`)) {
            m.reply('Ya estás en una escuadra')
            return
        }
        
        const libre = listas.suplente.findIndex(p => p === '✔')
        if (libre === -1) {
            m.reply('Lista de suplentes llena')
            return
        }
        
        listas.suplente[libre] = `@${usuario}`
        await conn.sendMessage(m.chat, {
            text: `✅ @${usuario} agregado como Suplente`,
            mentions: [tag]
        })
    }
    
    else if (command == 'limpiarlista' || command == 'limpiar lista') {
        listas.squad1 = ['➢', '➢', '➢', '➢']
        listas.squad2 = ['➢', '➢', '➢', '➢']
        listas.suplente = ['✔', '✔', '✔']
        
        await conn.sendMessage(m.chat, {
            text: `♻️ Listas reiniciadas por @${usuario}`,
            mentions: [tag]
        })
    }
}

handler.command = /^(escuadra1|escuadra 1|escuadra2|escuadra 2|suplente|limpiarlista|limpiar lista)$/i
handler.tags = ['main']

export default handler
