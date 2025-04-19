import pkg from '@whiskeysockets/baileys';
const { generateWAMessageFromContent, proto } = pkg;

let lists = {
  squad1: ['EliteBot', 'Ñaña', '➢', '➢'],
  squad2: ['➢', '➢', '➢', '➢'],
  suplente: ['✔', '✔', '✔']
};

const handler = async (m, { conn }) => {
  await sendListWithButtons(conn, m.chat);
};

async function sendListWithButtons(conn, chatId, userAdded = null, listType = null) {
  if (userAdded && listType) {
    const list = lists[listType];
    const emptyIndex = list.findIndex(item => item === '➢' || item === '✔');
    if (emptyIndex !== -1) {
      list[emptyIndex] = `@${userAdded}`;
    }
  }

  const listText = 
`*MODALIDAD:* CLK  
*ROPA:* verde  

*Escuadra 1:*  
${lists.squad1.map(p => `➡ ${p}`).join('\n')}  

*Escuadra 2:*  
${lists.squad2.map(p => `➡ ${p}`).join('\n')}  

*SUPLENTE:*  
${lists.suplente.map(p => `➡ ${p}`).join('\n')}  

*BOLLLOBOT / MELDEXZZ.*`;

  const msg = generateWAMessageFromContent(chatId, {
    viewOnceMessage: {
      message: {
        messageContextInfo: { deviceListMetadata: {} },
        interactiveMessage: proto.Message.InteractiveMessage.create({
          body: { text: listText },
          footer: { text: "Selecciona una opción:" },
          nativeFlowMessage: {
            buttons: [
              {
                name: "quick_reply",
                buttonParamsJson: JSON.stringify({
                  display_text: "Escuadra 1",
                  id: "squad1"
                })
              },
              {
                name: "quick_reply",
                buttonParamsJson: JSON.stringify({
                  display_text: "Escuadra 2",
                  id: "squad2"
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
            ]
          }
        })
      }
    }
  }, {});

  await conn.relayMessage(msg.key.remoteJid, msg.message, { messageId: msg.key.id });
}

export async function after(m, { conn }) {
  if (!m.message?.buttonsResponseMessage) return;

  const { selectedButtonId } = m.message.buttonsResponseMessage;
  const user = m.pushName || m.sender.split('@')[0];

  if (selectedButtonId === 'limpiar') {
    lists = {
      squad1: ['EliteBot', 'Ñaña', '➢', '➢'],
      squad2: ['➢', '➢', '➢', '➢'],
      suplente: ['✔', '✔', '✔']
    };
    await conn.sendMessage(m.chat, {
      text: `♻️ Listas reiniciadas por @${user}`,
      mentions: [m.sender]
    }, { quoted: m });
  } else {
    await sendListWithButtons(conn, m.chat, user, selectedButtonId);
    await conn.sendMessage(m.chat, {
      text: `✅ @${user} agregado a ${selectedButtonId.replace('squad', 'Escuadra ').replace('suplente', 'Suplente')}`,
      mentions: [m.sender]
    }, { quoted: m });
  }
}

handler.command = /^(listaff)$/i;
export default handler;
