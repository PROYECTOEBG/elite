import fs from 'fs'
import { join } from 'path'
import { fileURLToPath } from 'url'

const __dirname = fileURLToPath(new URL('.', import.meta.url))
const frasesPath = join(__dirname, '../src/frases.json')

// Cargar frases desde el archivo JSON
let frases = []
try {
  if (fs.existsSync(frasesPath)) {
    const fileContent = fs.readFileSync(frasesPath, 'utf8')
    if (!fileContent.trim()) {
      // Si el archivo está vacío, crear frases por defecto
      frases = [
        "🌟 ¡Hola! Soy un bot activo",
        "💫 Estoy aquí para ayudarte",
        "✨ Disfruta de mis funciones",
        "🎮 Juega con mis comandos",
        "🤖 Soy tu asistente virtual"
      ]
      fs.writeFileSync(frasesPath, JSON.stringify(frases, null, 2))
    } else {
      frases = JSON.parse(fileContent)
    }
  } else {
    // Frases por defecto si no existe el archivo
    frases = [
      "🌟 ¡Hola! Soy un bot activo",
      "💫 Estoy aquí para ayudarte",
      "✨ Disfruta de mis funciones",
      "🎮 Juega con mis comandos",
      "🤖 Soy tu asistente virtual"
    ]
    fs.writeFileSync(frasesPath, JSON.stringify(frases, null, 2))
  }
} catch (error) {
  console.error('Error al cargar frases:', error)
  // En caso de error, usar frases por defecto
  frases = [
    "🌟 ¡Hola! Soy un bot activo",
    "💫 Estoy aquí para ayudarte",
    "✨ Disfruta de mis funciones",
    "🎮 Juega con mis comandos",
    "🤖 Soy tu asistente virtual"
  ]
}

// Función para enviar mensajes
const sendMessage = async (conn) => {
  try {
    const frase = frases[Math.floor(Math.random() * frases.length)]
    const chats = await conn.groupFetchAllParticipating()
    
    for (let chat of Object.values(chats)) {
      if (chat.id.endsWith('@g.us')) { // Solo grupos
        try {
          await conn.sendMessage(chat.id, { text: frase })
        } catch (error) {
          console.error(`Error al enviar mensaje al grupo ${chat.id}:`, error)
        }
      }
    }
  } catch (error) {
    console.error('Error general al enviar mensajes:', error)
  }
}

// Función para iniciar el envío automático
export const initAutoMessages = (conn) => {
  // Enviar mensaje inicial
  sendMessage(conn)
  
  // Configurar intervalo para enviar mensajes cada 30 segundos
  setInterval(() => sendMessage(conn), 30000)
}

// Handler vacío ya que no necesitamos comandos
let handler = async (m, { conn }) => {}

handler.help = []
handler.tags = []
handler.command = /^$/i
handler.register = true

export default handler 
