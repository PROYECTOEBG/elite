import { proto } from '@whiskeysockets/baileys';

let escuadras = {
  squad1: [],
  squad2: [],
  suplente: []
};

let handler = async (m, { conn }) => {
    try {
        await m.reply(`*EliteBot*
🎮 *MODALIDAD:* CLK  
👕 *ROPA:* verde  

*Escuadra 1:*  
➡ Vacío
➡ Vacío
➡ Vacío
➡ Vacío

*Escuadra 2:*  
➡ Vacío
➡ Vacío
➡ Vacío
➡ Vacío

*SUPLENTE:*  
➡ Vacío
➡ Vacío
➡ Vacío

*BOLLLOBOT / MELDEXZZ.*

Usa:
.squad1 - Unirte a Escuadra 1
.squad2 - Unirte a Escuadra 2
.suplente - Ser suplente
.limpiar - Limpiar lista`);
    } catch (e) {
        console.error('Error:', e);
        await m.reply('Ocurrió un error');
    }
}

handler.help = ['listaff']
handler.tags = ['main']
handler.command = /^(listaff|lista)$/i

export default handler

// Comando para Escuadra 1
let handler_squad1 = async (m, { conn }) => {
  const user = m.sender;
  const username = '@' + user.split('@')[0];
  
  if (escuadras.squad1.length >= 4) {
    return m.reply('⚠️ Escuadra 1 está llena');
  }
  
  // Remover de otras escuadras si existe
  escuadras.squad2 = escuadras.squad2.filter(p => p !== username);
  escuadras.suplente = escuadras.suplente.filter(p => p !== username);
  
  // Agregar a escuadra 1 si no está
  if (!escuadras.squad1.includes(username)) {
    escuadras.squad1.push(username);
  }
  
  await conn.sendMessage(m.chat, { 
    text: generarTexto(),
    mentions: [user]
  });
};
handler_squad1.command = /^squad1$/i;
export { handler_squad1 };

// Comando para Escuadra 2
let handler_squad2 = async (m, { conn }) => {
  const user = m.sender;
  const username = '@' + user.split('@')[0];
  
  if (escuadras.squad2.length >= 4) {
    return m.reply('⚠️ Escuadra 2 está llena');
  }
  
  // Remover de otras escuadras si existe
  escuadras.squad1 = escuadras.squad1.filter(p => p !== username);
  escuadras.suplente = escuadras.suplente.filter(p => p !== username);
  
  // Agregar a escuadra 2 si no está
  if (!escuadras.squad2.includes(username)) {
    escuadras.squad2.push(username);
  }
  
  await conn.sendMessage(m.chat, { 
    text: generarTexto(),
    mentions: [user]
  });
};
handler_squad2.command = /^squad2$/i;
export { handler_squad2 };

// Comando para Suplente
let handler_suplente = async (m, { conn }) => {
  const user = m.sender;
  const username = '@' + user.split('@')[0];
  
  if (escuadras.suplente.length >= 3) {
    return m.reply('⚠️ Lista de suplentes llena');
  }
  
  // Remover de otras escuadras si existe
  escuadras.squad1 = escuadras.squad1.filter(p => p !== username);
  escuadras.squad2 = escuadras.squad2.filter(p => p !== username);
  
  // Agregar a suplentes si no está
  if (!escuadras.suplente.includes(username)) {
    escuadras.suplente.push(username);
  }
  
  await conn.sendMessage(m.chat, { 
    text: generarTexto(),
    mentions: [user]
  });
};
handler_suplente.command = /^suplente$/i;
export { handler_suplente };

// Comando para limpiar
let handler_limpiar = async (m, { conn }) => {
  escuadras = {
    squad1: [],
    squad2: [],
    suplente: []
  };
  
  await m.reply('♻️ Listas reiniciadas');
  await conn.sendMessage(m.chat, { 
    text: generarTexto()
  });
};
handler_limpiar.command = /^limpiar$/i;
export { handler_limpiar };

// Función para generar el texto de la lista
function generarTexto() {
  return `*EliteBot*
🎮 *MODALIDAD:* CLK  
👕 *ROPA:* verde  

*Escuadra 1:*  
${escuadras.squad1.length ? escuadras.squad1.map(p => `➡ ${p}`).join('\n') : '➡ Vacío'}

*Escuadra 2:*  
${escuadras.squad2.length ? escuadras.squad2.map(p => `➡ ${p}`).join('\n') : '➡ Vacío'}

*SUPLENTE:*  
${escuadras.suplente.length ? escuadras.suplente.map(p => `➡ ${p}`).join('\n') : '➡ Vacío'}

*BOLLLOBOT / MELDEXZZ.*`;
}

async function enviarLista(conn, jid, mentions = []) {
  // Obtener todos los usuarios mencionados
  const allMentions = [...new Set([
    ...mentions,
    ...escuadras.squad1.filter(p => p !== '➢').map(p => p.replace('@', '') + '@s.whatsapp.net'),
    ...escuadras.squad2.filter(p => p !== '➢').map(p => p.replace('@', '') + '@s.whatsapp.net'),
    ...escuadras.suplente.filter(p => p !== '✔').map(p => p.replace('@', '') + '@s.whatsapp.net')
  ])];

  const texto = 
`*EliteBot*
🎮 *MODALIDAD:* CLK  
👕 *ROPA:* verde  

*Escuadra 1:*  
${escuadras.squad1.map(p => `➡ ${p}`).join('\n')}  

*Escuadra 2:*  
${escuadras.squad2.map(p => `➡ ${p}`).join('\n')}  

*SUPLENTE:*  
${escuadras.suplente.map(p => `➡ ${p}`).join('\n')}  

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
