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
  // Verificar si es una respuesta de botón
  const selectedButton = m.message?.templateButtonReplyMessage?.selectedId || 
                        m.message?.buttonsResponseMessage?.selectedButtonId ||
                        m.message?.listResponseMessage?.singleSelectReply?.selectedRowId;
                        
  if (!selectedButton) return;

  const user = m.sender;
  const username = '@' + user.split('@')[0];

  try {
    // Reaccionar al mensaje
    await conn.sendMessage(m.chat, { 
      react: { 
        text: "✅", 
        key: m.key 
      }
    });

    if (selectedButton === 'limpiar') {
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

    const tipo = selectedButton;
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
  } catch (error) {
    console.error('Error en el manejo de botones:', error);
    await conn.sendMessage(m.chat, {
      text: '❌ Ocurrió un error al procesar tu selección'
    });
  }
}

async function enviarLista(conn, jid, mentions = []) {
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
    { buttonId: 'squad1', buttonText: { displayText: 'Escuadra 1' }, type: 1 },
    { buttonId: 'squad2', buttonText: { displayText: 'Escuadra 2' }, type: 1 },
    { buttonId: 'suplente', buttonText: { displayText: 'Suplente' }, type: 1 },
    { buttonId: 'limpiar', buttonText: { displayText: 'Limpiar lista' }, type: 1 }
  ];

  const buttonMessage = {
    text: texto,
    footer: 'Selecciona una opción:',
    buttons: buttons,
    headerType: 1,
    mentions: allMentions
  };

  await conn.sendMessage(jid, buttonMessage);
}
