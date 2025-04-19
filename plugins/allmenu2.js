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

let handler = async (m, { conn, text, args }) => {
    const msgText = m.text;
    const groupId = m.chat;
    let listas = getListasGrupo(groupId);
    
    if (msgText.toLowerCase().startsWith('.listaff')) {
        const mensaje = msgText.substring(8).trim();
        if (!mensaje) {
            await m.reply(`❌ 𝗗𝗘𝗕𝗘𝗦 𝗜𝗡𝗚𝗥𝗘𝗦𝗔𝗥 𝗨𝗡 𝗧𝗘𝗫𝗧𝗢\n\n𝗘𝗷𝗲𝗺𝗽𝗹𝗼:\n.listaff Actívense para la ranked 🎮`);
            return;
        }
        reiniciarListas(groupId);
        listas = getListasGrupo(groupId);
        mensajesGrupos.set(groupId, mensaje);

        let yo = `*${mensaje}*`
        let texto = `${yo}

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
❙❘❙❙❘❙❚❙❘❙❙❚❙❘❙❘❙❚❙❘❙❙❚❙❘❙❙❘❙❚❙❘`.trim()

        const message = {
            text: texto,
            footer: '𝗘𝗟𝗜𝗧𝗘 𝗕𝗢𝗧 𝗚𝗟𝗢𝗕𝗔𝗟',
            templateButtons: [
                {index: 1, quickReplyButton: {displayText: 'Escuadra 1', id: 'escuadra 1'}},
                {index: 2, quickReplyButton: {displayText: 'Escuadra 2', id: 'escuadra 2'}},
                {index: 3, quickReplyButton: {displayText: 'Suplente', id: 'suplente'}}
            ]
        }

        await conn.sendMessage(m.chat, message);
        return;
    }

    if (msgText.toLowerCase() !== 'escuadra 1' && msgText.toLowerCase() !== 'escuadra 2' && msgText.toLowerCase() !== 'suplente') return;
    
    const usuario = m.sender;
    const nombreUsuario = m.pushName || usuario.split('@')[0];
    
    let squadType;
    
    if (msgText.toLowerCase() === 'escuadra 1') {
        squadType = 'squad1';
    } else if (msgText.toLowerCase() === 'escuadra 2') {
        squadType = 'squad2';
    } else {
        squadType = 'suplente';
    }
    
    Object.keys(listas).forEach(key => {
        const index = listas[key].findIndex(p => p.includes(usuario));
        if (index !== -1) {
            listas[key][index] = '➤';
        }
    });
    
    const libre = listas[squadType].findIndex(p => p === '➤');
    if (libre !== -1) {
        listas[squadType][libre] = `@${usuario.split('@')[0]}`;
    }

    const mensajeGuardado = mensajesGrupos.get(groupId) || '';
    
    let yo = mensajeGuardado ? `*${mensajeGuardado}*` : ''
    let texto = `${yo}

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
❙❘❙❙❘❙❚❙❘❙❙❚❙❘❙❘❙❚❙❘❙❙❚❙❘❙❙❘❙❚❙❘`.trim()

    const message = {
        text: texto,
        footer: '𝗘𝗟𝗜𝗧𝗘 𝗕𝗢𝗧 𝗚𝗟𝗢𝗕𝗔𝗟',
        templateButtons: [
            {index: 1, quickReplyButton: {displayText: 'Escuadra 1', id: 'escuadra 1'}},
            {index: 2, quickReplyButton: {displayText: 'Escuadra 2', id: 'escuadra 2'}},
            {index: 3, quickReplyButton: {displayText: 'Suplente', id: 'suplente'}}
        ]
    }

    await conn.sendMessage(m.chat, message);
}

handler.customPrefix = /^(escuadra [12]|suplente|\.listaff.*)$/i
handler.command = new RegExp
handler.group = true

export default handler
