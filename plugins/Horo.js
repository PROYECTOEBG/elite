import fetch from 'node-fetch';

// Cache para llevar registro de imágenes usadas
const imageCache = new Map();

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
        
        // Obtener datos del horóscopo
        const horoscopeData = await getHoroscopeData(signo);
        
        // Obtener imagen única
        const imageUrl = await getUniqueImage(signo);
        
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
        await sendBackupHoroscope(m, conn, signos[signo]);
    }
};

// Función para obtener imagen única
async function getUniqueImage(sign) {
    const cacheKey = `img_${sign}`;
    let attempts = 0;
    let imageUrl;
    
    // Intentar hasta 3 veces obtener una imagen no usada
    while (attempts < 3) {
        try {
            // Usar timestamp para evitar caché
            const timestamp = Date.now();
            imageUrl = `https://source.unsplash.com/600x600/?${sign},zodiac,astrology,stars&t=${timestamp}`;
            
            const response = await fetch(imageUrl, { method: 'HEAD' });
            if (response.ok) {
                const finalUrl = response.url;
                
                // Verificar si esta URL no ha sido usada antes
                if (!imageCache.has(finalUrl)) {
                    imageCache.set(finalUrl, true);
                    
                    // Limitar el cache a 50 imágenes máximo
                    if (imageCache.size > 50) {
                        const [firstKey] = imageCache.keys();
                        imageCache.delete(firstKey);
                    }
                    
                    return finalUrl;
                }
            }
        } catch (e) {
            console.error('Error al verificar imagen:', e);
        }
        attempts++;
    }
    
    // Si falla, devolver imagen por defecto única
    return `https://source.unsplash.com/600x600/?${sign},universe&t=${Date.now()}`;
}

async function getHoroscopeData(sign) {
    try {
        const response = await fetch(`https://aztro.sameerkumar.website/?sign=${sign}&day=today`, {
            method: 'POST'
        });
        const data = await response.json();
        
        return {
            date: data.current_date,
            prediction: data.description,
            advice: data.mantra || getRandomAdvice(),
            lucky_number: data.lucky_number
        };
        
    } catch (error) {
        console.error('Error al obtener datos:', error);
        return {
            date: new Date().toLocaleDateString(),
            prediction: 'Las estrellas indican que tendrás un día lleno de oportunidades.',
            advice: getRandomAdvice(),
            lucky_number: Math.floor(Math.random() * 10) + 1
        };
    }
}

async function sendBackupHoroscope(m, conn, signoName) {
    const backupMessage = `*${signoName}*\n\n` +
                         `📅 Hoy es un día especial para ti.\n\n` +
                         `✨ Las estrellas indican que tendrás un día lleno de oportunidades.\n\n` +
                         `💫 Consejo: ${getRandomAdvice()}`;
    
    await conn.sendMessage(m.chat, {
        image: { url: `https://source.unsplash.com/600x600/?${signoName.toLowerCase()},universe&t=${Date.now()}` },
        caption: backupMessage
    }, { quoted: m });
}

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
