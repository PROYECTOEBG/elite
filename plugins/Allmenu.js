import { createHash } from 'crypto'
import PhoneNumber from 'awesome-phonenumber'
import { canLevelUp, xpRange } from '../lib/levelling.js'

let handler = async (m, { conn, usedPrefix, command, args, text }) => {
  let squadData = {
    modalidad: 'CLK',
    ropa: 'verde',
    escuadra1: [],
    escuadra2: [],
    suplente: []
  }

  const sections = [
    {
      title: "BOLLLOBOT / MELDEXZZ",
      rows: [
        {title: "Escuadra 1", rowId: `${usedPrefix}squad1`},
        {title: "Escuadra 2", rowId: `${usedPrefix}squad2`},
        {title: "Suplente", rowId: `${usedPrefix}suplente`},
        {title: "Limpiar lista", rowId: `${usedPrefix}clearsquad`}
      ]
    }
  ]

  const listMessage = {
    text: `
EliteBot
MODALIDAD: ${squadData.modalidad}
ROPA: ${squadData.ropa}

Escuadra 1:
${squadData.escuadra1.map(p => `👤 ➤ ${p}`).join('\n') || '👤 ➤\n👤 ➤\n👤 ➤\n👤 ➤'}

Escuadra 2:
${squadData.escuadra2.map(p => `👤 ➤ ${p}`).join('\n') || '👤 ➤\n👤 ➤\n👤 ➤\n👤 ➤'}

SUPLENTE:
${squadData.suplente.map(p => `👤 ${p}`).join('\n') || '👤\n👤\n👤'}

BOLLLOBOT / MELDEXZZ.
Selecciona una opción:`,
    footer: "EliteBot Squad Manager",
    title: "📋 Gestión de Escuadras",
    buttonText: "Seleccionar Opción",
    sections
  }

  // Manejo de comandos
  switch (command) {
    case 'squad':
      return conn.sendMessage(m.chat, listMessage, { quoted: m })
    case 'squad1':
      if (text) {
        if (squadData.escuadra1.length >= 4) return m.reply('❌ Escuadra 1 está llena')
        squadData.escuadra1.push(text)
        return m.reply(`✅ Agregado a Escuadra 1: ${text}`)
      }
      break
    case 'squad2':
      if (text) {
        if (squadData.escuadra2.length >= 4) return m.reply('❌ Escuadra 2 está llena')
        squadData.escuadra2.push(text)
        return m.reply(`✅ Agregado a Escuadra 2: ${text}`)
      }
      break
    case 'suplente':
      if (text) {
        if (squadData.suplente.length >= 3) return m.reply('❌ Lista de suplentes llena')
        squadData.suplente.push(text)
        return m.reply(`✅ Agregado a Suplentes: ${text}`)
      }
      break
    case 'clearsquad':
      squadData.escuadra1 = []
      squadData.escuadra2 = []
      squadData.suplente = []
      return m.reply('✅ Listas limpiadas')
  }
}

handler.help = ['squad', 'squad1', 'squad2', 'suplente', 'clearsquad']
handler.tags = ['game']
handler.command = /^(squad|squad1|squad2|suplente|clearsquad)$/i

export default handler 
