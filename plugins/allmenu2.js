import { listas } from './listaff.js'

// Función para unirse a escuadra 1
let handler1 = async (m, { conn }) => {
    const usuario = m.sender.split('@')[0];
    const tag = m.sender;
    
    if (listas.squad1.includes(`@${usuario}`) || listas.squad2.includes(`@${usuario}`) || listas.suplente.includes(`@${usuario}`)) {
        m.reply('Ya estás en una escuadra')
        return
    }
    
    const libre = listas.squad1.findIndex(p => p === '➢');
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

// Función para unirse a escuadra 2
let handler2 = async (m, { conn }) => {
    const usuario = m.sender.split('@')[0];
    const tag = m.sender;
    
    if (listas.squad1.includes(`@${usuario}`) || listas.squad2.includes(`@${usuario}`) || listas.suplente.includes(`@${usuario}`)) {
        m.reply('Ya estás en una escuadra')
        return
    }
    
    const libre = listas.squad2.findIndex(p => p === '➢');
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

// Función para unirse como suplente
let handler3 = async (m, { conn }) => {
    const usuario = m.sender.split('@')[0];
    const tag = m.sender;
    
    if (listas.squad1.includes(`@${usuario}`) || listas.squad2.includes(`@${usuario}`) || listas.suplente.includes(`@${usuario}`)) {
        m.reply('Ya estás en una escuadra')
        return
    }
    
    const libre = listas.suplente.findIndex(p => p === '✔');
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

// Función para limpiar lista
let handler4 = async (m, { conn }) => {
    const usuario = m.sender.split('@')[0];
    const tag = m.sender;
    
    listas.squad1 = ['➢', '➢', '➢', '➢']
    listas.squad2 = ['➢', '➢', '➢', '➢']
    listas.suplente = ['✔', '✔', '✔']
    
    await conn.sendMessage(m.chat, {
        text: `♻️ Listas reiniciadas por @${usuario}`,
        mentions: [tag]
    })
}

handler1.command = /^escuadra1$/i
handler1.help = ['escuadra1']
handler1.tags = ['main']

handler2.command = /^escuadra2$/i
handler2.help = ['escuadra2']
handler2.tags = ['main']

handler3.command = /^suplente$/i
handler3.help = ['suplente']
handler3.tags = ['main']

handler4.command = /^limpiarlista$/i
handler4.help = ['limpiarlista']
handler4.tags = ['main']

export { handler1, handler2, handler3, handler4 }
