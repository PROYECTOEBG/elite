import pkg from '@whiskeysockets/baileys';
const { generateWAMessageFromContent, proto } = pkg;

let listas = {
  squad1: ['➢', '➢', '➢', '➢'],
  squad2: ['➢', '➢', '➢', '➢'],
  suplente: ['✔', '✔', '✔']
};

const handler = async (m, { conn }) => {
  // Verificar si el mensaje es "escuadra 1"
  if (m.text && m.text.toLowerCase() === 'escuadra 1') {
    const nombre = m.pushName || 'Usuario';
    const numero = m.sender.split('@')[0];
    
    // Buscar espacio libre en Escuadra 1
    const libre = listas.squad1.findIndex(p => p === '➢');
    if (libre !== -1) {
      listas.squad1[libre] = `@${numero}`;
      await enviarLista(conn, m.chat, numero, 'squad1', m.sender);
    } else {
      await conn.sendMessage(m.chat, {
        text: '⚠️ La Escuadra 1 está llena',
        mentions: [m.sender]
      }, { quoted: m });
    }
  } else {
    await enviarLista(conn, m.chat);
  }
};

// Resto del código se mantiene igual...
async function enviarLista(conn, chatId, usuario = null, tipo = null, tag = null) {
  if (usuario && tipo) {
    const lista = listas[tipo];
    const libre = lista.findIndex(p => p === '➢' || p === '✔');
    if (libre !== -1) lista[libre] = `@${usuario}`;
  }

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

  const mensaje = generateWAMessageFromContent(chatId, {
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

  await conn.relayMessage(chatId, mensaje.message, { messageId: mensaje.key.id });

  if (usuario && tag) {
    await conn.sendMessage(chatId, {
      text: `✅ @${usuario} agregado a ${tipo === 'squad1' ? 'Escuadra 1' : tipo === 'squad2' ? 'Escuadra 2' : 'Suplente'}`,
      mentions: [tag]
    });
  }
}

export async function after(m, { conn }) {
  const button = m?.message?.buttonsResponseMessage;
  if (!button) return;

  const id = button.selectedButtonId;
  const nombre = m.pushName || 'Usuario';
  const numero = m.sender.split('@')[0];

  if (id === 'limpiar') {
    listas = {
      squad1: ['➢', '➢', '➢', '➢'],
      squad2: ['➢', '➢', '➢', '➢'],
      suplente: ['✔', '✔', '✔']
    };
    await conn.sendMessage(m.chat, {
      text: `♻️ Listas reiniciadas por @${numero}`,
      mentions: [m.sender]
    }, { quoted: m });
  } else {
    await enviarLista(conn, m.chat, numero, id, m.sender);
  }
}

handler.command = /^listaff$/i;
export default handler;
