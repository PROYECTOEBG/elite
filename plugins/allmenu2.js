import pkg from '@whiskeysockets/baileys';
const { generateWAMessageFromContent, proto } = pkg;

// Estado global de las listas
let listas = {
  squad1: ['➢', '➢', '➢', '➢'],
  squad2: ['➢', '➢', '➢', '➢'],
  suplente: ['✔', '✔', '✔']
};

// Función para reiniciar las listas
const reiniciarListas = () => {
  listas.squad1 = ['➢', '➢', '➢', '➢'];
  listas.squad2 = ['➢', '➢', '➢', '➢'];
  listas.suplente = ['✔', '✔', '✔'];
};

let handler = async (m, { conn }) => {
    const msgText = m.text.toLowerCase();
    
    // Manejar el comando .listaff
    if (msgText === '.listaff') {
        reiniciarListas();
        const texto = `*✅ Las listas han sido reiniciadas*

MODALIDAD: CLK
ROPA: verde

Escuadra 1:
${listas.squad1.map(p => `➡️ ${p}`).join('\n')}

Escuadra 2:
${listas.squad2.map(p => `➡️ ${p}`).join('\n')}

SUPLENTE:
${listas.suplente.map(p => `➡️ ${p}`).join('\n')}`

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
            }
        ];

        const mensaje = generateWAMessageFromContent(m.chat, {
            viewOnceMessage: {
                message: {
                    messageContextInfo: {
                        deviceListMetadata: {}
                    },
                    interactiveMessage: proto.Message.InteractiveMessage.create({
                        body: { text: texto },
                        footer: { text: "Selecciona una opción:" },
                        nativeFlowMessage: { buttons }
                    })
                }
            }
        }, {});

        await conn.relayMessage(m.chat, mensaje.message, { messageId: mensaje.key.id });
        return;
    }

    if (msgText !== 'escuadra 1' && msgText !== 'escuadra 2' && msgText !== 'suplente') return
    
    const usuario = m.sender.split('@')[0];
    const nombreUsuario = m.pushName || usuario;
    
    let squadType;
    let titulo;
    let mentions = [];
    
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
    
    // Borrar al usuario de otras escuadras
    Object.keys(listas).forEach(key => {
        const index = listas[key].findIndex(p => p.includes(`@${nombreUsuario}`));
        if (index !== -1) {
            listas[key][index] = key === 'suplente' ? '✔' : '➢';
        }
    });
    
    // Agregar automáticamente al usuario a la escuadra/suplente correspondiente
    const libre = listas[squadType].findIndex(p => p === (squadType === 'suplente' ? '✔' : '➢'));
    if (libre !== -1) {
        listas[squadType][libre] = `@${nombreUsuario}`;
        mentions.push(m.sender);
    }

    // Recolectar todas las menciones de los usuarios en las listas
    Object.values(listas).forEach(squad => {
        squad.forEach(member => {
            if (member !== '➢' && member !== '✔') {
                const userName = member.slice(1);
                const userJid = Object.keys(m.message.extendedTextMessage?.contextInfo?.mentionedJid || {}).find(jid => 
                    jid.split('@')[0] === userName || 
                    conn.getName(jid) === userName
                );
                if (userJid) mentions.push(userJid);
            }
        });
    });

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
        }
    ];

    const mensaje = generateWAMessageFromContent(m.chat, {
        viewOnceMessage: {
            message: {
                messageContextInfo: {
                    deviceListMetadata: {},
                    mentionedJid: mentions
                },
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
        const nombreUsuario = m.pushName || numero;
        const tag = m.sender;

        // Borrar al usuario de otras escuadras
        Object.keys(listas).forEach(key => {
            const index = listas[key].findIndex(p => p.includes(`@${nombreUsuario}`));
            if (index !== -1) {
                listas[key][index] = key === 'suplente' ? '✔' : '➢';
            }
        });

        const squadType = id === 'escuadra1' ? 'squad1' : 
                        id === 'escuadra2' ? 'squad2' : 'suplente';
        const libre = listas[squadType].findIndex(p => p === (squadType === 'suplente' ? '✔' : '➢'));
        
        if (libre !== -1) {
            listas[squadType][libre] = `@${nombreUsuario}`;
            await conn.sendMessage(m.chat, {
                text: `✅ @${nombreUsuario} agregado a ${id === 'escuadra1' ? 'Escuadra 1' : id === 'escuadra2' ? 'Escuadra 2' : 'Suplente'}`,
                mentions: [tag]
            });
        } else {
            await conn.sendMessage(m.chat, {
                text: `⚠️ ${id === 'escuadra1' ? 'Escuadra 1' : id === 'escuadra2' ? 'Escuadra 2' : 'Suplente'} está llena`,
                mentions: [tag]
            });
        }
        
        // Actualizar la lista después de cada acción
        handler(m, { conn });
    } catch (error) {
        console.error('Error en after:', error);
        await conn.sendMessage(m.chat, { text: '❌ Error al procesar tu selección' });
    }
}

handler.customPrefix = /^(escuadra [12]|suplente|\.listaff)$/i
handler.command = new RegExp
handler.group = true

export { listas }
export default handler
