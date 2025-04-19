let handler = async (m, { conn }) => {
    const sections = [
        {
            title: "BOLLLOBOT / MELDEXZZ.",
            rows: [
                {title: "Escuadra 1", rowId: "escuadra1", description: "Unirse a Escuadra 1"},
                {title: "Escuadra 2", rowId: "escuadra2", description: "Unirse a Escuadra 2"},
                {title: "Suplente", rowId: "suplente", description: "Unirse como Suplente"},
                {title: "Limpiar lista", rowId: "limpiarlista", description: "Reiniciar todas las listas"}
            ]
        }
    ]

    const listMessage = {
        text: `EliteBot
MODALIDAD: CLK
ROPA: verde

Escuadra 1:
👤 ➢ ➢
👤 ➢ ➢
👤 ➢ ➢
👤 ➢ ➢

Escuadra 2:
👤 ➢ ➢
👤 ➢ ➢
👤 ➢ ➢
👤 ➢ ➢

SUPLENTE:
👤 ✓
👤 ✓
👤 ✓

BOLLLOBOT / MELDEXZZ.`,
        footer: "Selecciona una opción:",
        title: null,
        buttonText: "Click Aquí",
        sections
    }

    await conn.sendMessage(m.chat, listMessage)
}

handler.command = ['listaff']
export default handler
