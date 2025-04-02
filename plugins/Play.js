import fetch from "node-fetch";
import yts from 'yt-search';
import axios from "axios";

const formatAudio = ['mp3', 'm4a', 'webm', 'acc', 'flac', 'opus', 'ogg', 'wav'];
const formatVideo = ['360', '480', '720', '1080', '1440', '4k'];

const handler = async (m, { conn, text, command }) => {
  console.log(`Comando recibido: ${command}, Texto: ${text}`);  // Agregado para depuración

  try {
    if (!text.trim()) {
      return conn.reply(m.chat, `❀ Por favor, ingresa el nombre de la música a descargar.`, m);
    }

    const search = await yts(text);
    if (!search.all || search.all.length === 0) {
      return m.reply('No se encontraron resultados para tu búsqueda.');
    }

    const videoInfo = search.all[0];
    const { title, thumbnail, timestamp, views, ago, url } = videoInfo;
    const infoMessage = `「✦」Descargando *<${title}>*\n\n> ✦ Canal » *${videoInfo.author.name || 'Desconocido'}*\n> ✰ Vistas » *${views}*\n> ⴵ Duración » *${timestamp}*\n> ✐ Publicación » *${ago}*\n> 🜸 Link » ${url}\n`;

    await conn.reply(m.chat, infoMessage, m);

    let apiUrl = `https://api.neoxr.eu/api/youtube?url=${url}`;
    apiUrl += command.includes('mp3') ? `&type=audio&quality=128kbps` : `&type=video&quality=480p`;
    apiUrl += `&apikey=GataDios`;

    const response = await fetch(apiUrl);
    const textResponse = await response.text();

    try {
      const apiData = JSON.parse(textResponse);
      if (!apiData.data || !apiData.data.url) {
        throw new Error("La API no devolvió un enlace válido.");
      }

      if (command.includes('mp3')) {
        await conn.sendMessage(m.chat, { audio: { url: apiData.data.url }, mimetype: "audio/mpeg" }, { quoted: m });
      } else {
        await conn.sendMessage(m.chat, {
          video: { url: apiData.data.url },
          fileName: apiData.data.filename || 'video.mp4',
          mimetype: 'video/mp4',
          caption: '',
          thumbnail: apiData.data.thumbnail || null
        }, { quoted: m });
      }
    } catch (error) {
      console.error("Error al analizar JSON:", textResponse);
      return m.reply(`⚠︎ Error en la API: ${textResponse || error.message}`);
    }
  } catch (error) {
    console.error("Error en el handler:", error);
    return m.reply(`⚠︎ Ocurrió un error: ${error.message}`);
  }
};

handler.command = ['playtest', 'play2', 'ytmp3', 'yta', 'ytmp4', 'ytv', 'prueba'];  // Cambié 'play' por 'playtest'
handler.tags = ['downloader'];
handler.group = true;

export default handler;
