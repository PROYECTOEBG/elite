import pkg from '@whiskeysockets/baileys';
const { generateWAMessageFromContent, proto } = pkg;

let listas = {
  squad1: ['➢', '➢', '➢', '➢'],
  squad2: ['➢', '➢', '➢', '➢'],
  suplente: ['✔', '✔', '✔']
};

const handler = async (m, { conn }) => {
  await enviarLista(conn, m.chat);
};

handler.command = /^listaff$/i;
export default handler;

// Evento para manejar botones
export async function before(m, { conn }) {
  const btn = m?.message?.buttonsResponseMessage;
  if (!btn) return;

  const id = btn.selectedButtonId;
  const user = m.sender;
  const username = '@' + user.split('@')[0];

  // Reaccionar al botón
  await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key }});

  if (id === 'limpiar') {
    listas = {
      squad1: ['➢', '➢', '➢', '➢'],
      squad2: ['➢', '➢', '➢', '➢'],
      suplente: ['✔', '✔', '✔']
    };
    await conn.sendMessage(m.chat, {
      text: `♻️ Listas reiniciadas por ${username}`,
      mentions: [user]
    });
    return await enviarLista(conn, m.chat);
  }

  const tipo = id;
  const libre = listas[tipo]?.findIndex(v => v === '➢' || v === '✔');
  
  if (libre !== -1) {
    listas[tipo][libre] = username;
    await conn.sendMessage(m.chat, {
      text: `✅ ${username} agregado a ${tipo === 'squad1' ? 'Escuadra 1' : tipo === 'squad2' ? 'Escuadra 2' : 'Suplente'}`,
      mentions: [user]
    });
    await enviarLista(conn, m.chat, [user]);
  } else {
    await conn.sendMessage(m.chat, {
      text: `⚠️ ${tipo} está llena`,
      mentions: [user]
    });
  }
}

async function enviarLista(conn, jid, mentions = []) {
  // Obtener todos los usuarios mencionados
  const allMentions = [...new Set([
    ...mentions,
    ...listas.squad1.filter(p => p !== '➢').map(p => p.replace('@', '') + '@s.whatsapp.net'),
    ...listas.squad2.filter(p => p !== '➢').map(p => p.replace('@', '') + '@s.whatsapp.net'),
    ...listas.suplente.filter(p => p !== '✔').map(p => p.replace('@', '') + '@s.whatsapp.net')
  ])];

  const texto = 
`*EliteBot*
🎮 *MODALIDAD:* CLK  
👕 *ROPA:* verde  

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
      buttonParamsJson: JSON.stringify({ display_text: "Escuadra 1", id: "squad1" })
    },
    {
      name: "quick_reply",
      buttonParamsJson: JSON.stringify({ display_text: "Escuadra 2", id: "squad2" })
    },
    {
      name: "quick_reply",
      buttonParamsJson: JSON.stringify({ display_text: "Suplente", id: "suplente" })
    },
    {
      name: "quick_reply",
      buttonParamsJson: JSON.stringify({ display_text: "Limpiar lista", id: "limpiar" })
    }
  ];

  const mensaje = generateWAMessageFromContent(jid, {
    viewOnceMessage: {
      message: {
        messageContextInfo: { 
          deviceListMetadata: {},
          mentionedJid: allMentions
        },
        interactiveMessage: proto.Message.InteractiveMessage.create({
          body: { text: texto },
          footer: { text: "Selecciona una opción:" },
          nativeFlowMessage: { buttons }
        })
      }
    }
  }, {});

  await conn.relayMessage(jid, mensaje.message, { messageId: mensaje.key.id });
}
