import pkg from '@whiskeysockets/baileys';
const { generateWAMessageFromContent, proto } = pkg;

let listas = {
    escuadra1: ['➢', '➢', '➢', '➢'],
    escuadra2: ['➢', '➢', '➢', '➢'],
    suplente: ['✓', '✓', '✓']
};

const handler = async (m, { conn }) => {
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

        const mentions = [...listas.escuadra1, ...listas.escuadra2, ...listas.suplente]
            .filter(id => id !== '➢' && id !== '✓')
            .map(id => id.replace('@', '') + '@s.whatsapp.net');

        const templateButtons = [
            {index: 1, urlButton: {displayText: 'Escuadra 1', url: 'escuadra1'}},
            {index: 2, urlButton: {displayText: 'Escuadra 2', url: 'escuadra2'}},
            {index: 3, quickReplyButton: {displayText: 'Suplente', id: 'suplente'}},
            {index: 4, quickReplyButton: {displayText: 'Limpiar lista', id: 'limpiar'}}
        ];

        const templateMessage = {
            text: texto,
            footer: 'Selecciona una opción:',
            templateButtons: templateButtons,
            mentions: mentions
        };

        await conn.sendMessage(m.chat, templateMessage);

    } catch (error) {
        console.error('Error:', error);
        await m.reply('❌ Error al mostrar la lista');
    }
};

async function handleSquadRequest(conn, m, squadType) {
    const usuario = m.sender.split('@')[0];
    const tag = m.sender;
    const squadName = squadType === 'escuadra1' ? 'Escuadra 1' : squadType === 'escuadra2' ? 'Escuadra 2' : 'Suplente';
    
    const libre = listas[squadType].findIndex(p => p === '➢' || p === '✓');
    
    if (libre !== -1) {
        listas[squadType][libre] = `@${usuario}`;
        await handler(m, { conn });
    } else {
        await conn.sendMessage(m.chat, {
            text: `⚠️ ${squadName} está llena`,
            mentions: [tag]
        });
    }
}

export async function after(m, { conn }) {
    if (!m.message) return;
    
    const button = m?.message?.templateButtonReplyMessage || m?.message?.buttonsResponseMessage;
    if (!button) return;

    const id = button.selectedId || button.selectedButtonId;
    if (!id) return;

    const numero = m.sender.split('@')[0];
    const tag = m.sender;

    try {
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
            await handler(m, { conn });
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
