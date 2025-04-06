import yts from 'yt-search'
import ytdl from 'ytdl-core'

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) throw `⭐ 𝘐𝘯𝘨𝘳𝘦𝘴𝘢 𝘦𝘭 𝘵𝘪́𝘵𝘶𝘭𝘰 𝘥𝘦 𝘭𝘢 𝘤𝘢𝘯𝘤𝘪𝘰́𝘯 𝘲𝘶𝘦 𝘥𝘦𝘴𝘦𝘢𝘴 𝘥𝘦𝘴𝘤𝘢𝘳𝘨𝘢𝘳.

» 𝘌𝘫𝘦𝘮𝘱𝘭𝘰:
${usedPrefix + command} Cypher - Rich Vagos`

  await m.react('🎧')

  try {
    const results = await yts(text)
    const video = results.videos[0]
    const url = video.url
    const title = video.title
    const thumbnail = video.thumbnail

    const info = await ytdl.getInfo(url)
    const format = ytdl.chooseFormat(info.formats, { quality: 'highestaudio', filter: 'audioonly' })

    await conn.sendMessage(m.chat, {
      text: `*⌈📀 SPOTIFY PREMIUM 📀⌋*\n01:27 ━━━━━⬤──── 05:48\n*⇄ㅤ   ◁   ❚❚   ▷   ↻*\n${title}`,
      contextInfo: {
        externalAdReply: {
          title,
          body: "Audio descargado desde YouTube",
          thumbnailUrl: thumbnail,
          mediaType: 1,
          renderLargerThumbnail: true,
          showAdAttribution: true,
          sourceUrl: url
        }
      }
    }, { quoted: m })

    await conn.sendMessage(m.chat, {
      audio: { url: format.url },
      mimetype: 'audio/mpeg',
      fileName: `${title}.mp3`
    }, { quoted: m })

  } catch (e) {
    console.error(e)
    m.reply("Ocurrió un error al descargar la canción. Intenta con otro título.")
  }
}

handler.command = ['spotify']
handler.exp = 0
export default handler
