let handler = async (m, { conn }) => {
    let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender
    let name = await conn.getName(who)

    let str = `EliteBot
MODALIDAD: CLK
ROPA: verde

Escuadra 1:
👤 ➢ 
👤 ➢ 
👤 ➢ 
👤 ➢ 

Escuadra 2:
👤 ➢ 
👤 ➢ 
👤 ➢ 
👤 ➢ 

SUPLENTE:
👤 ✓ 
👤 ✓ 
👤 ✓ 

BOLLLOBOT / MELDEXZZ.`

    const sections = [
        {
            title: `Lista de Opciones`,
            rows: [
                {title: "Escuadra 1", rowId: ".escuadra1"},
                {title: "Escuadra 2", rowId: ".escuadra2"},
                {title: "Suplente", rowId: ".suplente"},
                {title: "Limpiar lista", rowId: ".limpiarlista"}
            ]
        }
    ]

    const listMessage = {
        text: str,
        footer: "Selecciona una opción:",
        title: null,
        buttonText: "Click Aquí",
        sections
    }

    await conn.sendMessage(m.chat, listMessage)
}

handler.help = ['listaff']
handler.tags = ['main']
handler.command = /^listaff$/i

export default handler
