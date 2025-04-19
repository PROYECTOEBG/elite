import { proto } from '@whiskeysockets/baileys';

let listas = {
  squad1: ['➢', '➢', '➢', '➢'],
  squad2: ['➢', '➢', '➢', '➢'],
  suplente: ['✔', '✔', '✔']
};

let handler = async (m, { conn }) => {
  const texto = 
`*EliteBot*
🎮 *MODALIDAD:* CLK  
👕 *ROPA:* verde  

*Escuadra 1:*  
➡ @user1
➡ @user2
➡ @user3
➡ @user4

*Escuadra 2:*  
➡ @user5
➡ @user6
➡ @user7
➡ @user8

*SUPLENTE:*  
➡ @user9
➡ @user10
➡ @user11

*BOLLLOBOT / MELDEXZZ.*`;

  try {
    await conn.sendMessage(m.chat, {
      text: texto,
      buttons: [
        { buttonId: 'squad1', buttonText: { displayText: '⚔️ Escuadra 1' }, type: 1 },
        { buttonId: 'squad2', buttonText: { displayText: '🗡️ Escuadra 2' }, type: 1 },
        { buttonId: 'suplente', buttonText: { displayText: '🔄 Suplente' }, type: 1 },
        { buttonId: 'limpiar', buttonText: { displayText: '🗑️ Limpiar lista' }, type: 1 }
      ],
      footer: '👥 Selecciona una opción:',
      headerType: 1
    });
  } catch (e) {
    console.error(e);
    m.reply(texto);
  }
};

handler.command = /^(listaff|lista)$/i;
export default handler;

export async function before(m, { conn }) {
  try {
    if (!m.message?.buttonsResponseMessage?.selectedButtonId) return;
    
    const user = m.sender;
    const username = '@' + user.split('@')[0];
    const buttonId = m.message.buttonsResponseMessage.selectedButtonId;

    // Reaccionamos al mensaje
    await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key }});

    let newText = 
`*EliteBot*
🎮 *MODALIDAD:* CLK  
👕 *ROPA:* verde  

*Escuadra 1:*  
${buttonId === 'squad1' ? `➡ ${username}` : '➡ @user1'}
➡ @user2
➡ @user3
➡ @user4

*Escuadra 2:*  
${buttonId === 'squad2' ? `➡ ${username}` : '➡ @user5'}
➡ @user6
➡ @user7
➡ @user8

*SUPLENTE:*  
${buttonId === 'suplente' ? `➡ ${username}` : '➡ @user9'}
➡ @user10
➡ @user11

*BOLLLOBOT / MELDEXZZ.*`;

    // Enviamos mensaje de confirmación
    await conn.sendMessage(m.chat, {
      text: `✅ Te has unido a ${buttonId === 'squad1' ? 'Escuadra 1' : buttonId === 'squad2' ? 'Escuadra 2' : 'Suplente'}`,
      mentions: [user]
    });

    // Enviamos la lista actualizada
    await conn.sendMessage(m.chat, {
      text: newText,
      buttons: [
        { buttonId: 'squad1', buttonText: { displayText: '⚔️ Escuadra 1' }, type: 1 },
        { buttonId: 'squad2', buttonText: { displayText: '🗡️ Escuadra 2' }, type: 1 },
        { buttonId: 'suplente', buttonText: { displayText: '🔄 Suplente' }, type: 1 },
        { buttonId: 'limpiar', buttonText: { displayText: '🗑️ Limpiar lista' }, type: 1 }
      ],
      footer: '👥 Selecciona una opción:',
      headerType: 1,
      mentions: [user]
    });
  } catch (error) {
    console.error(error);
    await m.reply('❌ Ocurrió un error al procesar tu selección');
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
