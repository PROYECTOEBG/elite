let handler = m => m

// Listas de mensajes
const frases = [
    'La vida es un 10% lo que me ocurre y 90% cómo reacciono a ello.',
    'El éxito es la suma de pequeños esfuerzos repetidos día tras día.',
    'Cada día es una nueva oportunidad para cambiar tu vida.',
    'No cuentes los días, haz que los días cuenten.',
    'El único lugar donde el éxito viene antes que el trabajo es en el diccionario.'
]

const animos = [
    '¡Tú eres más fuerte de lo que crees!',
    'Sigue adelante, lo mejor está por venir.',
    'Cada paso, por pequeño que sea, te acerca a tu meta.',
    'Cree en ti: tienes todo lo necesario para triunfar.',
    'Hoy es un gran día para empezar algo nuevo.'
]

const chistes = [
    '¿Por qué los pájaros no usan Facebook? ¡Porque ya tienen Twitter!',
    '¿Qué le dice un gusano a otro gusano? Voy a dar una vuelta a la manzana.',
    '—Oye, ¿cuál es tu plato favorito? —Pues el hondo, ¡porque cabe más comida!',
    '¿Cómo se dice pañuelo en japonés? Saka-moko.',
    '—¿Cuál es tu animal favorito? —El pingüino, ¡porque siempre va de etiqueta!'
]

const noticias = [
    'Noticia: Científicos descubren un nuevo planeta potencialmente habitable.',
    'Noticia: Avanza vacuna que promete reducir resfriados comunes.',
    'Noticia: Tecnología de IA crea obras de arte en segundos.',
    'Noticia: Nuevas baterías recargan tu móvil en 5 minutos.',
    'Noticia: Robot cirujano realiza primera operación sin supervisión humana.'
]

const categories = [
    { name: 'Frase',   list: frases },
    { name: 'Ánimo',   list: animos },
    { name: 'Chiste',  list: chistes },
    { name: 'Noticia', list: noticias }
]

// Función para enviar mensajes automáticos
const sendAutoMessage = (conn, chatId) => {
    const cat = categories[Math.floor(Math.random() * categories.length)]
    const text = cat.list[Math.floor(Math.random() * cat.list.length)]
    
    // Obtener todas las conexiones (bot principal + subbots)
    const connections = [conn, ...(global.conns?.map(c => c) || [])]
    
    // Enviar a través de todas las conexiones
    connections.forEach(bot => {
        if (bot?.user?.jid) {
            bot.sendMessage(chatId, { 
                text: `*${cat.name}:* ${text}`,
                contextInfo: {
                    forwardingScore: 9999999,
                    isForwarded: true,
                    externalAdReply: {
                        showAdAttribution: true,
                        renderLargerThumbnail: true,
                        title: '𝔼𝕃𝕀𝕋𝔼 𝔹𝕆𝕋 𝔾𝕃𝕆𝔹𝔸𝕃',
                        containsAutoReply: true,
                        mediaType: 1,
                        sourceUrl: 'https://whatsapp.com'
                    }
                }
            }).catch(err => console.error(`Error al enviar mensaje con bot ${bot.user.jid}:`, err))
        }
    })
}

// Iniciar autoenvío en todos los grupos al cargar el plugin
handler.before = async function (m, { conn, participants, groupMetadata, isBotAdmin }) {
    if (!m.isGroup || !global.db.data.chats[m.chat].welcome) return
    
    const chatId = m.chat
    const botId = conn.user?.jid
    const key = `${botId}|${chatId}`
    
    // Si no hay intervalo para este chat, crearlo
    if (!global.autoInterval) global.autoInterval = {}
    if (!global.autoInterval[key]) {
        // Enviar mensaje inmediatamente
        sendAutoMessage(conn, chatId)
        
        // Configurar intervalo para enviar cada minuto
        global.autoInterval[key] = setInterval(() => {
            sendAutoMessage(conn, chatId)
        }, 60_000) // cada 60s
    }
}

export default handler
