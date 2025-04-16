import fetch from 'node-fetch'
import yts from 'yt-search'
import ytdl from 'ytdl-core'
import { youtubedl, youtubedlv2, youtubedlv3 } from '@bochilteam/scraper'

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) throw `*[❗] Ingrese el nombre de la canción que desea reproducir*\n\n*Ejemplo:*\n*${usedPrefix + command}* Lil Peep - Save That Shit`
  
  try {
    let search = await yts(text)
    let vid = search.videos[0]
    if (!vid) throw '[❗] No se encontraron resultados'
    
    let { title, thumbnail, url, timestamp, views, ago } = vid
    let ytlink = url
    let ytplay = await youtubedl(ytlink).catch(async () => await youtubedlv2(ytlink)).catch(async () => await youtubedlv3(ytlink))
    let link = await ytplay.audio['128kbps'].download()
    
    let info = `*🎵 Título:* ${title}
*⏳ Duración:* ${timestamp}
*👀 Vistas:* ${views}
*📅 Publicado:* ${ago}
*🔗 URL:* ${url}`
    
    conn.sendMessage(m.chat, { 
      audio: { url: link }, 
      mimetype: 'audio/mpeg', 
      contextInfo: {
        externalAdReply: {
          title: title,
          body: '🎵 Reproduciendo...',
          thumbnail: thumbnail,
          sourceUrl: ytlink
        }
      }
    }, { quoted: m })
    
    m.reply(info)
  } catch (e) {
    throw '[❗] Error, no se pudo reproducir la canción'
  }
}

handler.help = ['play2']
handler.tags = ['downloader']
handler.command = ['play3', 'play2']
handler.register = false
export default handler 
