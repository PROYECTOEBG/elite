let autoInterval = {}

function startAutoMessages(conn, chatId) {
  if (autoInterval[chatId]) return // evitar duplicados

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
    '—¿Cuál es tu plato favorito? —Pues el hondo, ¡porque cabe más comida!',
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
    { name: 'Frase', list: frases },
    { name: 'Ánimo', list: animos },
    { name: 'Chiste', list: chistes },
    { name: 'Noticia', list: noticias }
  ]

  autoInterval[chatId] = setInterval(() => {
    const cat = categories[Math.floor(Math.random() * categories.length)]
    const text = cat.list[Math.floor(Math.random() * cat.list.length)]
    conn.sendMessage(chatId, { text: `*${cat.name}:* ${text}` })
  }, 60_000)
}

// Comando opcional para detenerlo manualmente
let handler = async (m, { conn, args, command }) => {
  const chatId = m.chat

  if (args[0] === 'off') {
    if (autoInterval[chatId]) {
      clearInterval(autoInterval[chatId])
      delete autoInterval[chatId]
      return m.reply('🛑 Mensajes automáticos detenidos.')
    } else {
      return m.reply('No hay mensajes automáticos activos en este chat.')
    }
  } else {
    return m.reply('Este autoenvío ya está activado por defecto.')
  }
}

handler.command = ['autoenvios']
handler.help = ['autoenvios off']
handler.tags = ['tools']
handler.group = false
handler.admin = false
handler.rowner = false

export default handler

// Arranque automático al iniciar
global.plugins ??= {}
global.plugins['autoenvios-start'] = {
  async all(m, { conn }) {
    // puedes ajustar esto para que solo funcione en ciertos chats
    const chatId = m.chat
    startAutoMessages(conn, chatId)
  }
}
