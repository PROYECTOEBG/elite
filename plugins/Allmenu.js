let handler = async (m, { conn }) => {
    const message = {
        text: `EliteBot
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

BOLLLOBOT / MELDEXZZ.`,
        footer: "Selecciona una opción:",
        buttons: [
            {buttonId: '.escuadra1', buttonText: {displayText: 'Escuadra 1'}, type: 1},
            {buttonId: '.escuadra2', buttonText: {displayText: 'Escuadra 2'}, type: 1},
            {buttonId: '.suplente', buttonText: {displayText: 'Suplente'}, type: 1},
            {buttonId: '.limpiarlista', buttonText: {displayText: 'Limpiar lista'}, type: 1}
        ],
        headerType: 1
    }
    
    try {
        await conn.sendMessage(m.chat, message)
    } catch (e) {
        console.error(e)
        await m.reply('Error al enviar el mensaje')
    }
}

handler.help = ['listaff']
handler.tags = ['main']
handler.command = /^listaff$/i

export default handler
