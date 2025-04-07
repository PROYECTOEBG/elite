import { randomUUID } from 'crypto'

let autoInterval = {}

export async function before(m, { conn }) {
  if (!m.isGroup) return
  let chat = global.db.data.chats[m.chat]
  if (!chat.welcome) return

  if (autoInterval[m.chat]) return // ya está activo

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

  const categorias = [
    { nombre: 'Frase', lista: frases },
    { nombre: 'Ánimo', lista: animos },
    { nombre: 'Chiste', lista: chistes },
    { nombre: 'Noticia', lista: noticias }
  ]

  autoInterval[m.chat] = setInterval(() => {
    let cat = categorias[Math.floor(Math.random() * categorias.length)]
    let texto = cat.lista[Math.floor(Math.random() * cat.lista.length)]
    conn.sendMessage(m.chat, { text: `*${cat.nombre}:* ${texto}` })
  }, 60_000)
}
