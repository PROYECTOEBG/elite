import fetch from 'node-fetch';
import yts from 'yt-search';
import { youtubedl, youtubedlv2 } from '@bochilteam/scraper';

const handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) {
    return conn.reply(m.chat, `*[❗] Por favor, ingresa el nombre del video que deseas descargar.*\n\n*Ejemplo:*\n${usedPrefix + command} Bad Bunny - Monaco`, m);
  }

  try {
    await conn.sendMessage(m.chat, { react: { text: "🕒", key: m.key } });

    const search = await yts(text);
    if (!search.videos || search.videos.length === 0) {
      return m.reply('*[❗] No se encontraron resultados para tu búsqueda.*');
    }

    const video = search.videos[0];
    const { title, thumbnail, timestamp, views, ago, url } = video;

    const infoMessage = `*乂 Y O U T U B E - D O W N L O A D 乂*\n\n*• Título:* ${title}\n*• Canal:* ${video.author.name}\n*• Duración:* ${timestamp}\n*• Vistas:* ${views}\n*• Publicado:* ${ago}\n*• URL:* ${url}\n\n*⏳ Descargando video...*`;

    await conn.sendMessage(m.chat, {
      image: { url: thumbnail },
      caption: infoMessage,
      contextInfo: {
        externalAdReply: {
          title: title,
          body: "Elite Bot - YouTube Downloader",
          thumbnailUrl: thumbnail,
          mediaType: 1,
          renderLargerThumbnail: true,
          showAdAttribution: true,
          sourceUrl: url
        }
      }
    }, { quoted: m });

    try {
      const yt = await youtubedl(url).catch(async _ => await youtubedlv2(url));
      const dl_url = await yt.video['360p'].download();
      const ttl = await yt.title;
      const size = await yt.video['360p'].fileSizeH;

      await conn.sendMessage(m.chat, {
        video: { url: dl_url },
        fileName: `${ttl}.mp4`,
        mimetype: 'video/mp4',
        caption: `*乂 Y O U T U B E - D O W N L O A D 乂*\n\n*• Título:* ${ttl}\n*• Tamaño:* ${size}\n\n*✅ Video descargado correctamente*`
      }, { quoted: m });

      await conn.sendMessage(m.chat, { react: { text: "✅", key: m.key } });
    } catch (error) {
      console.error(error);
      await conn.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
      return m.reply('*[❗] Error al descargar el video. Por favor, intenta nuevamente.*');
    }
  } catch (error) {
    console.error(error);
    await conn.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
    return m.reply('*[❗] Ocurrió un error inesperado. Por favor, intenta nuevamente.*');
  }
};

handler.help = ['play2 <búsqueda>'];
handler.tags = ['downloader'];
handler.command = /^play3$/i;
export default handler; 
