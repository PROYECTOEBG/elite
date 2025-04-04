let handler = async (m, { conn, text, usedPrefix, command }) => {
  // Datos mejorados para cada signo
  const horoscopos = {
    acuario: {
      simbolo: '♒️',
      predicciones: [
        "Hoy es un día perfecto para conectar con amigos y compartir tus ideas innovadoras.",
        "Una oportunidad inesperada llegará a tu vida laboral, mantente atento.",
        "Las energías cósmicas favorecen tu creatividad, aprovecha para iniciar proyectos artísticos."
      ],
      consejos: [
        "No temas expresar tus ideas diferentes, el mundo necesita tu perspectiva única.",
        "Dedica tiempo a meditar hoy, te ayudará a clarificar tus metas."
      ]
    },
    aries: {
      simbolo: '♈️',
      predicciones: [
        "Tu energía está por las nubes hoy, canalízala en actividades productivas.",
        "Un desafío laboral pondrá a prueba tu paciencia, pero saldrás victorioso.",
        "El amor te sorprenderá con un encuentro inesperado."
      ],
      consejos: [
        "Controla tu impulsividad en discusiones, piensa antes de hablar.",
        "Aprovecha tu energía para hacer ejercicio hoy."
      ]
    },
    cancer: {
      simbolo: '♋️',
      predicciones: [
        "Las emociones estarán a flor de piel hoy, busca el equilibrio interior.",
        "Un familiar necesitará tu apoyo emocional, sé comprensivo.",
        "Tu intuición estará especialmente aguda, confía en tu instinto."
      ],
      consejos: [
        "Dedica tiempo a cuidar tu espacio personal hoy.",
        "Escribe tus sentimientos, te ayudará a procesarlos mejor."
      ]
    },
    // ... (agregar todos los demás signos con la misma estructura)
  };

  // Obtener el nombre del signo del comando
  const signo = command.replace('horoscopo', '').toLowerCase();
  
  if (!horoscopos[signo]) {
    return m.reply(`🚫 Signo no reconocido. Usa ${usedPrefix}help para ver la lista.`);
  }

  // Seleccionar elementos aleatorios
  const data = horoscopos[signo];
  const prediccion = data.predicciones[Math.floor(Math.random() * data.predicciones.length)];
  const consejo = data.consejos[Math.floor(Math.random() * data.consejos.length)];
  const numeroSuerte = Math.floor(Math.random() * 10) + 1;

  // Mensaje formateado
  const mensaje = `
*${data.simbolo} ${signo.charAt(0).toUpperCase() + signo.slice(1)}*

🔮 *Predicción:* ${prediccion}

💡 *Consejo:* ${consejo}

✨ *Número de la suerte:* ${numeroSuerte}

📅 *Fecha:* ${new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
  `;

  await m.reply(mensaje);
}

handler.help = handler.command = [
  'horoscopoacuario', 'horoscopoaries', 'horoscopocancer', 
  'horoscopocapricornio', 'horoscopoescorpio', 'horoscopogeminis',
  'horoscopoleo', 'horoscopolibra', 'horoscopopiscis',
  'horoscoposagitario', 'horoscopotauro', 'horoscopovirgo'
];

handler.tags = ['horoscopo', 'zodiaco', 'divertido'];
export default handler;
