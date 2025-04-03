import fetch from 'node-fetch';

let handler = async (m, { conn, args, usedPrefix, command }) => {
    // Lista de signos válidos con emojis
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
        let listaSignos = Object.entries(signos)
            .map(([key, val]) => `▢ ${usedPrefix + command} ${key} - ${val}`)
            .join('\n');
        return conn.reply(m.chat, 
            `✨ *Horóscopo Disponible*\n\n${listaSignos}\n\nEjemplo: ${usedPrefix + command} cancer`, 
            m
        );
    }
    
    try {
        // Mostrar estado de "escribiendo..."
        await conn.sendPresenceUpdate('composing', m.chat);
        
        // Obtener datos del horóscopo desde una API confiable
        const horoscopeData = await getHoroscopeData(signo);
        
        // Construir mensaje con formato
        const message = `*${signos[signo]}*\n` +
                       `📅 *Fecha:* ${horoscopeData.date || new Date().toLocaleDateString()}\n\n` +
                       `🔮 *Predicción:*\n${horoscopeData.prediction}\n\n` +
                       `💫 *Consejo del día:* ${horoscopeData.advice || getRandomAdvice()}\n\n` +
                       `⭐ *Número de suerte:* ${horoscopeData.lucky_number || Math.floor(Math.random() * 10) + 1}`;
        
        // Enviar mensaje con imagen
        await conn.sendMessage(m.chat, {
            image: { url: horoscopeData.image },
            caption: message,
            mentions: [m.sender]
        }, { quoted: m });
        
    } catch (error) {
        console.error('Error en horóscopo:', error);
        // Respuesta de respaldo si falla la API
        const backupMessage = `*${signos[signo]}*\n\n` +
                             `📅 Hoy es un día especial para ti.\n\n` +
                             `✨ Las estrellas indican que tendrás un día lleno de oportunidades.\n\n` +
                             `💫 Consejo: Confía en tu intuición.`;
        
        await conn.sendMessage(m.chat, {
            image: { url: 'https://i.imgur.com/5Q9s5vY.jpg' },
            caption: backupMessage
        }, { quoted: m });
    }
};

// Nueva función para obtener datos del horóscopo
async function getHoroscopeData(sign) {
    try {
        // API alternativa más confiable
        const response = await fetch(`https://aztro.sameerkumar.website/?sign=${sign}&day=today`, {
            method: 'POST'
        });
        const data = await response.json();
        
        // Obtener imagen relacionada
        const imageUrl = `https://source.unsplash.com/500x500/?${sign},zodiac,sign`;
        
        return {
            date: data.current_date,
            prediction: data.description,
            advice: data.mantra,
            lucky_number: data.lucky_number,
            image: imageUrl
        };
        
    } catch (error) {
        console.error('Error al obtener datos:', error);
        throw error;
    }
}

// Función para consejos aleatorios
function getRandomAdvice() {
    const advices = [
        "Confía en tu intuición hoy",
        "Es buen día para tomar decisiones importantes",
        "Evita los conflictos innecesarios",
        "El amor puede llegar cuando menos lo esperes",
        "Cuida tu salud emocional",
        "Un viaje corto podría ser beneficioso",
        "La paciencia será tu mayor virtud hoy"
    ];
    return advices[Math.floor(Math.random() * advices.length)];
}

handler.help = ['horoscopo <signo>'];
handler.tags = ['fun'];
handler.command = /^(horoscopo|horóscopo|signo)$/i;
handler.limit = true;

export default handler;
