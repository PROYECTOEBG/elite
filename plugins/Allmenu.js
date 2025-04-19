const { default: makeWASocket, proto, generateWAMessageFromContent, prepareWAMessageMedia, generateWAMessageContent } = require('@whiskeysockets/baileys');

let lista = {
    escuadra1: [],
    escuadra2: [],
    suplentes: [],
};

function generarMensajeLista() {
    return `
*╭───「 LISTA DE ESCUADRAS 」───╮*

*➤ ESCUADRA 1:*
${formatearLista(lista.escuadra1)}

*➤ ESCUADRA 2:*
${formatearLista(lista.escuadra2)}

*➤ SUPLENTES:*
${formatearLista(lista.suplentes)}

*╰────── BY ELITEBOT ──────╯*
`;
}

function formatearLista(arr) {
    if (arr.length === 0) return '〃 Vacío';
    return arr.map((u, i) => `${i + 1}. @${u.split('@')[0]}`).join('\n');
}

async function enviarLista(sock, jid) {
    const texto = generarMensajeLista();

    const buttons = [
        { buttonId: 'escuadra1', buttonText: { displayText: '↶ Escuadra 1' }, type: 1 },
        { buttonId: 'escuadra2', buttonText: { displayText: '↶ Escuadra 2' }, type: 1 },
        { buttonId: 'suplente', buttonText: { displayText: '↶ Suplente' }, type: 1 },
        { buttonId: 'limpiar', buttonText: { displayText: '↺ Limpiar lista' }, type: 1 },
    ];

    const buttonMessage = {
        text: texto,
        footer: 'Selecciona una opción:',
        buttons: buttons,
        headerType: 1
    };

    await sock.sendMessage(jid, buttonMessage);
}

module.exports = {
    command: ['listaff'],
    handler: async (m, { sock }) => {
        await enviarLista(sock, m.chat);
    }
}
