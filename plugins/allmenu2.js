import pkg from '@whiskeysockets/baileys';
const { generateWAMessageFromContent, proto } = pkg;

// Estado global de las listas (exportado para compartir)
export let listas = {
    escuadra1: ['➢', '➢', '➢', '➢'],
    escuadra2: ['➢', '➢', '➢', '➢'],
    suplente: ['✔', '✔', '✔']
};

let handler = async (m, { conn }) => {
    try {
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

        await conn.sendMessage(m.chat, buttonMessage);
    } catch (error) {
        console.error('Error:', error);
        await m.reply('❌ Error al mostrar la lista');
    }
};

handler.help = ['listaff']
handler.tags = ['main']
handler.command = /^listaff$/i

export default handler 
