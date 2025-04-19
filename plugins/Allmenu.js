import pkg from '@whiskeysockets/baileys';
const { generateWAMessageFromContent, proto } = pkg;

// Variable global para almacenar el estado de las escuadras
let squadState = {
  squad1: ['@Bolillo', '➢', '➢', '➢'],
  squad2: ['➢', '@Carito', '➢', '➢', '➢'],
  suplente: ['➢', '➢', '➢']
};

var handler = async (m, { conn, usedPrefix }) => {
  await sendSquadList(conn, m.chat);
};

// Función para enviar la lista actualizada
async function sendSquadList(conn, chatId) {
  // Generar el texto actualizado
  const listText = `*MODALIDAD:* CLK  
*ROPA:* verde  

*Escuadra 1:*  
➡ ${squadState.squad1.join('\n➡ ')}  

*Escuadra 2:*  
➡ ${squadState.squad2.join('\n➡ ')}  

*SUPLENTE:*  
➡ ${squadState.suplente.join('\n➡ ')}  

*BOLLLOBOT / MELDEXZZ.*`;

  let msg = generateWAMessageFromContent(chatId, {
    viewOnceMessage: {
      message: {
        "messageContextInfo": {
          "deviceListMetadata": {},
          "deviceListMetadataVersion": 2
        },
        interactiveMessage: proto.Message.InteractiveMessage.create({
          body: proto.Message.InteractiveMessage.Body.create({
            text: listText
          }),
          footer: proto.Message.InteractiveMessage.Footer.create({
            text: "Selecciona una opción:"
          }),
          nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
            buttons: [
              {
                "name": "quick_reply",
                "buttonParamsJson": JSON.stringify({
                  "display_text": "Escuadra 1",
                  "id": "esc1"
                })
              },
              {
                "name": "quick_reply",
                "buttonParamsJson": JSON.stringify({
                  "display_text": "Escuadra 2",
                  "id": "esc2"
                })
              },
              {
                "name": "quick_reply",
                "buttonParamsJson": JSON.stringify({
                  "display_text": "Suplente",
                  "id": "suplente"
                })
              },
              {
                "name": "quick_reply",
                "buttonParamsJson": JSON.stringify({
                  "display_text": "Limpiar lista",
                  "id": "limpiar"
                })
              }
            ],
          })
        })
      }
    }
  }, {});

  await conn.relayMessage(msg.key.remoteJid, msg.message, { messageId: msg.key.id });
}

// Manejar las respuestas a los botones
export async function after(m, { conn }) {
  if (m.message?.buttonsResponseMessage) {
    const selectedId = m.message.buttonsResponseMessage.selectedButtonId;
    const sender = m.pushName || m.sender.split('@')[0];
    
    // Actualizar el estado según la selección
    switch(selectedId) {
      case 'esc1':
        // Buscar el primer espacio vacío en Escuadra 1
        const emptyIndex1 = squadState.squad1.findIndex(item => item === '➢');
        if (emptyIndex1 !== -1) {
          squadState.squad1[emptyIndex1] = `@${sender}`;
        }
        break;
      case 'esc2':
        // Buscar el primer espacio vacío en Escuadra 2
        const emptyIndex2 = squadState.squad2.findIndex(item => item === '➢');
        if (emptyIndex2 !== -1) {
          squadState.squad2[emptyIndex2] = `@${sender}`;
        }
        break;
      case 'suplente':
        // Buscar el primer espacio vacío en Suplente
        const emptyIndexSup = squadState.suplente.findIndex(item => item === '➢');
        if (emptyIndexSup !== -1) {
          squadState.suplente[emptyIndexSup] = `@${sender}`;
        }
        break;
      case 'limpiar':
        // Resetear todas las listas
        squadState = {
          squad1: ['@Bolillo', '➢', '➢', '➢'],
          squad2: ['➢', '@Carito', '➢', '➢', '➢'],
          suplente: ['➢', '➢', '➢']
        };
        break;
    }
    
    // Enviar la lista actualizada
    await sendSquadList(conn, m.chat);
    
    // Opcional: Enviar un mensaje de confirmación
    let responseText = '';
    switch(selectedId) {
      case 'esc1':
        responseText = `*${sender}* ha sido agregado a *Escuadra 1*`;
        break;
      case 'esc2':
        responseText = `*${sender}* ha sido agregado a *Escuadra 2*`;
        break;
      case 'suplente':
        responseText = `*${sender}* ha sido agregado como *Suplente*`;
        break;
      case 'limpiar':
        responseText = `*La lista ha sido reiniciada* por *${sender}*`;
        break;
    }
    
    if (responseText) {
      await conn.sendMessage(m.chat, { text: responseText }, { quoted: m });
    }
  }
}

handler.command = /^(listaff)$/i;
export default handler;
