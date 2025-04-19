import { generateWAMessageFromContent, proto } from '@whiskeysockets/baileys';

let handler = async (m, { conn }) => {
  let listas = {
    squad1: ['➢', '➢', '➢', '➢'],
    squad2: ['➢', '➢', '➢', '➢'],
    suplente: ['✔', '✔', '✔']
  };

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

*BOLLLOBOT / MELDEXZZ.*

Usa los comandos:
.squad1 - Para unirte a la Escuadra 1
.squad2 - Para unirte a la Escuadra 2
.suplente - Para ser suplente
.limpiar - Para limpiar la lista`;

  try {
    await m.reply(texto)
  } catch (e) {
    console.log(e)
    await conn.sendMessage(m.chat, { text: texto })
  }
}

handler.help = ['listaff']
handler.tags = ['main']
handler.command = /^(listaff|lista)$/i

export default handler

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
