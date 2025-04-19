import { listas } from './listaff.js'

let handler = async (m, { conn }) => {
    const usuario = m.sender.split('@s.whatsapp.net')[0]
    const tag = m.sender
    const msg = (m.text || '').toLowerCase().trim()

    if (msg === '.escuadra 1' || msg === '.escuadra1') {
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
        return
    }
    
    if (msg === '.escuadra 2' || msg === '.escuadra2') {
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
        return
    }
    
    if (msg === '.suplente') {
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
        return
    }
    
    if (msg === '.limpiar lista' || msg === '.limpiarlista') {
        listas.squad1 = ['➢', '➢', '➢', '➢']
        listas.squad2 = ['➢', '➢', '➢', '➢']
        listas.suplente = ['✔', '✔', '✔']
        
        await conn.sendMessage(m.chat, {
            text: `♻️ Listas reiniciadas por @${usuario}`,
            mentions: [tag]
        })
        return
    }
}

handler.command = /^(escuadra1|escuadra 1|escuadra2|escuadra 2|suplente|limpiarlista|limpiar lista)$/i
handler.tags = ['main']

export default handler
