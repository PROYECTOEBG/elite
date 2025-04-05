import fetch from "node-fetch"
import yts from "yt-search"
import ytdl from 'ytdl-core'
import axios from 'axios'
import { youtubedl, youtubedlv2 } from '@bochilteam/scraper'

const MAX_SIZE_MB = 100

let handler = async (m, { conn, command, args, text, usedPrefix }) => {
  let q, v, yt, dl_url, ttl, size, lolhuman, lolh, n, n2, n3, n4, cap, qu, currentQuality
  if (!text) throw `⭐ 𝘐𝘯𝘨𝘳𝘦𝘴𝘢 𝘦𝘭 𝘵𝘪́𝘵𝘶𝘭𝘰 𝘥𝘦 𝘭𝘢 𝘤𝘢𝘯𝘤𝘪𝘰́𝘯 𝘥𝘦 𝘚𝘱𝘰𝘵𝘪𝘧𝘺 𝘲𝘶𝘦 𝘥𝘦𝘴𝘦𝘢𝘴 𝘥𝘦𝘴𝘤𝘢𝘳𝘨𝘢𝘳.

  try {
    await m.react('⚡')
    const yt_play = await search(args.join(" "))
    let additionalText = ''
    if (command === 'spotify') {
      additionalText = ''
    } else if (command === 'play8') {
      additionalText = 'video 🎥'
    }

    await conn.sendMessage(m.chat, {
      text: `*⌈📀 SPOTIFY`, 
      contextInfo: {
        externalAdReply: {
          title: yt_play[0].title,
          body: wm,
          thumbnailUrl: yt_play[0].thumbnail, 
          mediaType: 1,
          showAdAttribution: true,
          renderLargerThumbnail: true
        }
      }
    }, { quoted: m })

    if (command == 'spotify') {	
      try {
        await m.react('💯')
        let q = '128kbps'
        let v = yt_play[0].url
        const yt = await youtubedl(v).catch(async _ => await youtubedlv2(v))
        const dl_url = await yt.audio[q].download()
        const ttl = await yt.title
        const size = await yt.audio[q].fileSizeH
        await conn.sendMessage(m.chat, { audio: { url: dl_url }, mimetype: 'audio/mpeg' }, { quoted: m })
      } catch {
        try {
          const dataRE = await fetch(`https://api.akuari.my.id/downloader/youtube?link=${yt_play[0].url}`)
          const dataRET = await dataRE.json()
          await conn.sendMessage(m.chat, { audio: { url: dataRET.mp3[1].url }, mimetype: 'audio/mpeg' }, { quoted: m })
        } catch {
          try {
            let humanLol = await fetch(`https://api.lolhuman.xyz/api/ytplay?apikey=${lolkeysapi}&query=${yt_play[0].title}`)
            let humanRET = await humanLol.json()
            await conn.sendMessage(m.chat, { audio: { url: humanRET.result.audio.link }, mimetype: 'audio/mpeg' }, { quoted: m })
          } catch {     
            try {
              let lolhuman = await fetch(`https://api.lolhuman.xyz/api/ytaudio2?apikey=${lolkeysapi}&url=${yt_play[0].url}`)    
              let lolh = await lolhuman.json()
              let n = lolh.result.title || 'error'
              await conn.sendMessage(m.chat, { audio: { url: lolh.result.link }, mimetype: 'audio/mpeg' }, { quoted: m })
            } catch {   
              try {
                let searchh = await yts(yt_play[0].url)
                let __res = searchh.all.map(v => v).filter(v => v.type == "video")
                let infoo = await ytdl.getInfo('https://youtu.be/' + __res[0].videoId)
                let ress = await ytdl.chooseFormat(infoo.formats, { filter: 'audioonly' })
                await conn.sendMessage(m.chat, { audio: { url: ress.url }, mimetype: 'audio/mpeg' }, { quoted: m })
              } catch {}
            }
          }
        }
      }
    }

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
        await await conn.sendMessage(m.chat, { video: { url: dl_url }, fileName: `${ttl}.mp4`, mimetype: 'video/mp4', caption: `𝙑𝙄𝘿𝙀𝙊 𝘿𝙀𝙎𝘾𝘼𝙍𝘿𝘼𝘿𝙊 [✅] `, thumbnail: await fetch(yt.thumbnail) }, { quoted: m })
      } catch {   
        try {  
          let mediaa = await ytMp4(yt_play[0].url)
          await conn.sendMessage(m.chat, { video: { url: mediaa.result }, fileName: `error.mp4`, caption: `𝙑𝙄𝘿𝙀𝙊 𝘿𝙀𝙎𝘾𝘼𝙍𝘿𝘼𝘿𝙊 [✅] `, thumbnail: mediaa.thumb, mimetype: 'video/mp4' }, { quoted: m })     
        } catch {  
          try {
            let lolhuman = await fetch(`https://api.lolhuman.xyz/api/ytvideo2?apikey=${lolkeysapi}&url=${yt_play[0].url}`)    
            let lolh = await lolhuman.json()
            let n = lolh.result.title || 'error'
            let n2 = lolh.result.link
            let n3 = lolh.result.size
            let n4 = lolh.result.thumbnail
            await conn.sendMessage(m.chat, { video: { url: n2 }, fileName: `${n}.mp4`, mimetype: 'video/mp4', caption: `𝙑𝙄𝘿𝙀𝙊 𝘿𝙀𝙎𝘾𝘼𝙍𝘿𝘼𝘿𝙊 [✅] `, thumbnail: await fetch(n4) }, { quoted: m })
          } catch {}
        }
      }
    }
  } catch (error) {
    return m.reply(`⚠︎ Ocurrió un error: ${error.message}`)
  }
}

async function search(query, options = {}) {
  const search = await yts.search({ query, hl: "es", gl: "ES", ...options });
  return search.videos;
}

async function ytMp4(url) {
  return new Promise(async (resolve, reject) => {
    ytdl.getInfo(url).then(async (getUrl) => {
      let result = [];
      for (let i = 0; i < getUrl.formats.length; i++) {
        let item = getUrl.formats[i];
        if (item.container == 'mp4' && item.hasVideo == true && item.hasAudio == true) {
          let { qualityLabel, contentLength } = item;
          let bytes = await bytesToSize(contentLength);
          result[i] = { video: item.url, quality: qualityLabel, size: bytes };
        }
      }
      let resultFix = result.filter(x => x.video != undefined && x.size != undefined && x.quality != undefined)
      let tiny = await axios.get(`https://tinyurl.com/api-create.php?url=${resultFix[0].video}`);
      let tinyUrl = tiny.data;
      let title = getUrl.videoDetails.title;
      let thumb = getUrl.player_response.microformat.playerMicroformatRenderer.thumbnail.thumbnails[0].url;
      resolve({ title, result: tinyUrl, rersult2: resultFix[0].video, thumb });
    }).catch(reject);
  });
}

async function ytPlay(query) {
  return new Promise((resolve, reject) => {
    yts(query).then(async (getData) => {
      let result = getData.videos.slice(0, 5);
      let url = [];
      for (let i = 0; i <
