let handler = async (m, { conn }) => {
    const buttons = [
        { buttonId: '.escuadra1', buttonText: { displayText: 'Escuadra 1' }, type: 1 },
        { buttonId: '.escuadra2', buttonText: { displayText: 'Escuadra 2' }, type: 1 },
        { buttonId: '.suplente', buttonText: { displayText: 'Suplente' }, type: 1 }
    ]

    const buttonMessage = {
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
        footer: '© BOLLLOBOT / MELDEXZZ',
        buttons: buttons,
        headerType: 1
    }

    try {
        await conn.sendMessage(m.chat, buttonMessage, { quoted: m })
    } catch (e) {
        // Si falla con botones, enviamos como texto simple
        await conn.sendMessage(m.chat, { text: buttonMessage.text }, { quoted: m })
    }
}

handler.help = ['listaff']
handler.tags = ['main']
handler.command = /^listaff$/i

export default handler
