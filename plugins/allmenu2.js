import pkg from '@whiskeysockets/baileys';
const { generateWAMessageFromContent, proto } = pkg;

let listasGrupos = new Map();
let mensajesGrupos = new Map();

const getListasGrupo = (groupId) => {
    if (!listasGrupos.has(groupId)) {
        listasGrupos.set(groupId, {
            squad1: ['➤', '➤', '➤', '➤'],
            squad2: ['➤', '➤', '➤', '➤'],
            suplente: ['➤', '➤', '➤', '➤']
        });
    }
    return listasGrupos.get(groupId);
};

const reiniciarListas = (groupId) => {
    listasGrupos.set(groupId, {
        squad1: ['➤', '➤', '➤', '➤'],
        squad2: ['➤', '➤', '➤', '➤'],
        suplente: ['➤', '➤', '➤', '➤']
    });
};

let handler = async (m, { conn }) => {
    const msgText = m.text;
    const groupId = m.chat;
    let listas = getListasGrupo(groupId);

    if (msgText.toLowerCase().startsWith('.listaff')) {
        const mensaje = msgText.substring(8).trim();
        if (!mensaje) {
            await conn.sendMessage(m.chat, { text: `❌ 𝗗𝗘𝗕𝗘𝗦 𝗜𝗡𝗚𝗥𝗘𝗦𝗔𝗥 𝗨𝗡 𝗧𝗘𝗫𝗧𝗢\n\n𝗘𝗷𝗲𝗺𝗽𝗹𝗼:\n.listaff Actívense para la ranked 🎮` });
            return;
        }

        reiniciarListas(groupId);
        listas = getListasGrupo(groupId);
        mensajesGrupos.set(groupId, mensaje);

        await enviarLista(conn, m.chat, listas, mensaje);
        return;
    }
};

async function enviarLista(conn, chat, listas, mensaje) {
    const texto = `*${mensaje}*

╭─────────────╮
│ 𝗘𝗦𝗖𝗨𝗔𝗗𝗥𝗔 1
│👑 ${listas.squad1[0]}
│🥷🏻 ${listas.squad1[1]}
│🥷🏻 ${listas.squad1[2]}
│🥷🏻 ${listas.squad1[3]}
╰─────────────╯
╭─────────────╮
│ 𝗘𝗦𝗖𝗨𝗔𝗗𝗥𝗔 2
│👑 ${listas.squad2[0]}
│🥷🏻 ${listas.squad2[1]}
│🥷🏻 ${listas.squad2[2]}
│🥷🏻 ${listas.squad2[3]}
╰─────────────╯
╭─────────────╮
│ 𝗦𝗨𝗣𝗟𝗘𝗡𝗧𝗘𝗦
│🥷🏻 ${listas.suplente[0]}
│🥷🏻 ${listas.suplente[1]}
│🥷🏻 ${listas.suplente[2]}
│🥷🏻 ${listas.suplente[3]}
╰─────────────╯
𝗘𝗟𝗜𝗧𝗘 𝗕𝗢𝗧 𝗚𝗟𝗢𝗕𝗔𝗟
❙❘❙❙❘❙❚❙❘❙❙❚❙❘❙❘❙❚❙❘❙❙❚❙❘❙❙❘❙❚❙❘`;

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

    const mensaje = generateWAMessageFromContent(chat, {
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

    await conn.relayMessage(chat, mensaje.message, { messageId: mensaje.key.id });
}

// RESPUESTA A LOS BOTONES
export async function after(m, { conn }) {
    try {
        const button = m?.message?.buttonsResponseMessage;
        if (!button) return;

        const id = button.selectedButtonId;
        const groupId = m.chat;
        const nombreUsuario = m.pushName || m.sender.split('@')[0];
        const tag = m.sender;
        const listas = getListasGrupo(groupId);

        // Eliminar si está en otra escuadra
        Object.keys(listas).forEach(key => {
            const index = listas[key].findIndex(p => p.includes(`@${nombreUsuario}`));
            if (index !== -1) listas[key][index] = '➤';
        });

        const squadType = id === 'escuadra1' ? 'squad1' : id === 'escuadra2' ? 'squad2' : 'suplente';
        const libre = listas[squadType].findIndex(p => p === '➤');

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

        const mensajeGuardado = mensajesGrupos.get(groupId);
        if (mensajeGuardado) {
            await enviarLista(conn, m.chat, listas, mensajeGuardado);
        }
    } catch (error) {
        console.error('❌ Error en after:', error);
        await conn.sendMessage(m.chat, { text: '❌ Error al procesar tu selección' });
    }
}

handler.customPrefix = /^\.listaff/i;
handler.command = new RegExp;
handler.group = true;

export default handler;
