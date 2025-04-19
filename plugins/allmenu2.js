// ... existing code ...
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

        const mensaje_final = generateWAMessageFromContent(m.chat, {
            viewOnceMessage: {
                message: {
                    messageContextInfo: {
                        deviceListMetadata: {},
                        mentionedJid: [tag]
                    },
                    interactiveMessage: proto.Message.InteractiveMessage.create({
                        body: { text: texto },
                        footer: { text: "Selecciona una opción:" },
                        nativeFlowMessage: { buttons }
                    })
                }
            }
        }, {});

        await conn.relayMessage(m.chat, mensaje_final.message, { messageId: mensaje_final.key.id });
    } catch (error) {
        console.error('Error en after:', error);
        await conn.sendMessage(m.chat, { text: '❌ Error al procesar tu selección' });
    }
}
// ... existing code ...
