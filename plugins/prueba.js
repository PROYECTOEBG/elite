import FormData from 'form-data'
import fetch from 'node-fetch'
import { Readable } from 'stream'

var handler = async (m, { conn, usedPrefix, command }) => {
  conn.hdr = conn.hdr ? conn.hdr : {}
  if (m.sender in conn.hdr)
    throw '*⚠️ TODAVÍA HAY UN PROCESO QUE NO SE HA TERMINADO. ESPERE A QUE TERMINE*'
  
  let q = m.quoted ? m.quoted : m
  let mime = (q.msg || q).mimetype || q.mediaType || ""
  if (!mime)
    throw `*⚠️ RESPONDE A UNA FOTO*`
  if (!/image\/(jpe?g|png)/.test(mime))
    throw `⚠️ *Formato ${mime} no soportado*`
  else conn.hdr[m.sender] = true
  
  m.reply('*🚀 P R O C E S A N D O*')
  let img = await q.download?.()
  
  try {
    const response = await fetch("https://api.replicate.com/v1/predictions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Token REPLICATE_API_TOKEN", // Reemplazar con tu token
      },
      body: JSON.stringify({
        version: "9283608cc6b7be6b65a8e44983db012355fde4132009bf99d976b2f0896856a3",
        input: {
          image: img.toString('base64')
        }
      })
    })
    
    const result = await response.json()
    if (result.output) {
      const imageResponse = await fetch(result.output)
      const imageBuffer = await imageResponse.buffer()
      conn.sendFile(m.chat, imageBuffer, 'enhanced.jpg', '🧃 Toma tu foto en HD', m)
    } else {
      throw new Error('No se pudo procesar la imagen')
    }
  } catch (err) {
    console.error(err)
    m.reply('*⚠️ PROCESO FALLIDO ⚠️*')
  } finally {
    delete conn.hdr[m.sender]
  }
}

handler.help = ['hd']
handler.tags = ['ai']
handler.command = /^(hd2)$/i
handler.register = false
handler.limit = false

export default handler
