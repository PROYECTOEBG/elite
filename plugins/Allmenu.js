let handler = async (m, { conn }) => {
    let listas = {
        escuadra1: ['➢', '➢', '➢', '➢'],
        escuadra2: ['➢', '➢', '➢', '➢'],
        suplente: ['✓', '✓', '✓']
    }

    let texto = `EliteBot
MODALIDAD: CLK
ROPA: verde

Escuadra 1:
👤 ➢ ${listas.escuadra1[0]}
👤 ➢ ${listas.escuadra1[1]}
👤 ➢ ${listas.escuadra1[2]}
👤 ➢ ${listas.escuadra1[3]}

Escuadra 2:
👤 ➢ ${listas.escuadra2[0]}
👤 ➢ ${listas.escuadra2[1]}
👤 ➢ ${listas.escuadra2[2]}
👤 ➢ ${listas.escuadra2[3]}

SUPLENTE:
👤 ${listas.suplente[0]}
👤 ${listas.suplente[1]}
👤 ${listas.suplente[2]}

BOLLLOBOT / MELDEXZZ.`

    const buttons = [
        ['Escuadra 1', '.escuadra1'],
        ['Escuadra 2', '.escuadra2'],
        ['Suplente', '.suplente'],
        ['Limpiar lista', '.limpiarlista']
    ]

    await conn.sendButton(m.chat, texto, 'Selecciona una opción:', buttons, m)
}

handler.help = ['listaff']
handler.tags = ['main']
handler.command = /^listaff$/i

export default handler
