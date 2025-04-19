let handler = async (m, { conn, text, usedPrefix, command }) => {
    let fkontak = { "key": { "participants":"0@s.whatsapp.net", "remoteJid": "status@broadcast", "fromMe": false, "id": "Halo" }, "message": { "contactMessage": { "vcard": `BEGIN:VCARD\nVERSION:3.0\nN:Sy;Bot;;;\nFN:y\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD` }}, "participant": "0@s.whatsapp.net" }
    
    let str = `
EliteBot
MODALIDAD: CLK
ROPA: verde

Escuadra 1:
👤 ➤
👤 ➤
👤 ➤
👤 ➤

Escuadra 2:
👤 ➤
👤 ➤
👤 ➤
👤 ➤

SUPLENTE:
👤
👤
👤

BOLLLOBOT / MELDEXZZ.`

    const sections = [
        {
            title: 'SELECCIONA UNA OPCIÓN',
            rows: [
                {title: "Escuadra 1", description: "Seleccionar Escuadra 1", rowId: `${usedPrefix}escuadra1`},
                {title: "Escuadra 2", description: "Seleccionar Escuadra 2", rowId: `${usedPrefix}escuadra2`},
                {title: "Suplente", description: "Seleccionar Suplente", rowId: `${usedPrefix}suplente`},
                {title: "Limpiar lista", description: "Limpiar todas las listas", rowId: `${usedPrefix}limpiarlista`}
            ]
        }
    ]

    const listMessage = {
        text: str,
        footer: 'EliteBot',
        title: null,
        buttonText: "Selecciona una opción",
        sections
    }

    await conn.sendMessage(m.chat, listMessage, { quoted: fkontak })
}

handler.help = ['listaff']
handler.tags = ['main']
handler.command = /^listaff$/i

export default handler
