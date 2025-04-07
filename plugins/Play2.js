import { youtubedl, youtubedlv2 } from '@bochilteam/scraper'
import yts from 'yt-search'

let handler = async (m, { conn, command, args, text, usedPrefix }) => {
  let q, v, yt, dl_url, ttl, size, lolhuman, lolh, n, n2, n3, n4, cap, qu, currentQuality
  if (command == 'play8') {   
    try {   
      await m.react('✅')   
      let qu = '480'   
      let q = qu + 'p'   
      let v = yt_play[0].url   
      const yt = await youtubedl(v).catch(async _ => await youtubedlv2(v))   
      const dl_url = await yt.video[q].download()   
      const ttl = await yt.title   
      const size = await yt.video[q].fileSizeH   
      await conn.sendMessage(m.chat, { 
        video: { url: dl_url }, 
        fileName: `${ttl}.mp4`, 
        mimetype: 'video/mp4', 
        caption: '𝙑𝙄𝘿𝙀𝙊 𝘿𝙀𝙎𝘾𝘼𝙍𝘼𝙂𝘼𝘿𝙊 [✅]', 
        thumbnail: await fetch(yt.thumbnail) 
      }, { quoted: m })   
    } catch {      
      try {     
        let mediaa = await ytMp4(yt_play[0].url)   
        await conn.sendMessage(m.chat, { 
          video: { url: mediaa.result }, 
          fileName: 'error.mp4', 
          caption: '𝙑𝙄𝘿𝙀𝙊 𝘿𝙀𝙎𝘾𝘼𝙍𝘼𝙂𝘼𝘿𝙊 [✅]', 
          thumbnail: mediaa.thumb, 
          mimetype: 'video/mp4' 
        }, { quoted: m })        
      } catch {     
        try {   
          let lolhuman = await fetch(`https://api.lolhuman.xyz/api/ytvideo2?apikey=${lolkeysapi}&url=${yt_play[0].url}`)       
          let lolh = await lolhuman.json()   
          let n = lolh.result.title || 'error'   
          let n2 = lolh.result.link   
          let n3 = lolh.result.size   
          let n4 = lolh.result.thumbnail   
          await conn.sendMessage(m.chat, { 
            video: { url: n2 }, 
            fileName: `${n}.mp4`, 
            mimetype: 'video/mp4', 
            caption: '𝙑𝙄𝘿𝙀𝙊 𝘿𝙀𝙎𝘾𝘼𝙍𝘼𝙂𝘼𝘿𝙊 [✅]', 
            thumbnail: await fetch(n4) 
          }, { quoted: m })
        } catch {}
      }
    }
  }
}
handler.command = ['play8']
handler.exp = 0
export default handler

async function ytMp4(url) {
  return new Promise(async(resolve, reject) => {
    ytdl.getInfo(url).then(async(getUrl) => {
      let result = [];
      for (let i = 0; i < getUrl.formats.length; i++) {
        let item = getUrl.formats[i];
        if (item.container == 'mp4' && item.hasVideo == true && item.hasAudio == true) {
          let { qualityLabel, contentLength } = item;
          let bytes = await bytesToSize(contentLength);
          result[i] = { video: item.url, quality: qualityLabel, size: bytes }
        }
      }
      let resultFix = result.filter(x => x.video != undefined && x.size != undefined && x.quality != undefined)
      let tiny = await axios.get(`https://tinyurl.com/api-create.php?url=${resultFix[0].video}`);
      let tinyUrl = tiny.data;
      let title = getUrl.videoDetails.title;
      let thumb = getUrl.player_response.microformat.playerMicroformatRenderer.thumbnail.thumbnails[0].url;
      resolve({ title, result: tinyUrl, rersult2: resultFix[0].video, thumb })
    }).catch(reject)
  })
};
