import fetch from "node-fetch"
import yts from "yt-search"
import ytdl from 'ytdl-core'
import axios from 'axios'
import { youtubedl, youtubedlv2 } from '@bochilteam/scraper'

let handler = async (m, { conn, command, args, text, usedPrefix }) => {
  if (!text) throw `⭐ 𝘐𝘯𝘨𝘳𝘦𝘴𝘢 𝘦𝘭 𝘵𝘪́𝘵𝘶𝘭𝘰 𝘥𝘦 𝘭𝘢 𝘤𝘢𝘯𝘤𝘪𝘰́𝘯 𝘥𝘦 𝘚𝘱𝘰𝘵𝘪𝘧𝘺 𝘲𝘶𝘦 𝘥𝘦𝘴𝘦𝘢𝘴 𝘥𝘦𝘴𝘤𝘢𝘳𝘨𝘢𝘳.

» 𝘌𝘫𝘦𝘮𝘱𝘭𝘰:
${usedPrefix + command} Cypher - Rich vagos`

  try {
    await m.react('⚡')
    const yt_play = await search(args.join(" "))

    await conn.sendMessage(m.chat, {
      text: `*⌈📀 SPOTIFY PREMIUM 📀⌋*
01:27 ━━━━━⬤──── 05:48
*⇄ㅤ   ◁   ㅤ  ❚❚ㅤ     ▷ㅤ   ↻*
𝙀𝙡𝙞𝙩𝙚 𝘽𝙤𝙩 𝙂𝙡𝙤𝙗𝙖𝙡`,
      contextInfo: {
        externalAdReply: {
          title: yt_play[0].title,
          body: '',
          thumbnailUrl: yt_play[0].thumbnail,
          mediaType: 1,
          showAdAttribution: true,
          renderLargerThumbnail: true
        }
      }
    }, { quoted: m })

    await m.react('💯')
    let q = '128kbps'
    let v = yt_play[0].url

    try {
      const yt = await youtubedl(v).catch(async _ => await youtubedlv2(v))
      const dl_url = await yt.audio[q].download()
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
            await conn.sendMessage(m.chat, { audio: { url: lolh.result.link }, mimetype: 'audio/mpeg' }, { quoted: m })
          } catch {
            try {
              let searchh = await yts(yt_play[0].url)
              let __res = searchh.all.map(v => v).filter(v => v.type == "video")
              let infoo = await ytdl.getInfo('https://youtu.be/' + __res[0].videoId)
              let ress = await ytdl.chooseFormat(infoo.formats, { filter: 'audioonly' })
              await conn.sendMessage(m.chat, { audio: { url: ress.url }, mimetype: 'audio/mpeg' }, { quoted: m })
            } catch { }
          }
        }
      }
    }
  } catch (e) {
    console.error(e)
    m.reply('Ocurrió un error al intentar descargar la canción.')
  }
}

handler.command = ['spotify']
handler.exp = 0
export default handler

async function search(query, options = {}) {
  const search = await yts.search({ query, hl: "es", gl: "ES", ...options });
  return search.videos;
}
