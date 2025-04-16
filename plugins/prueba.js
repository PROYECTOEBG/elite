import FormData from 'form-data'
import axios from 'axios'
import fs from 'fs'
import { promisify } from 'util'
import { join } from 'path'
import { tmpdir } from 'os'

const writeFile = promisify(fs.writeFile)
const readFile = promisify(fs.readFile)

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
  
  try {
    let img = await q.download?.()
    let tempFile = join(tmpdir(), 'image.jpg')
    await writeFile(tempFile, img)

    const form = new FormData()
    form.append('image', fs.createReadStream(tempFile))

    const response = await axios.post('https://api.deepai.org/api/torch-srgan', form, {
      headers: {
        ...form.getHeaders(),
        'api-key': 'quickstart-QUdJIGlzIGNvbWluZy4uLi4K'
      }
    })

    if (response.data && response.data.output_url) {
      const imageResponse = await axios.get(response.data.output_url, { responseType: 'arraybuffer' })
      const buffer = Buffer.from(imageResponse.data)
      await conn.sendFile(m.chat, buffer, 'enhanced.jpg', '🧃 Toma tu foto en HD', m)
    } else {
      throw new Error('No se pudo obtener la imagen procesada')
    }

    // Limpieza del archivo temporal
    fs.unlink(tempFile, (err) => {
      if (err) console.error('Error al eliminar archivo temporal:', err)
    })

  } catch (error) {
    console.error('Error:', error)
    m.reply('*⚠️ PROCESO FALLIDO ⚠️*\nIntenta con otra imagen')
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
