import pkg from '@whiskeysockets/baileys';
const { generateWAMessageFromContent, proto } = pkg;

// Estado global de las listas
let listas = {
    escuadra1: ['➢', '➢', '➢', '➢'],
    escuadra2: ['➢', '➢', '➢', '➢'],
    suplente: ['✔', '✔', '✔']
};

const handler = async (m, { conn }) => {
    try {
        await enviarLista(conn, m.chat);
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
    
    const libre = listas[squadType].findIndex(p => p === '➢' || p === '✔');
    
    if (libre !== -1) {
        listas[squadType][libre] = `@${usuario}`;
        await conn.sendMessage(m.chat, {
            text: `✅ @${usuario} agregado a ${squadName}`,
            mentions: [tag]
        });
        await enviarLista(conn, m.chat);
    } else {
        await conn.sendMessage(m.chat, {
            text: `⚠️ ${squadName} está llena`,
            mentions: [tag]
        });
    }
}

// Función para enviar la lista interactiva
async function enviarLista(conn, chatId) {
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
                name: "quick_reply",
                buttonParamsJson: JSON.stringify({
                    display_text: "Escuadra 1",
                    id: "escuadra1"
                })
            },
            {
                name: "quick_reply",
                buttonParamsJson: JSON.stringify({
                    display_text: "Escuadra 2",
                    id: "escuadra2"
                })
            },
            {
                name: "quick_reply",
                buttonParamsJson: JSON.stringify({
                    display_text: "Suplente",
                    id: "suplente"
                })
            },
            {
                name: "quick_reply",
                buttonParamsJson: JSON.stringify({
                    display_text: "Limpiar lista",
                    id: "limpiar"
                })
            }
        ];

        const mensaje = generateWAMessageFromContent(chatId, {
            viewOnceMessage: {
                message: {
                    messageContextInfo: { deviceListMetadata: {} },
                    interactiveMessage: proto.Message.InteractiveMessage.create({
                        body: { text: texto },
                        footer: { text: "Selecciona una opción:" },
                        nativeFlowMessage: { buttons }
                    })
                }
            }
        }, {});

        await conn.relayMessage(chatId, mensaje.message, { messageId: mensaje.key.id });
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
                suplente: ['✔', '✔', '✔']
            };
            await conn.sendMessage(m.chat, {
                text: `♻️ Listas reiniciadas por @${numero}`,
                mentions: [tag]
            }, { quoted: m });
            await enviarLista(conn, m.chat);
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
