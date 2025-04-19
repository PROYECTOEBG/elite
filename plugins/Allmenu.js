import { generateWAMessageFromContent, proto } from '@whiskeysockets/baileys';

let listas = {
  squad1: ['➢', '➢', '➢', '➢'],
  squad2: ['➢', '➢', '➢', '➢'],
  suplente: ['✔', '✔', '✔']
};

const handler = async (m, { conn }) => {
  const buttons = [
    {buttonId: 'squad1', buttonText: {displayText: 'Escuadra 1'}, type: 1},
    {buttonId: 'squad2', buttonText: {displayText: 'Escuadra 2'}, type: 1},
    {buttonId: 'suplente', buttonText: {displayText: 'Suplente'}, type: 1},
    {buttonId: 'limpiar', buttonText: {displayText: 'Limpiar lista'}, type: 1}
  ];

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

  const buttonMessage = {
    text: texto,
    footer: 'Selecciona una opción:',
    buttons: buttons,
    headerType: 1
  };

  try {
    await conn.sendMessage(m.chat, buttonMessage);
  } catch (error) {
    console.error('Error al enviar mensaje:', error);
    // Intento alternativo
    await conn.sendMessage(m.chat, { text: texto });
  }
};

handler.command = /^listaff$/i;
export default handler;

export async function before(m, { conn }) {
  if (!m.message) return;
  
  const buttonId = m.message?.buttonsResponseMessage?.selectedButtonId;
  if (!buttonId) return;
  
  const user = m.sender;
  const username = '@' + user.split('@')[0];

  try {
    // Reaccionar al mensaje
    await conn.sendMessage(m.chat, { 
      react: { 
        text: '✅', 
        key: m.key 
      } 
    });

    if (buttonId === 'limpiar') {
      listas = {
        squad1: ['➢', '➢', '➢', '➢'],
        squad2: ['➢', '➢', '➢', '➢'],
        suplente: ['✔', '✔', '✔']
      };
      
      await conn.sendMessage(m.chat, {
        text: `♻️ Listas reiniciadas por ${username}`,
        mentions: [user]
      });
      
      // Enviar lista actualizada
      return handler({ chat: m.chat }, { conn });
    }

    const tipo = buttonId;
    const libre = listas[tipo]?.findIndex(v => v === '➢' || v === '✔');
    
    if (libre !== -1) {
      listas[tipo][libre] = username;
      
      await conn.sendMessage(m.chat, {
        text: `✅ ${username} agregado a ${tipo === 'squad1' ? 'Escuadra 1' : tipo === 'squad2' ? 'Escuadra 2' : 'Suplente'}`,
        mentions: [user]
      });
      
      // Enviar lista actualizada
      await handler({ chat: m.chat }, { conn });
    } else {
      await conn.sendMessage(m.chat, {
        text: `⚠️ ${tipo} está llena`,
        mentions: [user]
      });
    }
  } catch (error) {
    console.error('Error:', error);
    await conn.sendMessage(m.chat, {
      text: '❌ Ocurrió un error al procesar tu selección'
    });
  }
}
