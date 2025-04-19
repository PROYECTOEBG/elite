import pkg from '@whiskeysockets/baileys';
const { generateWAMessageFromContent, proto } = pkg;

// Estado global de las listas
const listas = {
  squad1: ['➢', '➢', '➢', '➢'],
  squad2: ['➢', '➢', '➢', '➢'],
  suplente: ['✓', '✓', '✓']
};

let handler = async (m, { conn }) => {
    const msgText = m.text.toLowerCase();
    if (msgText !== 'escuadra 1' && msgText !== 'escuadra 2' && msgText !== 'suplente') return
    
    const usuario = m.sender.split('@')[0];
    let squadType;
    let titulo;
    
    if (msgText === 'escuadra 1') {
        squadType = 'squad1';
        titulo = 'Escuadra 1';
    } else if (msgText === 'escuadra 2') {
        squadType = 'squad2';
        titulo = 'Escuadra 2';
    } else {
        squadType = 'suplente';
        titulo = 'Suplente';
    }
    
    // Agregar automáticamente al usuario a la escuadra/suplente correspondiente
    const libre = listas[squadType].findIndex(p => p === (squadType === 'suplente' ? '✓' : '➢'));
    if (libre !== -1) {
        listas[squadType][libre] = `@${usuario}`;
    }

    const texto = `Tú
${titulo}

MODALIDAD: CLK
ROPA: verde

Escuadra 1:
${listas.squad1.map(p => `➡️ ${p}`).join('\n')}

Escuadra 2:
${listas.squad2.map(p => `➡️ ${p}`).join('\n')}

SUPLENTE:
${listas.suplente.map(p => `➡️ ${p}`).join('\n')}

BOLLLLOBOT / MELDEXZZ.`

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

    const mensaje = generateWAMessageFromContent(m.chat, {
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

    await conn.relayMessage(m.chat, mensaje.message, { messageId: mensaje.key.id });
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
            Object.keys(listas).forEach(key => {
                listas[key] = listas[key].map(() => key.startsWith('suplente') ? '✓' : '➢');
            });
            await conn.sendMessage(m.chat, {
                text: `♻️ Listas reiniciadas por @${numero}`,
                mentions: [tag]
            });
        } else {
            const squadType = id === 'escuadra1' ? 'squad1' : 
                            id === 'escuadra2' ? 'squad2' : 'suplente';
            const libre = listas[squadType].findIndex(p => p === (squadType === 'suplente' ? '✓' : '➢'));
            
            if (libre !== -1) {
                listas[squadType][libre] = `@${numero}`;
                await conn.sendMessage(m.chat, {
                    text: `✅ @${numero} agregado a ${id === 'escuadra1' ? 'Escuadra 1' : id === 'escuadra2' ? 'Escuadra 2' : 'Suplente'}`,
                    mentions: [tag]
                });
            } else {
                await conn.sendMessage(m.chat, {
                    text: `⚠️ ${id === 'escuadra1' ? 'Escuadra 1' : id === 'escuadra2' ? 'Escuadra 2' : 'Suplente'} está llena`,
                    mentions: [tag]
                });
            }
        }
        
        // Actualizar la lista después de cada acción
        handler(m, { conn });
    } catch (error) {
        console.error('Error en after:', error);
        await conn.sendMessage(m.chat, { text: '❌ Error al procesar tu selección' });
    }
}

handler.customPrefix = /^(escuadra [12]|suplente)$/i
handler.command = new RegExp
handler.group = true

export default handler
