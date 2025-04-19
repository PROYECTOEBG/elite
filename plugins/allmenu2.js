let escuadras = {
    escuadra1: [],
    escuadra2: [],
    suplente: []
}

let handler = async (m, { conn, args, usedPrefix, command }) => {
    let user = m.mentionedJid ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : args[0] ? args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net' : m.sender
    let name = await conn.getName(user)

    switch (command) {
        case 'escuadra1':
            if (escuadras.escuadra1.length >= 4) return m.reply('❌ Escuadra 1 está llena')
            if (escuadras.escuadra1.includes(user) || escuadras.escuadra2.includes(user) || escuadras.suplente.includes(user))
                return m.reply('❌ El usuario ya está en una escuadra')
            escuadras.escuadra1.push(user)
            await actualizarLista(conn, m)
            break

        case 'escuadra2':
            if (escuadras.escuadra2.length >= 4) return m.reply('❌ Escuadra 2 está llena')
            if (escuadras.escuadra1.includes(user) || escuadras.escuadra2.includes(user) || escuadras.suplente.includes(user))
                return m.reply('❌ El usuario ya está en una escuadra')
            escuadras.escuadra2.push(user)
            await actualizarLista(conn, m)
            break

        case 'suplente':
            if (escuadras.suplente.length >= 3) return m.reply('❌ Lista de suplentes llena')
            if (escuadras.escuadra1.includes(user) || escuadras.escuadra2.includes(user) || escuadras.suplente.includes(user))
                return m.reply('❌ El usuario ya está en una escuadra')
            escuadras.suplente.push(user)
            await actualizarLista(conn, m)
            break

        case 'limpiarlista':
            escuadras.escuadra1 = []
            escuadras.escuadra2 = []
            escuadras.suplente = []
            await actualizarLista(conn, m)
            break
    }
}

async function actualizarLista(conn, m) {
    let text = `
EliteBot
MODALIDAD: CLK
ROPA: verde

Escuadra 1:
${escuadras.escuadra1.map(id => `👤 ➤ @${id.split('@')[0]}`).join('\n') || '👤 ➤\n👤 ➤\n👤 ➤\n👤 ➤'}

Escuadra 2:
${escuadras.escuadra2.map(id => `👤 ➤ @${id.split('@')[0]}`).join('\n') || '👤 ➤\n👤 ➤\n👤 ➤\n👤 ➤'}

SUPLENTE:
${escuadras.suplente.map(id => `👤 @${id.split('@')[0]}`).join('\n') || '👤\n👤\n👤'}

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
        headerType: 1,
        mentions: [...escuadras.escuadra1, ...escuadras.escuadra2, ...escuadras.suplente]
    }, { quoted: m })
}

handler.help = ['escuadra1', 'escuadra2', 'suplente', 'limpiarlista']
handler.tags = ['main']
handler.command = /^(escuadra1|escuadra2|suplente|limpiarlista)$/i

export default handler 
