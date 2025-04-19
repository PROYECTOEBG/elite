let handler = async (m, { conn }) => {
    const sections = [
        {
            title: "BOLLLOBOT / MELDEXZZ.",
            rows: [
                {title: "Escuadra 1", rowId: ".escuadra1", description: "Seleccionar Escuadra 1"},
                {title: "Escuadra 2", rowId: ".escuadra2", description: "Seleccionar Escuadra 2"},
                {title: "Suplente", rowId: ".suplente", description: "Seleccionar Suplente"},
                {title: "Limpiar lista", rowId: ".limpiarlista", description: "Limpiar todas las listas"}
            ]
        }
    ]

    const listMessage = {
        text: `
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

BOLLLOBOT / MELDEXZZ.`,
        footer: "Selecciona una opción:",
        title: "EliteBot",
        buttonText: "Seleccionar Opción",
        sections
    }

    await conn.sendMessage(m.chat, listMessage)
}

handler.command = ['listaff']
handler.tags = ['main']

export default handler
