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
        return conn.reply(m, `✨ *Horóscopo Disponible*\n\n${listaSignos}\n\nEjemplo: ${usedPrefix + command} cancer`, m);
    }
    
    try {
        // Mostrar estado de carga
        await conn.sendPresenceUpdate('composing', m.chat);
        
        // 1. Obtener imagen aleatoria del signo desde una API
        const horoscopeImage = await getHoroscopeImage(signo);
        
        // 2. Obtener predicción desde otra API
        const prediction = await getHoroscopePrediction(signo);
        
        // 3. Construir mensaje
        const message = `*${signos[signo]}*\n\n` +
                       `📅 *Fecha:* ${new Date().toLocaleDateString()}\n\n` +
                       `🔮 *Predicción:*\n${prediction || 'Las estrellas no han revelado su destino hoy...'}\n\n` +
                       `💫 *Consejo del día:* ${getRandomAdvice()}`;
        
        // 4. Enviar imagen con texto
        await conn.sendMessage(m.chat, {
            image: { url: horoscopeImage },
            caption: message,
            mentions: [m.sender]
        }, { quoted: m });
        
    } catch (error) {
        console.error('Error en horóscopo:', error);
        conn.reply(m.chat, `❌ Error al consultar el horóscopo. Intenta nuevamente más tarde.`, m);
    }
};

// Función para obtener imagen de horóscopo desde API
async function getHoroscopeImage(sign) {
    // API 1: API de imágenes genéricas con tag de horóscopo
    const api1 = `https://source.unsplash.com/500x500/?zodiac-${sign},astrology`;
    
    // API 2: API alternativa (puedes agregar más)
    const api2 = `https://api.zodiac.com/images/${sign}/random`;
    
    // Intentar con la primera API
    try {
        const imgUrl = await fetch(api1).then(res => res.url);
        if (imgUrl.includes('unsplash.com')) return imgUrl;
    } catch (e) {}
    
    // Si falla, intentar con API alternativa
    try {
        const imgUrl = await fetch(api2).then(res => res.json()).then(data => data.url);
        return imgUrl;
    } catch (e) {
        // Si todo falla, imagen por defecto
        return 'https://i.imgur.com/5Q9s5vY.jpg';
    }
}

// Función para obtener predicción desde API
async function getHoroscopePrediction(sign) {
    try {
        const response = await fetch(`https://horoscope-api.herokuapp.com/horoscope/today/${sign}`);
        const data = await response.json();
        return data.horoscope || data.prediction || null;
    } catch (e) {
        return null;
    }
}

// Consejos aleatorios (puedes ampliar esta lista)
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

handler.help = ['horoscopoo <signo>'];
handler.tags = ['fun'];
handler.command = /^(horoscopoo|horóscopo|signo)$/i;
handler.limit = true;

export default handler;
