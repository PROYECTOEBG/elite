const lista = {
    escuadra1: [],
    escuadra2: [],
    suplentes: [],
};

function formatearLista(arr) {
    if (arr.length === 0) return '〃 Vacío';
    return arr.map((u, i) => `${i + 1}. @${u.split('@')[0]}`).join('\n');
}

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

module.exports = {
    async handler(m, { sock }) {
        const sender = m.sender;
        const jid = m.chat;
        const buttonId = m?.message?.buttonResponseMessage?.selectedButtonId;

        if (!buttonId) return;

        if (buttonId === 'limpiar') {
            lista.escuadra1 = [];
            lista.escuadra2 = [];
            lista.suplentes = [];
        } else {
            if (![...lista[buttonId]].includes(sender)) {
                if (lista[buttonId].length < 3) {
                    lista[buttonId].push(sender);
                }
            }
        }

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
            headerType: 1,
            mentions: [...lista.escuadra1, ...lista.escuadra2, ...lista.suplentes]
        };

        await sock.sendMessage(jid, buttonMessage, { quoted: m });
    }
}
