import pkg from '@whiskeysockets/baileys';
const { generateWAMessageFromContent, proto } = pkg;

// Estado global de las listas por grupo
let listasGrupos = new Map();
let horariosGrupos = new Map();

// Función para obtener o crear las listas de un grupo
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

// Función para reiniciar las listas de un grupo específico
const reiniciarListas = (groupId) => {
    listasGrupos.set(groupId, {
        squad1: ['➤', '➤', '➤', '➤'],
        squad2: ['➤', '➤', '➤', '➤'],
        suplente: ['➤', '➤', '➤', '➤']
    });
    horariosGrupos.delete(groupId);
};

let handler = async (m, { conn }) => {
    const msgText = m.text.toLowerCase();
    const groupId = m.chat;
    let listas = getListasGrupo(groupId);
    
    // Manejar el comando de horario
    if (msgText.startsWith('.8vs8')) {
        const horario = msgText.slice(5).trim(); // Remover '.8vs8' del mensaje
        if (!horario) {
            const texto = `⌚ 𝗜𝗡𝗚𝗥𝗘𝗦𝗔 𝗨𝗡 𝗛𝗢𝗥𝗔𝗥𝗜𝗢.

𝗘𝗷𝗲𝗺𝗽𝗹𝗼:
.8vs8 4pm🇪🇨/3pm🇲🇽`;
            await conn.sendMessage(m.chat, { text: texto });
            return;
        }
        horariosGrupos.set(groupId, horario);
        await mostrarLista(conn, m.chat, listas, horario);
        return;
    }
    
    // Manejar el comando .listaff
    if (msgText === '.listaff') {
        reiniciarListas(groupId);
        listas = getListasGrupo(groupId);
        await mostrarLista(conn, m.chat, listas);
        return;
    }

    if (msgText !== 'escuadra 1' && msgText !== 'escuadra 2' && msgText !== 'suplente') return;
    
    const usuario = m.sender.split('@')[0];
    const nombreUsuario = m.pushName || usuario;
    
    let squadType;
    let mentions = [];
    
    if (msgText === 'escuadra 1') {
        squadType = 'squad1';
    } else if (msgText === 'escuadra 2') {
        squadType = 'squad2';
    } else {
        squadType = 'suplente';
    }
    
    // Borrar al usuario de otras escuadras
    Object.keys(listas).forEach(key => {
        const index = listas[key].findIndex(p => p.includes(`@${nombreUsuario}`));
        if (index !== -1) {
            listas[key][index] = '➤';
        }
    });
    
    // Agregar automáticamente al usuario a la escuadra/suplente correspondiente
    const libre = listas[squadType].findIndex(p => p === '➤');
    if (libre !== -1) {
        listas[squadType][libre] = `@${nombreUsuario}`;
        mentions.push(m.sender);
    }

    // Recolectar todas las menciones y mostrar la lista actualizada
    Object.values(listas).forEach(squad => {
        squad.forEach(member => {
            if (member !== '➤') {
                const userName = member.slice(1);
                const userJid = Object.keys(m.message.extendedTextMessage?.contextInfo?.mentionedJid || {}).find(jid => 
                    jid.split('@')[0] === userName || 
                    conn.getName(jid) === userName
                );
                if (userJid) mentions.push(userJid);
            }
        });
    });

    await mostrarLista(conn, m.chat, listas, horariosGrupos.get(groupId), mentions);
}

// Función para mostrar la lista con o sin horario
async function mostrarLista(conn, chat, listas, horario = '', mentions = []) {
    const horarioTexto = horario ? `⌚ ${horario}\n` : '';
    
    const texto = `${horarioTexto}╭─────────────╮
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

    await conn.relayMessage(chat, mensaje.message, { messageId: mensaje.key.id });
}

// Manejo de respuestas a botones
export async function after(m, { conn }) {
    try {
        const button = m?.message?.buttonsResponseMessage;
        if (!button) return;

        const id = button.selectedButtonId;
        const groupId = m.chat;
        let listas = getListasGrupo(groupId);
        const numero = m.sender.split('@')[0];
        const nombreUsuario = m.pushName || numero;
        const tag = m.sender;

        // Borrar al usuario de otras escuadras
        Object.keys(listas).forEach(key => {
            const index = listas[key].findIndex(p => p.includes(`@${nombreUsuario}`));
            if (index !== -1) {
                listas[key][index] = '➤';
            }
        });

        const squadType = id === 'escuadra1' ? 'squad1' : 
                        id === 'escuadra2' ? 'squad2' : 'suplente';
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
        
        // Actualizar la lista después de cada acción
        await mostrarLista(conn, m.chat, listas, horariosGrupos.get(groupId), [tag]);
    } catch (error) {
        console.error('Error en after:', error);
        await conn.sendMessage(m.chat, { text: '❌ Error al procesar tu selección' });
    }
}

handler.customPrefix = /^(escuadra [12]|suplente|\.listaff|\.8vs8.*)$/i
handler.command = new RegExp
handler.group = true

export default handler 
