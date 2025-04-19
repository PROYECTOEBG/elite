import { listas } from './listaff.js'

// Lista global para mantener el estado
const listas = {
    escuadra1: [],
    escuadra2: [],
    suplente: []
}

// Función para unirse a escuadra 1
let handler1 = async (m, { conn }) => {
    let user = '@' + m.sender.split('@')[0]
    
    if (listas.escuadra1.includes(user) || listas.escuadra2.includes(user) || listas.suplente.includes(user)) {
        m.reply('Ya estás en una escuadra')
        return
    }
    
    if (listas.escuadra1.length >= 4) {
        m.reply('Escuadra 1 está llena')
        return
    }
    
    listas.escuadra1.push(user)
    m.reply('Te has unido a Escuadra 1')
}

// Función para unirse a escuadra 2
let handler2 = async (m, { conn }) => {
    let user = '@' + m.sender.split('@')[0]
    
    if (listas.escuadra1.includes(user) || listas.escuadra2.includes(user) || listas.suplente.includes(user)) {
        m.reply('Ya estás en una escuadra')
        return
    }
    
    if (listas.escuadra2.length >= 4) {
        m.reply('Escuadra 2 está llena')
        return
    }
    
    listas.escuadra2.push(user)
    m.reply('Te has unido a Escuadra 2')
}

// Función para unirse como suplente
let handler3 = async (m, { conn }) => {
    let user = '@' + m.sender.split('@')[0]
    
    if (listas.escuadra1.includes(user) || listas.escuadra2.includes(user) || listas.suplente.includes(user)) {
        m.reply('Ya estás en una escuadra')
        return
    }
    
    if (listas.suplente.length >= 3) {
        m.reply('Lista de suplentes llena')
        return
    }
    
    listas.suplente.push(user)
    m.reply('Te has unido como suplente')
}

// Función para limpiar lista
let handler4 = async (m, { conn }) => {
    listas.escuadra1 = []
    listas.escuadra2 = []
    listas.suplente = []
    m.reply('Se han limpiado todas las listas')
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
