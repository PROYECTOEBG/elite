import { schedule } from 'node-schedule'
import fetch from 'node-fetch'

let handler = async (m, { conn, args, text, usedPrefix, command }) => {
    if (!args[0]) return m.reply(`*[❗] Formato incorrecto*\n\n*Uso correcto:*
🔰 ${usedPrefix + command} on -> Activar mensajes automáticos
🔰 ${usedPrefix + command} off -> Desactivar mensajes automáticos
    
*Ejemplo:* ${usedPrefix + command} on`)

    let chat = global.db.data.chats[m.chat]
    
    if (args[0].toLowerCase() === 'on') {
        if (chat.automensaje) return m.reply('*[❗] Los mensajes automáticos ya están activados en este chat*')
        chat.automensaje = true
        await startAutoMessages(conn, m.chat)
        m.reply('*[✅] Mensajes automáticos activados*\n\n*Se enviarán mensajes cada minuto*')
    } else if (args[0].toLowerCase() === 'off') {
        if (!chat.automensaje) return m.reply('*[❗] Los mensajes automáticos ya están desactivados en este chat*')
        chat.automensaje = false
        m.reply('*[✅] Mensajes automáticos desactivados*')
    } else {
        m.reply(`*[❗] Formato incorrecto*\n\n*Uso correcto:*
🔰 ${usedPrefix + command} on -> Activar mensajes automáticos
🔰 ${usedPrefix + command} off -> Desactivar mensajes automáticos
        
*Ejemplo:* ${usedPrefix + command} on`)
    }
}

handler.help = ['automensaje <on/off>']
handler.tags = ['group']
handler.command = /^(automensaje|autom)$/i
handler.group = true
handler.admin = true
handler.botAdmin = true

export default handler

// Mensajes predefinidos por categoría
const mensajes = {
    frases: [
        "🌟 *Frase del día:* La vida es como un libro, cada día una nueva página llena de sorpresas ✨",
        "🎯 *Reflexión:* El éxito no es el final, el fracaso no es fatal: es el coraje para continuar lo que cuenta 💫",
        "🌈 *Inspiración:* Sé el cambio que quieres ver en el mundo 🌍",
        "💭 *Pensamiento:* La felicidad no es algo hecho. Viene de tus propias acciones ✨",
        "🌺 *Motivación:* Cada día es una nueva oportunidad para cambiar tu vida 🌟"
    ],
    chistes: [
        "😄 ¿Qué hace una abeja en el gimnasio?\n¡Zum-ba! 🐝",
        "😂 ¿Por qué los pájaros no usan Facebook?\nPorque ya tienen Twitter 🐦",
        "🤣 ¿Qué le dice un jaguar a otro jaguar?\n¡Jaguar you! 🐆",
        "😅 ¿Por qué el libro de matemáticas está triste?\n¡Porque tiene muchos problemas! 📚",
        "😆 ¿Qué hace una vaca en una computadora?\n¡Vacebook! 🐮"
    ],
    animo: [
        "💪 *¡Tú puedes con todo!* Hoy será un día increíble ⭐",
        "🌞 *¡Buenos días!* Que la energía positiva te acompañe en todo momento 🌈",
        "✨ *¡Ánimo!* Cada día es una nueva oportunidad para brillar 🌟",
        "🎯 *¡A por todas!* El éxito te está esperando 🚀",
        "💫 *¡Confía en ti!* Eres capaz de lograr todo lo que te propongas 🌠"
    ],
    noticias: [
        "📰 *Tecnología:* La IA sigue revolucionando el mundo digital 🤖",
        "🌍 *Medio Ambiente:* Nuevas iniciativas para combatir el cambio climático 🌱",
        "🎮 *Gaming:* Los últimos lanzamientos están batiendo récords 🎯",
        "📱 *Apps:* Las aplicaciones más descargadas de la semana 💫",
        "🤖 *Innovación:* Nuevos avances en robótica y automatización ⚡"
    ],
    consejos: [
        "💡 *Tip del día:* Bebe agua regularmente para mantenerte hidratado 💧",
        "🧘‍♀️ *Bienestar:* Dedica 5 minutos al día a la meditación 🌸",
        "📚 *Productividad:* Organiza tus tareas por prioridad 📝",
        "🌿 *Salud:* Una caminata diaria mejora tu estado de ánimo 🚶‍♂️",
        "💪 *Fitness:* Estira tu cuerpo cada mañana para activarte 🌅"
    ]
}

// Función para obtener un mensaje aleatorio
function getMensajeAleatorio() {
    const categorias = Object.keys(mensajes)
    const categoriaAleatoria = categorias[Math.floor(Math.random() * categorias.length)]
    const mensajesCategoria = mensajes[categoriaAleatoria]
    return mensajesCategoria[Math.floor(Math.random() * mensajesCategoria.length)]
}

// Función para iniciar los mensajes automáticos
async function startAutoMessages(conn, chatId) {
    // Programar el envío de mensajes cada minuto
    schedule.scheduleJob('*/1 * * * *', async () => {
        try {
            const chat = global.db.data.chats[chatId]
            if (!chat?.automensaje) return // Si se desactivó, no enviar más mensajes
            
            const mensaje = getMensajeAleatorio()
            await conn.sendMessage(chatId, { text: mensaje })
        } catch (error) {
            console.error('Error al enviar mensaje automático:', error)
        }
    })
}
