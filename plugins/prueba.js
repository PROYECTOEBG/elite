import fetch from 'node-fetch'

let handler = async (m, { conn }) => {
    try {
        const q = m.quoted || m
        const mime = (q.msg || q).mimetype || q.mediaType || ''
        
        if (!mime) throw '*⚠️ RESPONDE A UNA IMAGEN*'
        if (!/image\/(jpe?g|png)/.test(mime)) throw '*⚠️ SOLO IMÁGENES JPG O PNG*'
        
        m.reply('*🚀 PROCESANDO IMAGEN, ESPERE UN MOMENTO...*')
        
        const img = await q.download()
        const form = new FormData()
        form.append('file', img, 'image.jpg')
        
        const response = await fetch('https://api.dorratz.com/main/enhance', {
            method: 'POST',
            body: form
        })
        
        if (!response.ok) throw '*⚠️ ERROR AL PROCESAR LA IMAGEN*'
        
        const imageBuffer = await response.buffer()
        await conn.sendFile(m.chat, imageBuffer, 'HD.jpg', '*✅ IMAGEN MEJORADA CON ÉXITO*', m)
        
    } catch (e) {
        console.error(e)
        m.reply('*⚠️ OCURRIÓ UN ERROR, INTENTA CON OTRA IMAGEN*')
    }
}

handler.help = ['hd']
handler.tags = ['tools']
handler.command = /^(hd2|enhance)$/i

export default handler
