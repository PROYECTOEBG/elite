let handler = async (m, { conn }) => {
try {
if (!global.APIs.lolhuman.key) {
throw `*[❗] ERROR: La API key no está configurada. Por favor, configura la variable global.APIs.lolhuman.key.*`
}

let fkontak = { "key": { "participants":"0@s.whatsapp.net", "remoteJid": "status@broadcast", "fromMe": false, "id": "Halo" }, "message": { "contactMessage": { "vcard": `BEGIN:VCARD\nVERSION:3.0\nN:Sy;Bot;;;\nFN:y\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD` }}, "participant": "0@s.whatsapp.net" }
let dir = `https://api.lolhuman.xyz/api/sticker/dadu?apikey=${global.APIs.lolhuman.key}`
await conn.reply(m.chat, `${lenguajeGB['smsAvisoEG']()}𝙋𝙊𝙍 𝙁𝘼𝙑𝙊𝙍 𝙀𝙎𝙋𝙀𝙍𝙀, 𝙎𝙐 𝘿𝘼𝘿𝙊 𝙎𝙀 𝙀𝙎𝙏𝘼 𝘾𝙍𝙀𝘼𝙉𝘿𝙊\n\n𝙋𝙇𝙀𝘼𝙎𝙀 𝙒𝘼𝙄𝙏, 𝙔𝙊𝙐𝙍 𝘿𝙄𝘾𝙀 𝙄𝙎 𝘽𝙀𝙄𝙉𝙂 𝘾𝙍𝙀𝘼𝙏𝙀𝘿`, fkontak, m)
await conn.sendFile(m.chat, dir, 'error.webp', null, m, { asSticker: true })
} catch (e) {
console.error(e)
await conn.reply(m.chat, `*[❗] ERROR: ${e.message || 'Ocurrió un error al generar el dado'}\n\nPor favor, inténtalo de nuevo más tarde.*`, m)
}
}

handler.command = ['dado2', 'dados', 'dadu'] 
export default handler

