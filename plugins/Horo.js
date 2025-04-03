import fetch from 'node-fetch';

let handler = async (m, { conn, args, usedPrefix, command }) => {
    // Lista de signos válidos
    const signos = {
        'aries': '♈ Aries',
        'tauro': '♉ Tauro',
        'geminis': '♊ Géminis',
        'cancer': '♋ Cáncer', 
        'leo': '♌ Leo',
        'virgo': '♍ Virgo',
        'libra': '♎ Libra',
        'escorpio': '♏ Escorpio',
        'sagitario': '♐ Sagitario',
        'capricornio': '♑ Capricornio',
        'acuario': '♒ Acuario',
        'piscis': '♓ Piscis'
    };
    
    // Obtener el signo solicitado
    const signo = args[0]?.toLowerCase();
    
    // Verificar si el signo es válido
    if (!signo || !signos[signo]) {
        let listaSignos = Object.entries(signos).map(([key, val]) => `▢ ${usedPrefix + command} ${key} - ${val}`).join('\n');
        await conn.reply(m.chat, `✨ *Horóscopo Disponible*\n\n${listaSignos}\n\nEjemplo: ${usedPrefix + command} cancer`, m);
        return;
    }
    
    try {
        // Mostrar estado de carga
        await conn.sendPresenceUpdate('composing', m.chat);
        
        // 1. Obtener imagen aleatoria del signo
        const horoscopeImage = await getHoroscopeImage(signo);
        
        // 2. Obtener predicción
        const prediction = await getHoroscopePrediction(signo);
        
        // 3. Construir mensaje
        const message = `*${signos[signo]}*\n\n` +
                       `📅 *Fecha:* ${new Date().toLocaleDateString()}\n\n` +
                       `🔮 *Predicción:*\n${prediction || 'Las estrellas no han revelado su destino hoy...'}\n\n` +
                       `💫 *Consejo del día:* ${getRandomAdvice()}`;
        
        // 4. Enviar mensaje de forma segura
        if (typeof m.chat === 'string' && m.chat.endsWith('@g.us') || m.chat.endsWith('@s.whatsapp.net')) {
            await conn.sendMessage(m.chat, {
                image: { url: horoscopeImage },
                caption: message,
                mentions: [m.sender]
            }, { quoted: m });
        } else {
            console.error('Chat ID no válido:', m.chat);
        }
        
    } catch (error) {
        console.error('Error en horóscopo:', error);
        await conn.reply(m.chat, `❌ Error al consultar el horóscopo. Intenta nuevamente más tarde.`, m);
    }
};

// Función para obtener imagen de horóscopo (versión segura)
async function getHoroscopeImage(sign) {
    try {
        // API de Unsplash como respaldo
        const response = await fetch(`https://source.unsplash.com/500x500/?zodiac,${sign},stars`);
        return response.url;
    } catch (e) {
        console.error('Error al obtener imagen:', e);
        return 'https://i.imgur.com/5Q9s5vY.jpg'; // Imagen por defecto
    }
}

// Función para obtener predicción (versión segura)
async function getHoroscopePrediction(sign) {
    try {
        const response = await fetch(`https://horoscope-api.herokuapp.com/horoscope/today/${sign}`);
        const data = await response.json();
        return data.horoscope || "La predicción no está disponible en este momento";
    } catch (e) {
        console.error('Error al obtener predicción:', e);
        return "Las estrellas están ocupadas, intenta más tarde";
    }
}

// Consejos aleatorios
function getRandomAdvice() {
    const advices = [
        "Confía en tu intuición hoy",
        "Es buen día para tomar decisiones importantes",
        "Evita los conflictos innecesarios",
        "El amor puede llegar cuando menos lo esperes",
        "Cuida tu salud emocional"
    ];
    return advices[Math.floor(Math.random() * advices.length)];
}

handler.help = ['horoscopoo <signo>'];
handler.tags = ['fun'];
handler.command = /^(horoscopoo|horóscopo|signo)$/i;
handler.limit = true;

export default handler;
