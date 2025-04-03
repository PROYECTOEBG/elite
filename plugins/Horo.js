import fetch from 'node-fetch';

// ENLACES DE INSTAGRAM PARA CADA SIGNO ZODIACAL
const zodiacLinks = {
    aries: 'https://www.instagram.com/explore/tags/aries/',
    tauro: 'https://www.instagram.com/explore/tags/tauro/',
    geminis: 'https://www.instagram.com/explore/tags/geminis/',
    cancer: 'https://www.instagram.com/cancer.horoscopoverde?igsh=MXVjNGdxdm5pZnlwbw==',
    leo: 'https://www.instagram.com/explore/tags/leo/',
    virgo: 'https://www.instagram.com/explore/tags/virgo/',
    libra: 'https://www.instagram.com/explore/tags/libra/',
    escorpio: 'https://www.instagram.com/explore/tags/escorpio/',
    sagitario: 'https://www.instagram.com/explore/tags/sagitario/',
    capricornio: 'https://www.instagram.com/explore/tags/capricornio/',
    acuario: 'https://www.instagram.com/explore/tags/acuario/',
    piscis: 'https://www.instagram.com/explore/tags/piscis/'
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

        // Enlace de Instagram para el signo
        const instaLink = zodiacLinks[sign] || 'https://www.instagram.com/explore/tags/horoscopo/';

        const message = `*${zodiacSigns[sign]}*\n📆 *Fecha:* ${horoscopeData.date}\n\n` +
                       `🔮 *Predicción:*\n${horoscopeData.prediction}\n\n` +
                       `💡 *Consejo:* ${horoscopeData.advice}\n\n` +
                       `🍀 *Número de la suerte:* ${horoscopeData.luckyNumber}\n\n` +
                       `📸 *Ver imágenes en Instagram:* [Haz clic aquí](${instaLink})`;

        await conn.sendMessage(m.chat, { text: message }, { quoted: m });

    } catch (error) {
        console.error('Error:', error);
        await conn.reply(m.chat, 
            '⚠️ Error al mostrar el horóscopo. Intenta nuevamente.', 
            m
        );
    }
};

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
