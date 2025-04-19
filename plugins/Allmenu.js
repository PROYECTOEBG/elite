let handler = async (m, { conn, args, usedPrefix, command }) => {
    let text = `
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

BOLLLOBOT / MELDEXZZ.
Selecciona una opción:`

    const buttons = [
        ['Escuadra 1', '.escuadra1'],
        ['Escuadra 2', '.escuadra2'],
        ['Suplente', '.suplente'],
        ['Limpiar lista', '.limpiarlista']
    ]

    await conn.sendMessage(m.chat, { 
        text: text,
        footer: 'EliteBot',
        buttons: buttons.map(([text, command]) => ({
            buttonText: { displayText: text },
            buttonId: command,
            type: 1
        })),
        headerType: 1
    }, { quoted: m })
}

handler.help = ['listaff']
handler.tags = ['main']
handler.command = /^(listaff)$/i

export default handler 
