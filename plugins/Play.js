import fetch from "node-fetch";
import yts from "yt-search";
import ytdl from 'ytdl-core';
import axios from 'axios';

let handler = async (m, { conn, command, args, text, usedPrefix }) => {
  let q, v, yt, dl_url, ttl, size, n, n2, n3, n4, cap, qu, currentQuality;

  if (!text) throw `⭐ 𝘐𝘯𝘨𝘳𝘦𝘴𝘢 𝘦𝘭 𝘵𝘪́𝘵𝘶𝘭𝘰 𝘥𝘦 𝘭𝘢 𝘤𝘢𝘯𝘤𝘪ó𝘯 𝘥𝘦 𝘚𝘱𝘰𝘵𝘪𝘧𝘺 𝘲𝘶𝘦 𝘥𝘦𝘴𝘦𝘢𝘴 𝘥𝘦𝘴𝘤𝘢𝘳𝘨𝘢𝘳.
  
  » 𝘌𝘫𝘦𝘮𝘱𝘭𝘰: ${usedPrefix + command} Cypher - Rich vagos

  try {
    await m.react('⚡');
    const yt_play = await search(args.join(" "));
    let additionalText = '';
    if (command === 'spotify') {
      additionalText = '';
    } else if (command === 'play8') {
      additionalText = 'video 🎥';
    }
    
    await conn.sendMessage(m.chat, {
      text: `⌈📀 SPOTIFY PREMIUM 📀⌋ 01:27 ━━━━━⬤──── 05:48 ⇄ㅤ   ◁   ㅤ  ❚❚ㅤ     ▷ㅤ   ↻ 𝙀𝙡𝙞𝙩𝙚 𝘽𝙤𝙩 𝙂𝙡𝙤𝙗𝙖𝙡, 
      contextInfo: {
        externalAdReply: {
          title: yt_play[0].title,
          body: 'wm',
          thumbnailUrl: yt_play[0].thumbnail,
          mediaType: 1,
          showAdAttribution: true,
          renderLargerThumbnail: true
        }
      }
    }, { quoted: m });

    if (command == 'spotify') {
      try {
        await m.react('💯');
        const q = '128kbps';
        const v = yt_play[0].url;
        
        // Intentar obtener el formato de audio
        const audioFormats = ytdl.getInfo(v).then(info => {
          // Filtramos para obtener un formato de audio
          const audioFormat = ytdl.chooseFormat(info.formats, { filter: 'audioonly' });
          if (audioFormat && audioFormat.url) {
            return audioFormat.url;
          } else {
            throw new Error("No se pudo obtener un formato de audio válido.");
          }
        });
        
        const dl_url = await audioFormats;
        
        // Mandamos el audio como archivo
        await conn.sendMessage(m.chat, { audio: { url: dl_url }, mimetype: 'audio/mpeg' }, { quoted: m });
      } catch (err) {
        console.error('Error al enviar el audio de Spotify:', err);
        // Puedes intentar otras APIs o manejar el fallo
      }
    }

    if (command == 'play8') {
      try {
        await m.react('✅');
        const qu = '480';
        const q = qu + 'p';
        const v = yt_play[0].url;
        
        // Intentar obtener el formato de video
        const videoFormats = ytdl.getInfo(v).then(info => {
          const videoFormat = ytdl.chooseFormat(info.formats, { filter: 'videoandaudio' });
          if (videoFormat && videoFormat.url) {
            return videoFormat.url;
          } else {
            throw new Error("No se pudo obtener un formato de video válido.");
          }
        });
        
        const dl_url = await videoFormats;
        
        // Mandamos el video
        await conn.sendMessage(m.chat, {
          video: { url: dl_url },
          fileName: `${yt_play[0].title}.mp4`,
          mimetype: 'video/mp4',
          caption: '𝙑𝙄𝘿𝙀𝙊 𝘿𝙀𝙎𝘾𝘼𝙍𝘼𝙂𝘼𝘿𝙊 [✅]',
          thumbnail: yt_play[0].thumbnail
        }, { quoted: m });
      } catch (err) {
        console.error('Error al enviar el video de play8:', err);
      }
    }

  } catch (err) {
    console.error('Error general en el manejo de comando', err);
  }
};

handler.command = ['spotify', 'play8'];
handler.exp = 0;
export default handler;

async function search(query, options = {}) {
  const search = await yts.search({ query, hl: "es", gl: "ES", ...options });
  return search.videos;
}
