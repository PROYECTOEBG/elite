import pkg from '@whiskeysockets/baileys';
const { generateWAMessageFromContent, proto } = pkg;

// Estado global de las listas por grupo
let listasGrupos = new Map();
let mensajesGrupos = new Map();

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
};

let handler = async (m, { conn, text, args }) => {
    const msgText = m.text;
    const groupId = m.chat;
    let listas = getListasGrupo(groupId);
    
    // Manejar el comando .listaff
    if (msgText.toLowerCase().startsWith('.listaff')) {
        const mensaje = msgText.substring(8).trim(); // Remover '.listaff' del mensaje
        if (!mensaje) {
            await conn.sendMessage(m.chat, { 
                text: `❌ 𝗗𝗘𝗕𝗘𝗦 𝗜𝗡𝗚𝗥𝗘𝗦𝗔𝗥 𝗨𝗡 𝗧𝗘𝗫𝗧𝗢\n\n𝗘𝗷𝗲𝗺𝗽𝗹𝗼:\n.listaff Actívense para la ranked 🎮` 
            });
            return;
        }
        reiniciarListas(groupId);
        listas = getListasGrupo(groupId);
        mensajesGrupos.set(groupId, mensaje);

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
            {buttonId: 'escuadra1', buttonText: {displayText: 'Escuadra 1'}, type: 1},
            {buttonId: 'escuadra2', buttonText: {displayText: 'Escuadra 2'}, type: 1},
            {buttonId: 'suplente', buttonText: {displayText: 'Suplente'}, type: 1}
        ];

        await conn.sendMessage(m.chat, {
            text: texto,
            buttons: buttons,
            headerType: 1
        });
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
    
    // Borrar al usuario de otras escuadras
    Object.keys(listas).forEach(key => {
        const index = listas[key].findIndex(p => p.includes(usuario));
        if (index !== -1) {
            listas[key][index] = '➤';
        }
    });
    
    // Agregar automáticamente al usuario a la escuadra/suplente correspondiente
    const libre = listas[squadType].findIndex(p => p === '➤');
    if (libre !== -1) {
        listas[squadType][libre] = `@${usuario.split('@')[0]}`;
    }

    const mensajeGuardado = mensajesGrupos.get(groupId) || '';
    
    const texto = `${mensajeGuardado ? `*${mensajeGuardado}*\n\n` : ''}╭─────────────╮
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

    await conn.sendMessage(m.chat, {
        text: texto,
        buttons: [
            {buttonId: 'escuadra1', buttonText: {displayText: 'Escuadra 1'}, type: 1},
            {buttonId: 'escuadra2', buttonText: {displayText: 'Escuadra 2'}, type: 1},
            {buttonId: 'suplente', buttonText: {displayText: 'Suplente'}, type: 1}
        ],
        headerType: 1,
        mentions: [usuario]
    });
}

// Manejo de respuestas a botones
export async function after(m, { conn }) {
    try {
        const button = m?.message?.buttonsResponseMessage;
        if (!button) return;

        const id = button.selectedButtonId;
        const groupId = m.chat;
        let listas = getListasGrupo(groupId);
        const usuario = m.sender;
        const nombreUsuario = m.pushName || usuario.split('@')[0];
        
        // Borrar al usuario de otras escuadras
        Object.keys(listas).forEach(key => {
            const index = listas[key].findIndex(p => p.includes(usuario));
            if (index !== -1) {
                listas[key][index] = '➤';
            }
        });

        const squadType = id === 'escuadra1' ? 'squad1' : 
                        id === 'escuadra2' ? 'squad2' : 'suplente';
        const libre = listas[squadType].findIndex(p => p === '➤');
        
        if (libre !== -1) {
            listas[squadType][libre] = `@${usuario.split('@')[0]}`;
        }
        
        // Actualizar la lista después de cada acción
        const mensajeGuardado = mensajesGrupos.get(groupId);
        const texto = `${mensajeGuardado ? `*${mensajeGuardado}*\n\n` : ''}╭─────────────╮
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

        await conn.sendMessage(m.chat, {
            text: texto,
            buttons: [
                {buttonId: 'escuadra1', buttonText: {displayText: 'Escuadra 1'}, type: 1},
                {buttonId: 'escuadra2', buttonText: {displayText: 'Escuadra 2'}, type: 1},
                {buttonId: 'suplente', buttonText: {displayText: 'Suplente'}, type: 1}
            ],
            headerType: 1,
            mentions: [usuario]
        });
    } catch (error) {
        console.error('Error en after:', error);
        await conn.sendMessage(m.chat, { text: '❌ Error al procesar tu selección' });
    }
}

handler.customPrefix = /^(escuadra [12]|suplente|\.listaff.*)$/i
handler.command = new RegExp
handler.group = true

export default handler
