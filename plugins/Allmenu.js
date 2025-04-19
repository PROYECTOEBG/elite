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

export async function before(m, { conn }) {
  if (!m.message) return;
  
  // Detectar el tipo de mensaje de botón
  const button = m.message?.buttonsResponseMessage?.selectedButtonId ||
                m.message?.templateButtonReplyMessage?.selectedId;
  
  if (!button) return;
  
  const user = m.sender;
  const username = '@' + user.split('@')[0];

  try {
    // Reaccionar al mensaje
    await reaccionar(conn, m.chat, m.key, '✅');

    if (button === 'limpiar') {
      listas = {
        squad1: ['➢', '➢', '➢', '➢'],
        squad2: ['➢', '➢', '➢', '➢'],
        suplente: ['✔', '✔', '✔']
      };
      
      await enviarMensaje(conn, m.chat, {
        text: `♻️ Listas reiniciadas por ${username}`,
        mentions: [user]
      });
      
      return await enviarLista(conn, m.chat);
    }

    const tipo = button;
    const libre = listas[tipo]?.findIndex(v => v === '➢' || v === '✔');
    
    if (libre !== -1) {
      listas[tipo][libre] = username;
      
      await enviarMensaje(conn, m.chat, {
        text: `✅ ${username} agregado a ${tipo === 'squad1' ? 'Escuadra 1' : tipo === 'squad2' ? 'Escuadra 2' : 'Suplente'}`,
        mentions: [user]
      });
      
      await enviarLista(conn, m.chat);
    } else {
      await enviarMensaje(conn, m.chat, {
        text: `⚠️ ${tipo} está llena`,
        mentions: [user]
      });
    }
  } catch (error) {
    console.error('Error:', error);
    await enviarMensaje(conn, m.chat, {
      text: '❌ Ocurrió un error al procesar tu selección'
    });
  }
}

async function reaccionar(conn, chat, key, emoji) {
  try {
    await conn.sendMessage(chat, { 
      react: { 
        text: emoji, 
        key: key 
      } 
    });
  } catch (error) {
    console.error('Error al reaccionar:', error);
  }
}

async function enviarMensaje(conn, chat, options) {
  try {
    await conn.sendMessage(chat, options);
  } catch (error) {
    console.error('Error al enviar mensaje:', error);
  }
}

async function enviarLista(conn, jid) {
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

  const templateButtons = [
    {index: 1, urlButton: {displayText: 'Escuadra 1', url: '#squad1'}},
    {index: 2, urlButton: {displayText: 'Escuadra 2', url: '#squad2'}},
    {index: 3, urlButton: {displayText: 'Suplente', url: '#suplente'}},
    {index: 4, urlButton: {displayText: 'Limpiar lista', url: '#limpiar'}}
  ];

  const templateMessage = {
    text: texto,
    footer: 'Selecciona una opción:',
    templateButtons: templateButtons
  };

  try {
    await conn.sendMessage(jid, templateMessage);
  } catch (error) {
    console.error('Error al enviar lista:', error);
    // Intento alternativo con formato más simple
    await conn.sendMessage(jid, {
      text: texto + '\n\nUsa los comandos:\n!squad1\n!squad2\n!suplente\n!limpiar'
    });
  }
}
