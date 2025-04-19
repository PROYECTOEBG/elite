let handler = async (m, { conn, command, text }) => {
    // Obtener el usuario que envió el comando
    const usuario = m.sender.split('@')[0]
    const tag = m.sender

    // Variables globales para las listas
    global.escuadra1 = global.escuadra1 || ['➢ ➢', '➢ ➢', '➢ ➢', '➢ ➢']
    global.escuadra2 = global.escuadra2 || ['➢ ➢', '➢ ➢', '➢ ➢', '➢ ➢']
    global.suplente = global.suplente || ['✓', '✓', '✓']

    // Función para mostrar la lista actualizada
    const mostrarLista = async () => {
        const listMessage = {
            text: `EliteBot
MODALIDAD: CLK
ROPA: verde

Escuadra 1:
👤 ${escuadra1[0]}
👤 ${escuadra1[1]}
👤 ${escuadra1[2]}
👤 ${escuadra1[3]}

Escuadra 2:
👤 ${escuadra2[0]}
👤 ${escuadra2[1]}
👤 ${escuadra2[2]}
👤 ${escuadra2[3]}

SUPLENTE:
👤 ${suplente[0]}
👤 ${suplente[1]}
👤 ${suplente[2]}

BOLLLOBOT / MELDEXZZ.`,
            footer: "Selecciona una opción:",
            title: null,
            buttonText: "Click Aquí",
            sections: [{
                title: "BOLLLOBOT / MELDEXZZ.",
                rows: [
                    {title: "Escuadra 1", rowId: "escuadra1"},
                    {title: "Escuadra 2", rowId: "escuadra2"},
                    {title: "Suplente", rowId: "suplente"},
                    {title: "Limpiar lista", rowId: "limpiarlista"}
                ]
            }]
        }

        await conn.sendMessage(m.chat, listMessage)
    }

    // Manejar comandos
    if (command === 'escuadra1') {
        let libre = escuadra1.findIndex(p => p === '➢ ➢')
        if (libre !== -1) {
            escuadra1[libre] = `@${usuario}`
            await conn.sendMessage(m.chat, { 
                text: `✅ @${usuario} agregado a Escuadra 1`, 
                mentions: [tag] 
            })
            await mostrarLista()
        } else {
            await conn.sendMessage(m.chat, { 
                text: `⚠️ Escuadra 1 está llena`, 
                mentions: [tag] 
            })
        }
    } else if (command === 'escuadra2') {
        let libre = escuadra2.findIndex(p => p === '➢ ➢')
        if (libre !== -1) {
            escuadra2[libre] = `@${usuario}`
            await conn.sendMessage(m.chat, { 
                text: `✅ @${usuario} agregado a Escuadra 2`, 
                mentions: [tag] 
            })
            await mostrarLista()
        } else {
            await conn.sendMessage(m.chat, { 
                text: `⚠️ Escuadra 2 está llena`, 
                mentions: [tag] 
            })
        }
    } else if (command === 'suplente') {
        let libre = suplente.findIndex(p => p === '✓')
        if (libre !== -1) {
            suplente[libre] = `@${usuario}`
            await conn.sendMessage(m.chat, { 
                text: `✅ @${usuario} agregado a Suplente`, 
                mentions: [tag] 
            })
            await mostrarLista()
        } else {
            await conn.sendMessage(m.chat, { 
                text: `⚠️ Lista de suplentes llena`, 
                mentions: [tag] 
            })
        }
    } else if (command === 'limpiarlista') {
        global.escuadra1 = ['➢ ➢', '➢ ➢', '➢ ➢', '➢ ➢']
        global.escuadra2 = ['➢ ➢', '➢ ➢', '➢ ➢', '➢ ➢']
        global.suplente = ['✓', '✓', '✓']
        await conn.sendMessage(m.chat, { 
            text: `♻️ Listas reiniciadas por @${usuario}`, 
            mentions: [tag] 
        })
        await mostrarLista()
    }
}

handler.command = ['escuadra1', 'escuadra2', 'suplente', 'limpiarlista']
export default handler
