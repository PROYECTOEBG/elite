import fetch from 'node-fetch';

// Cache para imágenes usadas recientemente
const imageCache = new Map();

let handler = async (m, { conn, args, usedPrefix, command }) => {
    const zodiacSigns = {
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

    // Mostrar lista de signos si no se especifica uno
    if (!args[0]) {
        let signList = Object.entries(zodiacSigns)
            .map(([key, val]) => `▢ ${usedPrefix}${command} ${key} - ${val}`)
            .join('\n');
        
        return conn.reply(m.chat, 
            `✨ *SIGNOS ZODIACALES DISPONIBLES* ✨\n\n${signList}\n\n` +
            `Ejemplo: *${usedPrefix}${command} cancer*`, 
            m
        );
    }

    const sign = args[0].toLowerCase();
    
    // Verificar si el signo es válido
    if (!zodiacSigns[sign]) {
        return conn.reply(m.chat, 
            `❌ Signo zodiacal no reconocido. Usa *${usedPrefix}${command}* para ver la lista de signos disponibles.`, 
            m
        );
    }

    try {
        // Indicar que el bot está escribiendo
        await conn.sendPresenceUpdate('composing', m.chat);

        // Obtener datos del horóscopo
        const horoscopeData = await getHoroscopeData(sign);
        
        // Obtener imagen única
        const imageUrl = await getUniqueZodiacImage(sign);

        // Construir mensaje
        const message = `*${zodiacSigns[sign]}*\n` +
                       `📆 *Fecha:* ${horoscopeData.date}\n\n` +
                       `🔮 *Predicción:*\n${horoscopeData.prediction}\n\n` +
                       `💡 *Consejo:* ${horoscopeData.advice}\n\n` +
                       `🍀 *Número de la suerte:* ${horoscopeData.luckyNumber}`;

        // Enviar mensaje con imagen
        await conn.sendMessage(m.chat, {
            image: { url: imageUrl },
            caption: message,
            mentions: [m.sender]
        }, { quoted: m });

    } catch (error) {
        console.error('Error en comando horóscopo:', error);
        // Usar la función de respaldo correctamente definida
        await sendLocalHoroscope(m, conn, zodiacSigns[sign]);
    }
};

// Función para obtener datos del horóscopo
async function getHoroscopeData(sign) {
    try {
        // API funcional de horóscopos
        const response = await fetch(`https://horoscope-app-api.vercel.app/api/v1/get-horoscope/daily?sign=${sign}&day=TODAY`);
        const data = await response.json();

        if (data?.data) {
            return {
                date: new Date().toLocaleDateString('es-ES', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                }),
                prediction: data.data.horoscope_data,
                advice: getRandomAdvice(),
                luckyNumber: Math.floor(Math.random() * 10) + 1
            };
        }
    } catch (e) {
        console.error('Error al obtener datos del horóscopo:', e);
    }

    // Datos de respaldo si la API falla
    return {
        date: new Date().toLocaleDateString(),
        prediction: getRandomPrediction(sign),
        advice: getRandomAdvice(),
        luckyNumber: Math.floor(Math.random() * 10) + 1
    };
}

// Función para obtener imágenes únicas
async function getUniqueZodiacImage(sign) {
    try {
        // Usar timestamp para evitar caché
        const timestamp = Date.now();
        const imageUrl = `https://source.unsplash.com/600x600/?${sign}-zodiac,astrology,stars&t=${timestamp}`;
        
        // Verificar si la imagen es nueva
        const response = await fetch(imageUrl, { method: 'HEAD' });
        const finalUrl = response.url;
        
        // Si la imagen no está en caché, usarla
        if (!imageCache.has(finalUrl)) {
            imageCache.set(finalUrl, true);
            
            // Limitar el cache a 30 imágenes
            if (imageCache.size > 30) {
                const [firstKey] = imageCache.keys();
                imageCache.delete(firstKey);
            }
            
            return finalUrl;
        }
        
        // Si está en caché, intentar con parámetros diferentes
        return `https://source.unsplash.com/600x600/?zodiac-${sign},constellation&t=${timestamp}`;
    } catch (e) {
        console.error('Error al obtener imagen:', e);
        return `https://i.imgur.com/${sign === 'cancer' ? '5Q9s5vY' : '7G7W9bX'}.jpg?t=${Date.now()}`;
    }
}

// Función de respaldo mejorada
async function sendLocalHoroscope(m, conn, signoName) {
    try {
        const sign = signoName.split(' ')[1]?.toLowerCase() || 'cancer';
        const localData = {
            date: new Date().toLocaleDateString(),
            prediction: getRandomPrediction(sign),
            advice: getRandomAdvice(),
            luckyNumber: Math.floor(Math.random() * 10) + 1
        };
        
        const message = `*${signoName}*\n` +
                       `📆 *Fecha:* ${localData.date}\n\n` +
                       `🔮 *Predicción:*\n${localData.prediction}\n\n` +
                       `💡 *Consejo:* ${localData.advice}\n\n` +
                       `🍀 *Número de la suerte:* ${localData.luckyNumber}`;
        
        await conn.sendMessage(m.chat, {
            image: { url: await getUniqueZodiacImage(sign) },
            caption: message
        }, { quoted: m });
    } catch (e) {
        console.error('Error en sendLocalHoroscope:', e);
        await conn.reply(m.chat, 
            '⚠️ Ocurrió un error al generar el horóscopo. Por favor intenta nuevamente.', 
            m
        );
    }
}

// Funciones auxiliares
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

function getRandomPrediction(sign) {
    const predictions = {
        cancer: [
            "Hoy es un buen día para conectar con tus emociones más profundas.",
            "La luna favorece tu intuición, confía en tus corazonadas.",
            "Momento ideal para fortalecer los lazos familiares."
        ],
        default: [
            "Las estrellas indican que tendrás un día lleno de oportunidades.",
            "Este es un día clave para tu crecimiento personal.",
            "El universo está alineado a tu favor hoy."
        ]
    };
    
    const signPredictions = predictions[sign] || predictions.default;
    return signPredictions[Math.floor(Math.random() * signPredictions.length)];
}

// Configuración del comando
handler.help = ['horoscopo <signo>'];
handler.tags = ['fun', 'horoscope'];
handler.command = /^(horoscopo|horóscopo|signo|zodiaco)$/i;
handler.limit = false;

export default handler;
