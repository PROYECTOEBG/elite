// Guarda todos los intervalos por bot+chat
let autoInterval = {}

// Función para iniciar el autoenvío
const startAutoSend = (conn, chatId) => {
  const botId = conn.user?.jid
  const key = `${botId}|${chatId}`
  
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

  // Obtener todas las conexiones (bot principal + subbots)
  const connections = [conn, ...(global.conns?.map(c => c) || [])]

  if (!autoInterval[key]) {
    autoInterval[key] = setInterval(() => {
      const cat  = categories[Math.floor(Math.random() * categories.length)]
      const text = cat.list[Math.floor(Math.random() * cat.list.length)]
      
      // Enviar a través de todas las conexiones
      connections.forEach(bot => {
        if (bot?.user?.jid) { // Verificar que la conexión es válida
          bot.sendMessage(chatId, { text: `*${cat.name}:* ${text}` })
          .catch(err => console.error(`Error al enviar mensaje con bot ${bot.user.jid}:`, err))
        }
      })
    }, 60_000) // cada 60s
  }
}

// Función para detener el autoenvío
const stopAutoSend = (conn, chatId) => {
  const botId = conn.user?.jid
  const key = `${botId}|${chatId}`
  
  if (autoInterval[key]) {
    clearInterval(autoInterval[key])
    delete autoInterval[key]
    return true
  }
  return false
}

let handler = async (m, { conn, args, usedPrefix, command }) => {
  const chatId = m.chat
  const botId  = conn.user?.jid
  const key    = `${botId}|${chatId}`

  // apagar
  if (args[0] === 'off') {
    if (stopAutoSend(conn, chatId)) {
      return m.reply('🛑 Mensajes automáticos detenidos.')
    } else {
      return m.reply('No hay envíos automáticos activos en este chat.')
    }
  }

  // si ya existe
  if (autoInterval[key]) {
    return m.reply(`Ya está activo. Usa *${usedPrefix + command} off* para detener.`)
  }

  // Iniciar automáticamente
  startAutoSend(conn, chatId)
  await m.reply('✅ Envío automático activado. Mandaré un mensaje cada minuto en todos los bots.')
}

// Activar automáticamente al cargar el plugin
global.autoSend = startAutoSend
global.stopAutoSend = stopAutoSend

// Activar en todos los chats al iniciar
global.autoSend(conn, m.chat)

handler.command = ['autoenvios', 'automensajes']
handler.help    = ['autoenvios off', 'automensajes off']
handler.tags    = ['tools']
// quitamos group/admin/rowner para que funcione en cualquier sesión
handler.group  = false
handler.admin  = false
handler.rowner = false

export default handler
