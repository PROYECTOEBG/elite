let handler = async (m, { conn }) => {
    if (m.text.toLowerCase() !== 'escuadra 1') return
    
    let mensaje = `Tú
Escuadra 1

MODALIDAD: CLK
ROPA: verde

Escuadra 1:
➡️ ➢ @${m.sender.split('@')[0]}
➡️ ➢
➡️ ➢
➡️ ➢

Escuadra 2:
➡️ ➢
➡️ ➢
➡️ ➢
➡️ ➢

SUPLENTE:
➡️ ✓
➡️ ✓
➡️ ✓

BOLLLLOBOT / MELDEXZZ.`

    m.reply(mensaje)
}

handler.customPrefix = /^escuadra 1$/i
handler.command = new RegExp
handler.group = true

export default handler
