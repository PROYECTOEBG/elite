import fetch from "node-fetch";
import yts from "yt-search";

// API en Base64
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
    throw `⭐ 𝘐𝘯𝘨𝘳𝘦𝘴𝘢 𝘦𝘭 𝘵𝘪́𝘵𝘶𝘭𝘰 𝘥𝘦 𝘭𝘢 𝘤𝘢𝘯𝘤𝘪𝘰́𝘯.\n\n» 𝘌𝘫𝘦𝘮𝘱𝘭𝘰:\n${usedPrefix + command} Mi canción favorita`;
  }

  try {
    await conn.sendMessage(m.chat, { react: { text: "⚡", key: m.key } });

    // Mensaje rápido mientras busca y descarga
    await conn.sendMessage(m.chat, {
      text: "*Buscando tu canción, un momento...*"
    }, { quoted: m });

    const searchResults = await yts(text.trim());
    const video = searchResults.videos[0];
    if (!video) throw new Error("No se encontraron resultados.");

    // Disparar la descarga sin bloquear la interfaz
    const apiUrl = `${getApiUrl()}?url=${encodeURIComponent(video.url)}`;
    const apiDataPromise = fetchWithRetries(apiUrl); // <-- se lanza antes

    // Enviar mensaje visual mientras descarga el audio
    await conn.sendMessage(m.chat, {
      text: `*⌈📀 SPOTIFY PREMIUM 📀⌋*\n01:27 ━━━━━⬤──── 05:48\n*⇄ㅤ   ◁   ❚❚   ▷   ↻*\n${video.title}`,
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

    // Esperar ahora sí la descarga
    const apiData = await apiDataPromise;

    await conn.sendMessage(m.chat, {
      audio: { url: apiData.download.url },
      mimetype: "audio/mpeg",
      fileName: `${video.title}.mp3`
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

handler.command = ['spotify'];
handler.exp = 0;
export default handler;
