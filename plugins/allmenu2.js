import { listas } from './listaff.js'

let handler = async (m, { conn }) => {
    const usuario = m.sender.split('@s.whatsapp.net')[0]
    const tag = m.sender
    
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

handler.customPrefix = /escuadra 1|escuadra1/i 
handler.command = new RegExp
handler.exp = 0
handler.owner = false

export default handler
