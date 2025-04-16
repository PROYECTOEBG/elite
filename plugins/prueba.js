
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
    
    // Convertir la imagen a base64
    let base64Image = Buffer.from(img).toString('base64')
    
    // Hacer la petición a la API de Dorratz
    let res = await fetch('https://api.dorratz.com/tools/text2img', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        text: 'enhance this image',
        image: base64Image
      })
    })

    if (!res.ok) throw 'Error en la petición a la API'
    
    let buffer = await res.buffer()
    await conn.sendFile(m.chat, buffer, 'enhanced.jpg', '🧃 Toma tu foto en HD', m)
    
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
