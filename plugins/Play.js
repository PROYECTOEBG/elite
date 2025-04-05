import fetch from 'node-fetch';
import yts from 'yt-search';
import ytdl from 'ytdl-core';
import axios from 'axios';

let handler = async (m, { conn, command, args, text, usedPrefix }) => {
  if (!text) throw `⭐ 𝘐𝘯𝘨𝘳𝘦𝘴𝘢 𝘦𝘭 𝘵𝘪́𝘵𝘶𝘭𝘰 𝘥𝘦 𝘭𝘢 𝘤𝘢𝘯𝘤𝘪ó𝘯 𝘥𝘦 𝘚𝘱𝘰𝘵𝘪𝘧𝘺 𝘲𝘶𝘦 𝘥𝘦𝘴𝘦𝘢𝘴 𝘥𝘦𝘴𝘤𝘢𝘳𝘨𝘢𝘳.`;

  try {
    await m.react('⚡');
    const yt_play = await search(args.join(' '));
    
    if (!yt_play || yt_play.length === 0) {
      throw `No se encontraron resultados para la búsqueda.`;
    }
    
    const videoUrl = yt_play[0].url;
    console.log('Video URL:', videoUrl); // Mostrar URL del video
    
    const info = await ytdl.getInfo(videoUrl); // Obtener detalles del video
    const audioFormat = ytdl.chooseFormat(info.formats, { filter: 'audioonly' });
    
    if (!audioFormat || !audioFormat.url) {
      throw `No se pudo obtener un formato de audio válido.`;
    }
    
    console.log('Audio URL:', audioFormat.url); // Mostrar URL del audio

    await conn.sendMessage(m.chat, { audio: { url: audioFormat.url }, mimetype: 'audio/mpeg' }, { quoted: m });
  } catch (err) {
    console.error('Error al obtener el audio:', err);
    await conn.sendMessage(m.chat, `❌ Error al obtener el audio: ${err.message || err}`);
  }
};

handler.command = ['spotify', 'play8'];
handler.exp = 0;

export default handler;

async function search(query) {
  const search = await yts.search(query);
  return search.videos;
}
