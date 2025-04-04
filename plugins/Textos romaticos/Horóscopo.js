
      
let handler = async (m, { conn, usedPrefix, command, text }) => {
  // Base de datos completa de horóscopos
  const horoscopos = {
    aries: {
      simbolo: '♈️',
      elemento: '🔥 Fuego',
      color: 'Rojo pasión',
      predicciones: [
        "Hoy tu energía estará al máximo, perfecto para iniciar proyectos audaces.",
        "Un desafío laboral revelará tu verdadero potencial de liderazgo.",
        "El amor llegará de forma inesperada con alguien que comparte tu pasión.",
        "Una discusión familiar se resolverá favorablemente si controlas tu temperamento.",
        "Tu creatividad estará en su punto más alto, aprovecha para innovar."
      ],
      consejos: [
        "Canaliza tu energía en actividades físicas para mantener el equilibrio.",
        "Escucha antes de reaccionar en conversaciones delicadas hoy.",
        "Toma la iniciativa en ese proyecto que has estado posponiendo.",
        "Date tiempo para relajarte, incluso los guerreros necesitan descanso.",
        "Aprovecha tu magnetismo natural para conectar con personas influyentes."
      ]
    },
    tauro: {
      simbolo: '♉️',
      elemento: '🌍 Tierra',
      color: 'Verde esmeralda',
      predicciones: [
        "Tus finanzas mejorarán notablemente gracias a decisiones pasadas.",
        "Una relación antigua resurgirá con nuevos significados.",
        "Descubrirás un talento oculto relacionado con el arte culinario.",
        "La paciencia que has mostrado finalmente dará sus frutos.",
        "Un cambio en tu espacio vital traerá mayor armonía."
      ],
      consejos: [
        "Invierte en algo duradero en lugar de gastar en lo inmediato.",
        "Prueba una nueva experiencia gastronómica para estimular tus sentidos.",
        "Reorganiza tu espacio de trabajo para aumentar tu productividad.",
        "Sé honesto acerca de tus necesidades emocionales con tu pareja.",
        "Dedica tiempo a disfrutar de la naturaleza para recargar energías."
      ]
    },
    geminis: {
      simbolo: '♊️',
      elemento: '🌬️ Aire',
      color: 'Amarillo brillante',
      predicciones: [
        "Hoy estarás lleno de energía y nuevas ideas, ¡aprovéchalas!",
        "Las redes sociales jugarán un papel clave en tu día de hoy.",
        "Alguien cercano te ofrecerá una perspectiva diferente que te será útil.",
        "Tu mente rápida te ayudará a resolver problemas complejos.",
        "Un encuentro casual podría convertirte en el centro de atención."
      ],
      consejos: [
        "No te dejes llevar por la prisa, reflexiona antes de actuar.",
        "Comunica con claridad tus intenciones para evitar malentendidos.",
        "Si tienes dudas, consulta con un amigo de confianza.",
        "Tómate un tiempo para meditar y calmar tu mente activa.",
        "Mantén un equilibrio entre tus responsabilidades y tu tiempo personal."
      ]
    },
    cancer: {
      simbolo: '♋️',
      elemento: '🌊 Agua',
      color: 'Blanco plateado',
      predicciones: [
        "Tu intuición será tu mejor aliada hoy, confía en ella.",
        "Un problema emocional del pasado volverá a surgir, pero podrás manejarlo.",
        "Alguien de tu familia necesitará tu apoyo, tu presencia será importante.",
        "Hoy será un buen día para cuidar de ti mismo y reflexionar.",
        "La creatividad fluye en ti, es el momento de expresar tus emociones."
      ],
      consejos: [
        "No tengas miedo de pedir ayuda cuando la necesites.",
        "Haz ejercicio para liberar tensiones acumuladas.",
        "Escucha tus emociones y actúa en consecuencia.",
        "Evita caer en discusiones innecesarias, mantén la calma.",
        "Date tiempo para desconectar y recargar energías."
      ]
    },
    leo: {
      simbolo: '♌️',
      elemento: '🔥 Fuego',
      color: 'Dorado brillante',
      predicciones: [
        "Hoy tu carisma estará a su máximo nivel, atraerás a todos a tu alrededor.",
        "Un evento social te permitirá expandir tu red de contactos.",
        "Un cambio en tu actitud te permitirá mejorar tu relación con los demás.",
        "Tu creatividad te llevará a destacar en proyectos grupales.",
        "Una noticia que esperabas podría llegar hoy, pero ten paciencia."
      ],
      consejos: [
        "Haz uso de tu poder de persuasión para lograr tus objetivos.",
        "No descuides tus relaciones personales, son importantes para tu bienestar.",
        "Mantén los pies en el suelo, incluso cuando las cosas vayan bien.",
        "Dedica tiempo a la autoreflexión para fortalecer tu autoestima.",
        "Sé generoso con tus palabras, inspiras a los demás."
      ]
    },
    virgo: {
      simbolo: '♍️',
      elemento: '🌾 Tierra',
      color: 'Verde oliva',
      predicciones: [
        "El orden será clave para mantenerte productivo hoy.",
        "Tu enfoque detallado te permitirá resolver problemas complicados.",
        "Hoy recibirás buenas noticias relacionadas con tus finanzas.",
        "Alguien de tu entorno te pedirá consejo, y tu sabiduría será valiosa.",
        "Un nuevo proyecto profesional te traerá satisfacciones."
      ],
      consejos: [
        "No te obsesiones con los detalles, a veces lo global es más importante.",
        "Dedica tiempo a tu bienestar emocional, es igual de importante que el físico.",
        "Si te sientes abrumado, no dudes en delegar tareas.",
        "Haz una pausa para descansar y recargar energías cuando sea necesario.",
        "Sé más flexible y abierto a nuevas ideas."
      ]
    },
    libra: {
      simbolo: '♎️',
      elemento: '🌬️ Aire',
      color: 'Azul celeste',
      predicciones: [
        "Tu deseo de armonía será clave en la resolución de conflictos.",
        "Hoy es un buen día para hacer acuerdos importantes.",
        "Una situación en tu vida amorosa te traerá claridad.",
        "Alguien te pedirá tu opinión sobre una cuestión delicada.",
        "Recibirás noticias que cambiarán tu perspectiva sobre algo importante."
      ],
      consejos: [
        "Mantén la paz en tus relaciones, evita las confrontaciones.",
        "Haz lo que sea necesario para equilibrar tu vida profesional y personal.",
        "Hoy es un buen día para hacer un cambio de imagen o renovar tu estilo.",
        "Escucha con empatía antes de ofrecer una solución.",
        "Dedica tiempo a tu propio bienestar emocional."
      ]
    },
    escorpio: {
      simbolo: '♏️',
      elemento: '🔥 Fuego',
      color: 'Rojo sangre',
      predicciones: [
        "Hoy podrás superar un obstáculo que te había preocupado.",
        "Recibirás una oferta que te hará reconsiderar tus objetivos a largo plazo.",
        "Una relación personal se fortalecerá, te sentirás más unido/a a esa persona.",
        "Tus habilidades para resolver problemas serán puestas a prueba.",
        "Un cambio en tu vida laboral traerá nuevas oportunidades."
      ],
      consejos: [
        "No dejes que los miedos te frenen, eres más fuerte de lo que piensas.",
        "Escucha tu intuición, te está guiando por el camino correcto.",
        "No te apresures a tomar decisiones importantes, tómate tu tiempo.",
        "Aprovecha las oportunidades para reinventarte y crecer.",
        "Confía en el proceso, todo ocurre por una razón."
      ]
    },
    sagitario: {
      simbolo: '♐️',
      elemento: '🔥 Fuego',
      color: 'Violetas intensos',
      predicciones: [
        "Tu optimismo será contagioso, atraerás a personas con buenas energías.",
        "Un viaje o un cambio de escenario traerá nuevas perspectivas.",
        "Hoy tendrás oportunidades para ampliar tus conocimientos.",
        "Tu carácter aventurero te llevará a explorar nuevos horizontes.",
        "Recibirás noticias de una persona que está lejos."
      ],
      consejos: [
        "Mantén una mente abierta para nuevas experiencias.",
        "No te olvides de tu bienestar, es importante mantener el equilibrio.",
        "Sé generoso/a con los demás, la buena energía vuelve a ti.",
        "Realiza una actividad que te conecte con la naturaleza.",
        "Elige con cuidado las personas con las que compartes tu tiempo."
      ]
    },
    capricornio: {
      simbolo: '♑️',
      elemento: '🌍 Tierra',
      color: 'Gris oscuro',
      predicciones: [
        "Hoy serás capaz de tomar decisiones importantes con claridad.",
        "Tu enfoque disciplinado te ayudará a alcanzar metas profesionales.",
        "Alguien que admiras te ofrecerá una oportunidad para aprender.",
        "Un cambio en tu entorno te llevará a una mayor estabilidad.",
        "Tu dedicación será recompensada pronto."
      ],
      consejos: [
        "Mantén el enfoque, pero no te olvides de disfrutar el proceso.",
        "Ten paciencia, todo llega a su debido tiempo.",
        "Confía en tus habilidades y capacidades, no hay límites para ti.",
        "Haz una pausa para reflexionar sobre tus logros y metas.",
        "No tengas miedo de pedir ayuda cuando la necesites."
      ]
    },
    acuario: {
      simbolo: '♒️',
      elemento: '🌬️ Aire',
      color: 'Azul eléctrico',
      predicciones: [
        "Tu creatividad estará en su punto máximo, ¡aprovéchala!",
        "Las ideas innovadoras te harán destacar en tu entorno.",
        "Hoy te sentirás más conectado/a con tus amigos y seres queridos.",
        "Una oportunidad inesperada te hará repensar tus planes a futuro.",
        "Tu visión del futuro será más clara que nunca."
      ],
      consejos: [
        "Sé flexible con los cambios que se te presenten.",
        "No te dejes llevar por las expectativas de los demás.",
        "Haz una pausa para reflexionar sobre lo que realmente deseas.",
        "Confía en tus instintos, te están guiando correctamente.",
        "Deja espacio para la diversión, no todo tiene que ser serio."
      ]
    },
    piscis: {
      simbolo: '♓️',
      elemento: '💧 Agua',
      color: 'Turquesa marino',
      predicciones: [
        "Tu intuición te guiará hacia una decisión crucial.",
        "El arte o la música jugarán un papel sanador en tu vida.",
        "Un sueño revelador contendrá mensajes importantes.",
        "Ayudarás a alguien de manera significativa sin esperar nada a cambio.",
        "Una conexión espiritual se profundizará esta semana."
      ],
      consejos: [
        "Confía en tus corazonadas sobre esa situación confusa.",
        "Expresa tus emociones a través del arte o la escritura.",
        "Pasa tiempo cerca del agua para recargar energías.",
        "Practica la meditación para clarificar tus sentimientos.",
        "Sé compasivo contigo mismo tanto como con los demás."
      ]
    }
  };

  // Obtener signo del texto (ej: ".horoscopo cancer" -> "cancer")
  const signo = text.toLowerCase().trim();
  
  // Validación
  if (!horoscopos[signo]) {
    let listaSignos = '';
    for (const [s, data] of Object.entries(horoscopos)) {
      listaSignos += `▸ ${usedPrefix}horoscopo ${s} ${data.simbolo}\n`;
    }
    return m.reply(`🔮 *Signo no válido!*\n\nUsa:\n${listaSignos}\nEjemplo: *${usedPrefix}horoscopo cancer*`);
  }

  // Datos del signo
  const { simbolo, elemento, color, predicciones, consejos } = horoscopos[signo];
  
  // Selección aleatoria
  const prediccion = predicciones[Math.floor(Math.random() * predicciones.length)];
  const consejo = consejos[Math.floor(Math.random() * consejos.length)];
  const numeroSuerte = Math.floor(Math.random() * 9) + 1;
  const fecha = new Date().toLocaleDateString('es-ES', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  // Mensaje formateado
  const mensaje = `
*${simbolo} ${signo.charAt(0).toUpperCase() + signo.slice(1)}* (${elemento})

📅 *Fecha:* ${fecha}

🔮 *Predicción:* ${prediccion}

💡 *Consejo:* ${consejo}

✨ *Número de la suerte:* ${numeroSuerte}
🎨 *Color favorable:* ${color}

🌌 *Frase cósmica:* 
"${getFraseCosmica(signo)}"
  `;

  await conn.sendMessage(m.chat, { 
    text: mensaje,
    contextInfo: {
      externalAdReply: {
        title: `Horóscopo ${signo.toUpperCase()}`,
        body: "Descubre lo que las estrellas tienen preparado para ti",
        thumbnailUrl: 'https://telegra.ph/file/c2f5d3d26b6c9f0e7a1e3.jpg' // Reemplaza con tu imagen
      }
    }
  }, { quoted: m });
};

// Frases cósmicas por signo
function getFraseCosmica(signo) {
  const frases = {
    aries: "El valor abre caminos donde otros solo ven obstáculos",
    tauro: "La paciencia construye catedrales donde la prisa solo hace chozas",
    geminis: "El futuro pertenece a quienes creen en la belleza de sus sueños",
    cancer: "La serenidad proviene de la aceptación de uno mismo",
    leo: "El poder de tu corazón te guía hacia grandes logros",
    virgo: "La perfección radica en los pequeños detalles",
    libra: "La armonía solo puede nacer del respeto mutuo",
    escorpio: "El coraje es la llave que abre las puertas de tu destino",
    sagitario: "La aventura es el mejor maestro de la vida",
    capricornio: "La disciplina es el puente entre tus sueños y la realidad",
    acuario: "La innovación es el primer paso hacia un futuro brillante",
    piscis: "El océano del alma no tiene fronteras, solo conexiones infinitas"
  };
  return frases[signo] || "Las estrellas hablan a quienes saben escuchar";
}

handler.help = ['horoscopo <signo>'];
handler.tags = ['horoscope', 'fun'];
handler.command = /^horoscopo
