import fetch from 'node-fetch';

// Cache para imágenes y datos
const horoscopeCache = new Map();

let handler = async (m, { conn, args, usedPrefix, command }) => {
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
    
    const signo = args[0]?.toLowerCase();
    
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
        await conn.sendPresenceUpdate('composing', m.chat);
        
        // Obtener datos del horóscopo con manejo de caché
        const horoscopeData = await getHoroscopeData(signo);
        const imageUrl = await getHoroscopeImage(signo);
        
        const message = `*${signos[signo]}*\n` +
                       `📅 *Fecha:* ${horoscopeData.date}\n\n` +
                       `🔮 *Predicción:*\n${horoscopeData.prediction}\n\n` +
                       `💫 *Consejo:* ${horoscopeData.advice}\n\n` +
                       `🍀 *Número de suerte:* ${horoscopeData.lucky_number}`;
        
        await conn.sendMessage(m.chat, {
            image: { url: imageUrl },
            caption: message,
            mentions: [m.sender]
        }, { quoted: m });
        
    } catch (error) {
        console.error('Error en horóscopo:', error);
        await sendLocalHoroscope(m, conn, signos[signo]);
    }
};

// Nueva API funcional para horóscopos
async function getHoroscopeData(sign) {
    const cacheKey = `data_${sign}_${new Date().toLocaleDateString()}`;
    
    // Verificar caché primero
    if (horoscopeCache.has(cacheKey)) {
        return horoscopeCache.get(cacheKey);
    }
    
    try {
        // API alternativa 1 (horóscopo diario)
        const response = await fetch(`https://api.adderou.cl/tyaas/`);
        const data = await response.json();
        
        if (data && data.horoscopo && data.horoscopo[sign]) {
            const result = {
                date: new Date().toLocaleDateString(),
                prediction: data.horoscopo[sign].horoscopo,
                advice: data.horoscopo[sign].amor || getRandomAdvice(),
                lucky_number: Math.floor(Math.random() * 10) + 1
            };
            
            horoscopeCache.set(cacheKey, result);
            return result;
        }
    } catch (e) {
        console.error('Error con API principal:', e);
    }
    
    // Si falla la API principal, usar datos locales
    const localData = {
        date: new Date().toLocaleDateString(),
        prediction: getRandomPrediction(sign),
        advice: getRandomAdvice(),
        lucky_number: Math.floor(Math.random() * 10) + 1
    };
    
    horoscopeCache.set(cacheKey, localData);
    return localData;
}

// Función para obtener imágenes únicas
async function getHoroscopeImage(sign) {
    const cacheKey = `img_${sign}_${new Date().getDate()}`;
    
    if (horoscopeCache.has(cacheKey)) {
        return horoscopeCache.get(cacheKey);
    }
    
    try {
        const timestamp = Date.now();
        const imageUrl = `https://source.unsplash.com/600x600/?${sign},zodiac,astrology,stars&t=${timestamp}`;
        
        const response = await fetch(imageUrl, { method: 'HEAD' });
        if (response.ok) {
            horoscopeCache.set(cacheKey, response.url);
            return response.url;
        }
    } catch (e) {
        console.error('Error al obtener imagen:', e);
    }
    
    // Imagen por defecto si falla
    return `https://i.imgur.com/${sign === 'cancer' ? '5Q9s5vY' : '7G7W9bX'}.jpg`;
}

// Datos locales como respaldo
async function sendLocalHoroscope(m, conn, signoName) {
    const sign = signoName.split(' ')[1]?.toLowerCase() || 'cancer';
    const localData = {
        date: new Date().toLocaleDateString(),
        prediction: getRandomPrediction(sign),
        advice: getRandomAdvice(),
        lucky_number: Math.floor(Math.random() * 10) + 1
    };
    
    const message = `*${signoName}*\n` +
                   `📅 *Fecha:* ${localData.date}\n\n` +
                   `🔮 *Predicción:*\n${localData.prediction}\n\n` +
                   `💫 *Consejo:* ${localData.advice}\n\n` +
                   `🍀 *Número de suerte:* ${localData.lucky_number}`;
    
    await conn.sendMessage(m.chat, {
        image: { url: await getHoroscopeImage(sign) },
        caption: message
    }, { quoted: m });
}

function getRandomPrediction(sign) {
    const predictions = {
        cancer: [
            "Hoy es un buen día para conectar con tus emociones más profundas.",
            "La luna favorece tu intuición, confía en tus corazonadas.",
            "Momento ideal para fortalecer los lazos familiares."
        ],
        // Agrega predicciones para otros signos...
        default: [
            "Las estrellas indican que tendrás un día lleno de oportunidades.",
            "Este es un día clave para tu crecimiento personal.",
            "El universo está alineado a tu favor hoy."
        ]
    };
    
    const signPredictions = predictions[sign] || predictions.default;
    return signPredictions[Math.floor(Math.random() * signPredictions.length)];
}

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

handler.help = ['horoscopo <signo>'];
handler.tags = ['fun'];
handler.command = /^(horoscopo|horóscopo|signo)$/i;
handler.limit = true;

export default handler;
