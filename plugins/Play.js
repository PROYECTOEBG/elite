import fetch from "node-fetch";
import yts from "yt-search";

// API en formato Base64
const encodedApi = "aHR0cHM6Ly9hcGkudnJlZGVuLndlYi5pZC9hcGkveXRtcDM=";
const getApiUrl = () => Buffer.from(encodedApi, "base64").toString("utf-8");

const fetchWithRetries = async (url, maxRetries = 2) => {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(url);
      const data = await response.json();
      if (data?.status === 200 && data.result?.download?.url) {
        return data.result;
      }
    } catch (error) {
      console.error(`Intento ${attempt + 1} fallido:`, error.message);
    }
  }
  throw new Error("No se pudo obtener la música después de varios intentos.");
};

// Handler principal .spotify
let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text || !text.trim()) {
    throw `⭐ 𝘐𝘯𝘨𝘳𝘦𝘴𝘢 𝘦𝘭 𝘵𝘪́𝘵𝘶𝘭𝘰 𝘥𝘦 𝘭𝘢 𝘤𝘢𝘯𝘤𝘪𝘰́𝘯 𝘲𝘶𝘦 𝘥𝘦𝘴𝘦𝘢𝘴 𝘥𝘦𝘴𝘤𝘢𝘳𝘨𝘢𝘳.\n\n» 𝘌𝘫𝘦𝘮𝘱𝘭𝘰:\n${usedPrefix + command} Cypher - Rich Vagos`;
  }

  try {
    await conn.sendMessage(m.chat, { react: { text: "⚡", key: m.key } });

    const searchResults = await yts(text.trim());
    const video = searchResults.videos[0];
    if (!video) throw new Error("No se encontraron resultados.");

    const apiUrl = `${getApiUrl()}?url=${encodeURIComponent(video.url)}`;
    const apiData = await fetchWithRetries(apiUrl);

    // Formatear la hora actual (ej: "7:12 p. m.")
    const now = new Date();
    const timeString = now.toLocaleTimeString('es-MX', { 
      hour: 'numeric', 
      minute: '2-digit', 
      hour12: true 
    }).toLowerCase();

    // Mensaje con formato idéntico al de la imagen
    const messageText = 
`*${video.title.toUpperCase()}*  
Elite Bot Global  
${video.url}  

*SPOTIFY PREMIUM*  
01:27 ━━━━━━━────── 05:48  
⇄ㅤ◁ㅤ❚❚ㅤ▷ㅤ↻  
✔ ✅ ✅ ✅  
${video.title}  

${timeString}`;

    // Enviar mensaje con botón "VER CANAL"
    await conn.sendMessage(m.chat, {
      text: messageText,
      footer: ' ', // Espacio para separar el botón
      buttons: [
        { 
          buttonId: `${usedPrefix}vercanal`, 
          buttonText: { displayText: 'VER CANAL' }, 
          type: 1 
        }
      ],
      contextInfo: {
        externalAdReply: {
          title: video.title,
          body: "Elite Bot Global",
          thumbnailUrl: video.thumbnail,
          mediaType: 1,
          renderLargerThumbnail: true,
          showAdAttribution: true,
          sourceUrl: video.url
        }
      }
    }, { quoted: m });

    // Enviar el audio con metadatos
    await conn.sendMessage(m.chat, {
      audio: { 
        url: apiData.download.url,
      },
      mimetype: "audio/mpeg",
      fileName: `${video.title}.mp3`,
      ptt: false,
      contextInfo: {
        mentionedJid: [m.sender],
        forwardingScore: 999,
        isForwarded: true,
        externalAdReply: {
          title: video.title,
          body: "Reproduciendo en Spotify Premium",
          thumbnailUrl: video.thumbnail,
          mediaType: 1,
          renderLargerThumbnail: true
        }
      }
    }, { quoted: m });

    await conn.sendMessage(m.chat, { react: { text: "✅", key: m.key } });

  } catch (error) {
    console.error("Error:", error);
    await conn.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
    await conn.sendMessage(m.chat, {
      text: `❌ *Error al procesar tu solicitud:*\n${error.message || "Error desconocido"}`
    });
  }
};

// Comandos y configuración
handler.help = ['spotify <búsqueda>'];
handler.tags = ['downloader', 'music'];
handler.command = /^(spotify|music|vercanal)$/i;
handler.exp = 0;
export default handler;
