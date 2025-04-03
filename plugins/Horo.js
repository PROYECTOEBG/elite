import fetch from 'node-fetch';

// ↓↓↓ REEMPLAZA ESTOS ENLACES CON TUS IMÁGENES REALES DE INSTAGRAM ↓↓↓
const zodiacImages = {
    cancer: [
        'https://www.instagram.com/cancer.horoscopoverde?igsh=MXVjNGdxdm5pZnlwbw==',  // Reemplazar con enlace real
        'https://www.instagram.com/cancer.horoscopoverde?igsh=MXVjNGdxdm5pZnlwbw=='   // Reemplazar con enlace real
    ],
    piscis: [
        'https://www.instagram.com/cancer.horoscopoverde?igsh=MXVjNGdxdm5pZnlwbw=='   // Reemplazar con enlace real
    ],
    aries: [
        'https://www.instagram.com/cancer.horoscopoverde?igsh=MXVjNGdxdm5pZnlwbw=='    // Reemplazar con enlace real
    ],
    tauro: [
        'https://www.instagram.com/cancer.horoscopoverde?igsh=MXVjNGdxdm5pZnlwbw=='    // Reemplazar con enlace real
    ],
    geminis: [
        'https://www.instagram.com/cancer.horoscopoverde?igsh=MXVjNGdxdm5pZnlwbw=='  // Reemplazar con enlace real
    ],
    leo: [
        'https://www.instagram.com/cancer.horoscopoverde?igsh=MXVjNGdxdm5pZnlwbw=='      // Reemplazar con enlace real
    ],
    virgo: [
        'https://www.instagram.com/cancer.horoscopoverde?igsh=MXVjNGdxdm5pZnlwbw=='    // Reemplazar con enlace real
    ],
    libra: [
        'https://www.instagram.com/cancer.horoscopoverde?igsh=MXVjNGdxdm5pZnlwbw=='     // Reemplazar con enlace real
    ],
    escorpio: [
        'https://www.instagram.com/cancer.horoscopoverde?igsh=MXVjNGdxdm5pZnlwbw==' // Reemplazar con enlace real
    ],
    sagitario: [
        'https://www.instagram.com/cancer.horoscopoverde?igsh=MXVjNGdxdm5pZnlwbw=='// Reemplazar con enlace real
    ],
    capricornio: [
        'https://www.instagram.com/cancer.horoscopoverde?igsh=MXVjNGdxdm5pZnlwbw=='// Reemplazar
    ],
    acuario: [
        'https://www.instagram.com/cancer.horoscopoverde?igsh=MXVjNGdxdm5pZnlwbw=='   // Reemplazar
    ]
};
// ↑↑↑ REEMPLAZA LOS ENLACES ARRIBA ↑↑↑

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
        
        const imageUrl = await getInstagramImage(sign);

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

async function getInstagramImage(sign) {
    if (!zodiacImages[sign]?.length) {
        throw new Error('No hay imágenes para este signo');
    }

    if (!usedImages.has(sign)) {
        usedImages.set(sign, []);
    }

    const available = zodiacImages[sign].filter(url => !usedImages.get(sign).includes(url));
    const selected = available.length ? 
        available[Math.floor(Math.random() * available.length)] : 
        zodiacImages[sign][0];
    
    usedImages.get(sign).push(selected);
    return await instagramToDirect(selected);
}

async function instagramToDirect(url) {
    try {
        if (url.match(/\.(jpg|jpeg|png)$/i)) return url;
        
        const postId = url.match(/\/p\/([^\/]+)/)?.[1];
        if (!postId) return url;
        
        // Intento 1: Formato simple
        const simpleUrl = `https://www.instagram.com/p/${postId}/media/?size=l`;
        const response = await fetch(simpleUrl, { method: 'HEAD' });
        if (response.ok) return simpleUrl;
        
        // Intento 2: API alternativa
        const apiUrl = `https://api.instagram.com/oembed/?url=${encodeURIComponent(url)}`;
        const apiResponse = await fetch(apiUrl);
        const data = await apiResponse.json();
        return data.thumbnail_url || url;
        
    } catch (e) {
        console.error('Error al convertir URL:', e);
        return url;
    }
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
        cancer: [
            "Hoy es un día para conectar con tus emociones.",
            "La luna favorece tu intuición hoy.",
            "Momento ideal para la familia."
        ],
        piscis: [
            "Día propicio para la creatividad.",
            "Las energías espirituales te guiarán.",
            "Escucha tu voz interior con atención."
        ],
        default: [
            "Las estrellas indican oportunidades hoy.",
            "Día clave para tu crecimiento.",
            "El universo está a tu favor."
        ]
    };
    const signPredictions = predictions[sign] || predictions.default;
    return signPredictions[Math.floor(Math.random() * signPredictions.length)];
}

handler.help = ['horoscopo <signo>'];
handler.tags = ['fun'];
handler.command = /^(horoscopo|horóscopo|signo)$/i;
export default handler;
