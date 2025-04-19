import { listas } from './listaff.js'

let handler = async (m, { conn, command }) => {
    // Obtener el usuario que envió el comando
    const usuario = m.sender.split('@')[0];
    const tag = m.sender;

    // Determinar qué escuadra basado en el comando
    let squadType, squadName;
    if (command === 'escuadra1') {
        squadType = 'escuadra1';
        squadName = 'Escuadra 1';
    } else if (command === 'escuadra2') {
        squadType = 'escuadra2';
        squadName = 'Escuadra 2';
    } else if (command === 'suplente') {
        squadType = 'suplente';
        squadName = 'Suplente';
    } else if (command === 'limpiarlista') {
        // Reiniciar todas las listas
        Object.assign(listas, {
            escuadra1: ['➢', '➢', '➢', '➢'],
            escuadra2: ['➢', '➢', '➢', '➢'],
            suplente: ['✔', '✔', '✔']
        });
        await conn.sendMessage(m.chat, {
            text: `♻️ Listas reiniciadas por @${usuario}`,
            mentions: [tag]
        });

        // Mostrar lista actualizada
        await mostrarLista(conn, m.chat);
        return;
    }

    // Buscar espacio libre en la escuadra
    const libre = listas[squadType].findIndex(p => p === '➢' || p === '✔');
    
    if (libre !== -1) {
        // Agregar usuario a la escuadra
        listas[squadType][libre] = `@${usuario}`;
        
        // Enviar mensaje de confirmación
        await conn.sendMessage(m.chat, {
            text: `✅ @${usuario} agregado a ${squadName}`,
            mentions: [tag]
        });

        // Mostrar lista actualizada
        await mostrarLista(conn, m.chat);
    } else {
        // Enviar mensaje si la escuadra está llena
        await conn.sendMessage(m.chat, {
            text: `⚠️ ${squadName} está llena`,
            mentions: [tag]
        });
    }
}

async function mostrarLista(conn, chat) {
    const texto = `EliteBot
MODALIDAD: CLK
ROPA: verde

Escuadra 1:
${listas.escuadra1.map(p => `👤 ➢ ${p}`).join('\n')}

Escuadra 2:
${listas.escuadra2.map(p => `👤 ➢ ${p}`).join('\n')}

SUPLENTE:
${listas.suplente.map(p => `👤 ${p}`).join('\n')}

BOLLLOBOT / MELDEXZZ.`;

    const buttons = [
        {
            buttonId: '.escuadra1',
            buttonText: { displayText: 'Escuadra 1' },
            type: 1
        },
        {
            buttonId: '.escuadra2',
            buttonText: { displayText: 'Escuadra 2' },
            type: 1
        },
        {
            buttonId: '.suplente',
            buttonText: { displayText: 'Suplente' },
            type: 1
        },
        {
            buttonId: '.limpiarlista',
            buttonText: { displayText: 'Limpiar lista' },
            type: 1
        }
    ];

    const buttonMessage = {
        text: texto,
        footer: 'Selecciona una opción:',
        buttons: buttons,
        headerType: 1
    };

    await conn.sendMessage(chat, buttonMessage);
}

handler.help = ['escuadra1', 'escuadra2', 'suplente', 'limpiarlista']
handler.tags = ['main']
handler.command = /^(escuadra1|escuadra2|suplente|limpiarlista)$/i

export default handler
