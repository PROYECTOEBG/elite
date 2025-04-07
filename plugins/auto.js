let autoInterval = {}

let handler = async (m, { conn, args, usedPrefix, command }) => {
  const chatId = m.chat

  // Detener envío
  if (args[0] === 'off') {
    if (autoInterval[chatId]) {
      clearInterval(autoInterval[chatId])
      delete autoInterval[chatId]
      return m.reply('🛑 Mensajes automáticos detenidos.')
    } else {
      return m.reply('No hay mensajes automáticos activos en este chat.')
    }
  }

  // Evitar duplicados
  if (autoInterval[chatId]) {
    return m.reply(`Ya está activo. Usa *${usedPrefix + command} off* para detener.`)
  }

  // Listas con 5 ítems cada una
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
    { name: 'Frase', list: frases },
    { name: 'Ánimo', list: animos },
    { name: 'Chiste', list: chistes },
    { name: 'Noticia', list: noticias }
  ]

  // Confirmación de arranque
  m.reply('✅ Envío automático activado. Mandaré un mensaje cada minuto.')

  // Iniciar intervalo
  autoInterval[chatId] = setInterval(() => {
    const cat = categories[Math.floor(Math.random() * categories.length)]
    const text = cat.list[Math.floor(Math.random() * cat.list.length)]
    conn.sendMessage(chatId, { text: `*${cat.name}:* ${text}` })
  }, 60_000)
}

handler.command = ['autoenvios']
handler.help = ['autoenvios', 'autoenvios off']
handler.tags = ['tools']
handler.group = true
handler.admin = true

export default handler
