import pkg from '@whiskeysockets/baileys';
const { generateWAMessageFromContent, proto } = pkg;

// Estado global de las listas
let listas = {
    escuadra1: ['➢', '➢', '➢', '➢'],
    escuadra2: ['➢', '➢', '➢', '➢'],
    suplente: ['✓', '✓', '✓']
};

const handler = async (m, { conn }) => {
    try {
        await enviarLista(conn, m);
    } catch (error) {
        console.error('Error en handler:', error);
        await conn.sendMessage(m.chat, { text: '❌ Ocurrió un error al procesar tu solicitud' });
    }
};

// Función para manejar solicitudes de escuadra
async function handleSquadRequest(conn, m, squadType) {
    const usuario = m.sender.split('@')[0];
    const tag = m.sender;
    const squadName = squadType === 'escuadra1' ? 'Escuadra 1' : squadType === 'escuadra2' ? 'Escuadra 2' : 'Suplente';
    
    const libre = listas[squadType].findIndex(p => p === '➢' || p === '✓');
    
    if (libre !== -1) {
        listas[squadType][libre] = `@${usuario}`;
        // Enviar mensaje con el formato actualizado
        await enviarLista(conn, m, true);
    } else {
        await conn.sendMessage(m.chat, {
            text: `⚠️ ${squadName} está llena`,
            mentions: [tag]
        });
    }
}

// Función para enviar la lista interactiva
async function enviarLista(conn, m, conMencion = false) {
    try {
        const texto = `EliteBot
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

BOLLLOBOT / MELDEXZZ.`;

        // Recopilar todas las menciones
        const mentions = [...listas.escuadra1, ...listas.escuadra2, ...listas.suplente]
            .filter(id => id !== '➢' && id !== '✓')
            .map(id => id.replace('@', '') + '@s.whatsapp.net');

        // Enviar el mensaje con las menciones
        await conn.sendMessage(m.chat, {
            text: texto,
            mentions: mentions
        });

        // Enviar los botones
        const buttons = [
            { buttonId: 'escuadra1', buttonText: { displayText: 'Escuadra 1' }, type: 1 },
            { buttonId: 'escuadra2', buttonText: { displayText: 'Escuadra 2' }, type: 1 },
            { buttonId: 'suplente', buttonText: { displayText: 'Suplente' }, type: 1 },
            { buttonId: 'limpiar', buttonText: { displayText: 'Limpiar lista' }, type: 1 }
        ];

        const buttonMessage = {
            text: 'Selecciona una opción:',
            footer: 'EliteBot',
            buttons: buttons,
            headerType: 1
        };

        await conn.sendMessage(m.chat, buttonMessage);

    } catch (error) {
        console.error('Error en enviarLista:', error);
        throw error;
    }
}

// Manejo de respuestas a botones
export async function after(m, { conn }) {
    try {
        const button = m?.message?.buttonsResponseMessage;
        if (!button) return;

        const id = button.selectedButtonId;
        const numero = m.sender.split('@')[0];
        const tag = m.sender;

        if (id === 'limpiar') {
            listas = {
                escuadra1: ['➢', '➢', '➢', '➢'],
                escuadra2: ['➢', '➢', '➢', '➢'],
                suplente: ['✓', '✓', '✓']
            };
            await conn.sendMessage(m.chat, {
                text: `♻️ Listas reiniciadas por @${numero}`,
                mentions: [tag]
            });
            await enviarLista(conn, m);
        } else {
            await handleSquadRequest(conn, m, id);
        }
    } catch (error) {
        console.error('Error en after:', error);
        await conn.sendMessage(m.chat, { text: '❌ Error al procesar tu selección' });
    }
}

handler.command = /^listaff$/i;
export default handler;
