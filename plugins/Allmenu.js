import pkg from '@whiskeysockets/baileys';
const { generateWAMessageFromContent, proto } = pkg;

// Estado inicial de las listas (igual a tu imagen)
let lists = {
  squad1: ['EliteBot', 'Ñaña', 'Tú', 'dado ...'],
  squad2: ['➢', '➢', '➢', '➢'],
  suplente: ['✔', '✔', '✔']
};

const handler = async (m, { conn }) => {
  await sendInteractiveList(conn, m.chat);
};

async function sendInteractiveList(conn, chatId, updatedUser = null, listType = null) {
  // Actualizar lista si se especifica
  if (updatedUser && listType) {
    const list = lists[listType];
    const emptySpot = list.findIndex(item => item === '➢' || item === '✔');
    if (emptySpot !== -1) {
      list[emptySpot] = `@${updatedUser}`;
    }
  }

  // Construir texto exacto como en tu imagen
  const listText = `*MODALIDAD:* CLK\n*ROPA:* verde\n\n*Escuadra 1:*\n${lists.squad1.map(p => `➡ ${p}`).join('\n')}\n\n*Escuadra 2:*\n${lists.squad2.map(p => `➡ ${p}`).join('\n')}\n\n*SUPLENTE:*\n${lists.suplente.map(p => `➡ ${p}`).join('\n')}\n\n*BOLLLOBOT / MELDEXZZ.*`;

  const msg = generateWAMessageFromContent(chatId, {
    viewOnceMessage: {
      message: {
        messageContextInfo: { deviceListMetadata: {} },
        interactiveMessage: proto.Message.InteractiveMessage.create({
          body: { text: listText },
          footer: { text: "Selecciona una opción:" },
          nativeFlowMessage: {
            buttons: [
              createButton('Escuadra 1', 'squad1'),
              createButton('Escuadra 2', 'squad2'),
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

// Manejador mejorado de interacciones
export async function after(m, { conn }) {
  if (!m.message?.buttonsResponseMessage) return;

  const { selectedButtonId } = m.message.buttonsResponseMessage;
  const user = m.pushName || m.sender.split('@')[0];

  if (selectedButtonId === 'limpiar') {
    lists = {
      squad1: ['EliteBot', 'Ñaña', 'Tú', 'dado ...'],
      squad2: ['➢', '➢', '➢', '➢'],
      suplente: ['✔', '✔', '✔']
    };
    await conn.sendMessage(m.chat, { text: `Listas reiniciadas por @${user}` }, { quoted: m });
  } else {
    await sendInteractiveList(conn, m.chat, user, selectedButtonId);
    await conn.sendMessage(m.chat, { 
      text: `@${user} seleccionó ${selectedButtonId.replace('squad', 'Escuadra ').replace('suplente', 'Suplente')}` 
    }, { quoted: m });
  }
}

handler.command = /^(listaff)$/i;
export default handler;
