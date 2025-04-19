let handler = async (m, { conn, usedPrefix }) => {
    const listMessage = {
        text: `EliteBot
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

BOLLLOBOT / MELDEXZZ.`,
        footer: "© BOLLLOBOT / MELDEXZZ",
        title: "EliteBot",
        buttonText: "Click Aquí",
        sections: [
            {
                "title": "Selecciona una opción",
                "rows": [
                    {
                        "title": "Escuadra 1",
                        "rowId": `${usedPrefix}escuadra1`
                    },
                    {
                        "title": "Escuadra 2",
                        "rowId": `${usedPrefix}escuadra2`
                    },
                    {
                        "title": "Suplente",
                        "rowId": `${usedPrefix}suplente`
                    },
                    {
                        "title": "Limpiar lista",
                        "rowId": `${usedPrefix}limpiarlista`
                    }
                ]
            }
        ]
    }
    
    await conn.sendMessage(m.chat, listMessage)
}

handler.help = ['listaff']
handler.tags = ['main']
handler.command = /^listaff$/i

export default handler
