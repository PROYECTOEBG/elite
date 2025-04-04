// Importa fetch si es necesario para otras partes
import fetch from 'node-fetch';

// IMÁGENES DE CADA SIGNO — usa enlaces directos (.jpg/.png)
const zodiacImages = {
    aries: [
        'https://qu.ax/OuVMP.jpg',
        'https://ibb.co/4g9GBCKM',
        'https://qu.ax/Dnfcl.jpg'
    ],
    tauro: [
        'https://source.unsplash.com/400x400/?taurus',
        'https://source.unsplash.com/400x400/?bull'
    ],
    geminis: [
        'https://source.unsplash.com/400x400/?gemini',
        'https://source.unsplash.com/400x400/?twins'
    ],
    cancer: [
        'https://source.unsplash.com/400x400/?cancer',
        'https://source.unsplash.com/400x400/?moon'
    ],
    leo: [
        'https://source.unsplash.com/400x400/?leo',
        'https://source.unsplash.com/400x400/?lion'
    ],
    virgo: [
        'https://source.unsplash.com/400x400/?virgo',
        'https://source.unsplash.com/400x400/?woman'
    ],
    libra: [
        'https://source.unsplash.com/400x400/?libra',
        'https://source.unsplash.com/400x400/?scales'
    ],
    escorpio: [
        'https://source.unsplash.com/400x400/?scorpio',
        'https://source.unsplash.com/400x400/?scorpion'
    ],
    sagitario: [
        'https://source.unsplash.com/400x400/?sagittarius',
        'https://source.unsplash.com/400x400/?archer'
    ],
    capricornio: [
        'https://source.unsplash.com/400x400/?capricorn',
        'https://source.unsplash.com/400x400/?mountain'
    ],
    acuario: [
        'https://source.unsplash.com/400x400/?aquarius',
        'https://source.unsplash.com/400x400/?water'
    ],
    piscis: [
        'https://source.unsplash.com/400x400/?pisces',
        'https://source.unsplash.com/400x400/?ocean'
    ]
};

const usedImages = new Map();

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

    if (!args[0]) {
        let signList = Object.entries(zodiacSigns)
            .map(([key, val]) => `▢ ${usedPrefix}${command} ${key} - ${val}`)
            .join('\n');

        return conn.reply(m.chat, 
            `✨ *SIGNOS ZODIACALES DISPONIBLES* ✨\n\n${signList}\n\nEjemplo: ${usedPrefix}${command} cancer`, 
            m
        );
    }

    const sign = args[0].toLowerCase();
    
    if (!zodiacSigns[sign]) {
        return conn.reply(m.chat, 
            `❌ Signo no reconocido. Usa *${usedPrefix}${command}* para ver la lista.`, 
            m
        );
    }

    try {
        await conn.sendPresenceUpdate('composing', m.chat);

        const horoscopeData = {
            date: new Date().toLocaleDateString('es-ES', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            }),
            prediction: getRandomPrediction(sign),
            advice: getRandomAdvice(),
            luckyNumber: Math.floor(Math.random() * 10) + 1
        };
        
        const imageUrl = await getZodiacImage(sign);

        const message = `*${zodiacSigns[sign]}*\n📆 *Fecha:* ${horoscopeData.date}\n\n` +
                       `🔮 *Predicción:*\n${horoscopeData.prediction}\n\n` +
                       `💡 *Consejo:* ${horoscopeData.advice}\n\n` +
                       `🍀 *Número de la suerte:* ${horoscopeData.luckyNumber}`;

        await conn.sendMessage(m.chat, {
            image: { url: imageUrl },
            caption: message,
            mentions: [m.sender]
        }, { quoted: m });

    } catch (error) {
        console.error('Error:', error);
        await conn.reply(m.chat, 
            '⚠️ Error al mostrar el horóscopo. Intenta nuevamente.', 
            m
        );
    }
};

// Obtiene una imagen sin repetir hasta agotar las disponibles
async function getZodiacImage(sign) {
    const images = zodiacImages[sign];
    if (!images || images.length === 0) {
        throw new Error('No hay imágenes disponibles para este signo.');
    }

    if (!usedImages.has(sign)) {
        usedImages.set(sign, []);
    }

    const used = usedImages.get(sign);
    const available = images.filter(url => !used.includes(url));

    const selected = available.length > 0 
        ? available[Math.floor(Math.random() * available.length)] 
        : images[Math.floor(Math.random() * images.length)];

    used.push(selected);
    return selected;
}

function getRandomAdvice() {
    const advices = [
        "Confía en tu intuición",
        "Es buen día para decisiones importantes",
        "Evita conflictos innecesarios",
        "El amor puede sorprenderte hoy",
        "Cuida tu salud emocional"
    ];
    return advices[Math.floor(Math.random() * advices.length)];
}

function getRandomPrediction(sign) {
    const predictions = {
        aries: ["Hoy te sentirás lleno de energía.", "Una oportunidad laboral puede surgir.", "Sigue adelante con tus planes."],
        tauro: ["Buen día para enfocarte en tu estabilidad.", "El dinero podría llegar inesperadamente.", "Confía en ti mismo."],
        geminis: ["Tu creatividad estará al máximo.", "Las conversaciones serán clave hoy.", "Mantente flexible ante los cambios."],
        cancer: ["Las emociones estarán a flor de piel.", "Buena oportunidad para conectar con familia.", "Haz caso a tu intuición."],
        leo: ["Tendrás mucha confianza hoy.", "Alguien importante te reconocerá.", "Un buen día para brillar."],
        virgo: ["El orden y la planificación te favorecerán.", "Cuida tu salud hoy.", "Una sorpresa te espera."],
        libra: ["El equilibrio será clave.", "Toma decisiones con calma.", "Posible reencuentro con alguien especial."],
        escorpio: ["Tu intensidad será positiva hoy.", "Descubre un secreto importante.", "Evita los conflictos innecesarios."],
        sagitario: ["Aventúrate a hacer algo nuevo.", "Viajar puede ser una opción.", "La diversión será clave hoy."],
        capricornio: ["Es momento de enfocarte en tu carrera.", "Una persona influyente te ayudará.", "La paciencia será clave."],
        acuario: ["Las ideas innovadoras fluirán hoy.", "Conéctate con amigos.", "Un cambio inesperado será positivo."],
        piscis: ["Día propicio para la creatividad.", "Las energías espirituales te guiarán.", "Escucha tu voz interior con atención."],
        default: ["Las estrellas indican oportunidades hoy.", "Día clave para tu crecimiento.", "El universo está a tu favor."]
    };
    return predictions[sign] || predictions.default;
}

handler.help = ['horoscopo <signo>'];
handler.tags = ['fun'];
handler.command = /^(horoscopo|horóscopo|signo)$/i;
export default handler;
