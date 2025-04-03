import fetch from 'node-fetch';

// Variable para almacenar las últimas imágenes usadas por signo
const lastUsedImages = new Map();

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
        
        // Obtener imagen única (con 3 intentos como máximo)
        let imageUrl;
        let attempts = 0;
        
        while (attempts < 3) {
            imageUrl = await getUniqueZodiacImage(sign);
            
            // Verificar que la imagen no se haya usado recientemente
            if (!lastUsedImages.has(sign) || lastUsedImages.get(sign) !== imageUrl) {
                break;
            }
            attempts++;
        }

        // Actualizar el registro de imágenes usadas
        lastUsedImages.set(sign, imageUrl);
        
        // Si tenemos demasiadas imágenes almacenadas, limpiar
        if (lastUsedImages.size > 30) {
            const [firstKey] = lastUsedImages.keys();
            lastUsedImages.delete(firstKey);
        }

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
        await sendBackupHoroscope(m, conn, zodiacSigns[sign]);
    }
};

// Función mejorada para obtener imágenes únicas
async function getUniqueZodiacImage(sign) {
    try {
        // Usar múltiples proveedores de imágenes
        const providers = [
            `https://source.unsplash.com/600x600/?${sign}-zodiac,astrology,stars&t=${Date.now()}`,
            `https://api.pexels.com/v1/search?query=${sign}+zodiac&per_page=1&page=${Math.floor(Math.random() * 10) + 1}`,
            `https://api.giphy.com/v1/gifs/random?api_key=dc6zaTOxFJmzC&tag=${sign}+zodiac`
        ];

        // Intentar con cada proveedor
        for (const provider of providers) {
            try {
                const response = await fetch(provider);
                
                if (provider.includes('unsplash.com')) {
                    return response.url;
                } else if (provider.includes('pexels.com')) {
                    const data = await response.json();
                    if (data.photos?.length > 0) {
                        return data.photos[0].src.medium;
                    }
                } else if (provider.includes('giphy.com')) {
                    const data = await response.json();
                    if (data.data?.images?.original?.url) {
                        return data.data.images.original.url;
                    }
                }
            } catch (e) {
                console.error(`Error con proveedor ${provider}:`, e);
            }
        }
        
        // Si todos fallan, usar imagen por defecto con timestamp
        return `https://i.imgur.com/${sign === 'cancer' ? '5Q9s5vY' : '7G7W9bX'}.jpg?t=${Date.now()}`;
    } catch (e) {
        console.error('Error en getUniqueZodiacImage:', e);
        return `https://i.imgur.com/${sign === 'cancer' ? '5Q9s5vY' : '7G7W9bX'}.jpg?t=${Date.now()}`;
    }
}

// Resto de las funciones (getHoroscopeData, getRandomAdvice, etc.) se mantienen igual que en el código anterior

handler.help = ['horoscopo <signo>'];
handler.tags = ['fun', 'horoscope'];
handler.command = /^(horoscopo|horóscopo|signo|zodiaco)$/i;
handler.limit = false;

export default handler;
