import pkg from '@whiskeysockets/baileys';
const { generateWAMessageFromContent, proto } = pkg;

let listas = {
  squad1: ['➢', '➢', '➢', '➢'],
  squad2: ['➢', '➢', '➢', '➢'],
  suplente: ['✔', '✔', '✔']
};

const handler = async (m, { conn, command }) => {
  await enviarLista(conn, m.chat);
};

handler.command = /^listaff$/i;

handler.before = async function (m, { conn }) {
  const button = m?.message?.buttonsResponseMessage;
  if (!button) return;

  const id = button.selectedButtonId;
  const usuario = m.sender.split('@')[0];
  const tag = m.sender;

  if (id === 'limpiar') {
    listas = {
      squad1: ['➢', '➢', '➢', '➢'],
      squad2: ['➢', '➢', '➢', '➢'],
      suplente: ['✔', '✔', '✔']
    };
    return await conn.sendMessage(m.chat, {
      text: `♻️ Listas reiniciadas por @${usuario}`,
      mentions: [tag]
    });
  }

  const yaRegistrado = Object.values(listas).some(lista =>
    lista.includes(`@${usuario}`)
  );

  if (yaRegistrado) {
    return await conn.sendMessage(m.chat, {
      text: `⚠️ @${usuario}, ya estás en una lista.`,
      mentions: [tag]
    });
  }

  const libre = listas[id]?.findIndex(p => p === '➢' || p === '✔');
  if (libre !== -1) {
    listas[id][libre] = `@${usuario}`;
    await conn.sendMessage(m.chat, {
      text: `✅ @${usuario} agregado a ${id === 'squad1' ? 'Escuadra 1' : id === 'squad2' ? 'Escuadra 2' : 'Suplente'}`,
      mentions: [tag]
    });
    await enviarLista(conn, m.chat);
  } else {
    await conn.sendMessage(m.chat, {
      text: `⚠️ ${id} está llena`,
      mentions: [tag]
    });
  }
};

async function enviarLista(conn, chatId) {
  const texto = 
`*MODALIDAD:* CLK  
*ROPA:* verde  

*Escuadra 1:*  
${listas.squad1.map(p => `➡ ${p}`).join('\n')}  

*Escuadra 2:*  
${listas.squad2.map(p => `➡ ${p}`).join('\n')}  

*SUPLENTE:*  
${listas.suplente.map(p => `➡ ${p}`).join('\n')}  

*BOLLLOBOT / MELDEXZZ.*`;

  const buttons = [
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
  ];

  const msg = generateWAMessageFromContent(chatId, {
    viewOnceMessage: {
      message: {
        messageContextInfo: { deviceListMetadata: {} },
        interactiveMessage: proto.Message.InteractiveMessage.create({
          body: { text: texto },
          footer: { text: "Selecciona una opción:" },
          nativeFlowMessage: { buttons }
        })
      }
    }
  }, {});

  await conn.relayMessage(chatId, msg.message, { messageId: msg.key.id });
}

export default handler;
