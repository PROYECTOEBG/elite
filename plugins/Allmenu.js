import pkg from '@whiskeysockets/baileys';
const { generateWAMessageFromContent, proto } = pkg;

// Objeto para almacenar el estado de las listas
let squadLists = {
  squad1: ['@Bolillo', '➢', '➢', '➢'],
  squad2: ['➢', '@Carito', '➢', '➢', '➢'],
  suplente: ['➢', '➢', '➢']
};

var handler = async (m, { conn }) => {
  await sendUpdatedList(conn, m.chat);
};

// Función mejorada para enviar la lista actualizada
async function sendUpdatedList(conn, chatId, userId = null, squadType = null) {
  // Actualizar la lista si se especifica
  if (userId && squadType) {
    const list = squadLists[squadType];
    const emptyIndex = list.findIndex(item => item === '➢');
    if (emptyIndex !== -1) {
      list[emptyIndex] = `@${userId}`;
    }
  }

  // Construir el texto actualizado
  const listText = `*MODALIDAD:* CLK  
*ROPA:* verde  

*Escuadra 1:*  
${squadLists.squad1.map(item => `➡ ${item}`).join('\n')}  

*Escuadra 2:*  
${squadLists.squad2.map(item => `➡ ${item}`).join('\n')}  

*SUPLENTE:*  
${squadLists.suplente.map(item => `➡ ${item}`).join('\n')}  

*BOLLLOBOT / MELDEXZZ.*`;

  // Crear el mensaje interactivo
  const msg = generateWAMessageFromContent(chatId, {
    viewOnceMessage: {
      message: {
        messageContextInfo: { deviceListMetadata: {}, deviceListMetadataVersion: 2 },
        interactiveMessage: proto.Message.InteractiveMessage.create({
          body: { text: listText },
          footer: { text: "Selecciona una opción:" },
          nativeFlowMessage: {
            buttons: [
              createButton('Escuadra 1', 'esc1'),
              createButton('Escuadra 2', 'esc2'),
              createButton('Suplente', 'suplente'),
              createButton('Limpiar lista', 'limpiar', true)
            ]
          }
        })
      }
    }
  }, {});

  await conn.relayMessage(msg.key.remoteJid, msg.message, { messageId: msg.key.id });
}

// Función auxiliar para crear botones
function createButton(text, id, isDanger = false) {
  return {
    name: "quick_reply",
    buttonParamsJson: JSON.stringify({
      display_text: text,
      id: id,
      ...(isDanger && { style: 'danger' })
    })
  };
}

// Manejador de interacciones mejorado
export async function after(m, { conn }) {
  if (!m.message?.buttonsResponseMessage) return;

  const { selectedButtonId } = m.message.buttonsResponseMessage;
  const userId = m.pushName || m.sender.split('@')[0];

  if (selectedButtonId === 'limpiar') {
    squadLists = {
      squad1: ['@Bolillo', '➢', '➢', '➢'],
      squad2: ['➢', '@Carito', '➢', '➢', '➢'],
      suplente: ['➢', '➢', '➢']
    };
    await conn.sendMessage(m.chat, { text: `*${userId}* ha limpiado la lista` }, { quoted: m });
  } else {
    const squadType = {
      'esc1': 'squad1',
      'esc2': 'squad2',
      'suplente': 'suplente'
    }[selectedButtonId];

    if (squadType) {
      await sendUpdatedList(conn, m.chat, userId, squadType);
      await conn.sendMessage(m.chat, { 
        text: `*${userId}* ha sido agregado a *${squadType.replace('squad', 'Escuadra ')}*` 
      }, { quoted: m });
    }
  }
}

handler.command = /^(listaff)$/i;
export default handler;
