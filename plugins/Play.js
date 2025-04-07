import fetch from "node-fetch";
import yts from "yt-search";

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

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text || !text.trim()) {
    throw `⭐ 𝘌𝘫𝘦𝘮𝘱𝘭𝘰:\n${usedPrefix + command} Belanova - Rosa Pastel`;
  }

  try {
    await conn.sendMessage(m.chat, { react: { text: "⚡", key: m.key } });

    const searchResults = await yts(text.trim());
    const video = searchResults.videos[0];
    if (!video) throw new Error("No se encontraron resultados.");

    const apiUrl = `${getApiUrl()}?url=${encodeURIComponent(video.url)}`;
    const apiData = await fetchWithRetries(apiUrl);

    // Formatear hora (ej: "7:43 p. m.")
    const now = new Date();
    const timeString = now.toLocaleTimeString('es-MX', { 
      hour: 'numeric', 
      minute: '2-digit', 
      hour12: true 
    }).toLowerCase();

    // Mensaje unificado con audio
    await conn.sendMessage(m.chat, {
      text: `*${video.title.toUpperCase()}*\nElite Bot Global 🌡\n☐ ☐ ☐ ☐\n\n${timeString}`,
      audio: { 
        url: apiData.download.url,
      },
      mimetype: "audio/mpeg",
      fileName: `${video.title}.mp3`,
      ptt: false,
      contextInfo: {
        mentionedJid: [m.sender],
        forwardingScore: 0,
        isForwarded: false,
        externalAdReply: {
          title: video.title,
          body: "Elite Bot Global",
          thumbnailUrl: video.thumbnail,
          mediaType: 1,
          renderLargerThumbnail: true,
          sourceUrl: video.url
        }
      }
    }, { quoted: m });

    await conn.sendMessage(m.chat, { react: { text: "✅", key: m.key } });

  } catch (error) {
    console.error("Error:", error);
    await conn.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
    await conn.sendMessage(m.chat, {
      text: `❌ *Error:*\n${error.message || "Intenta de nuevo más tarde."}`
    });
  }
};

handler.help = ['spotify <búsqueda>'];
handler.tags = ['music'];
handler.command = /^(spotify|music)$/i;
export default handler;
