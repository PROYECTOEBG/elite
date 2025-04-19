let handler = async (m, { conn }) => {
  let texto = 
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

  const buttons = [
    { buttonId: 'squad1', buttonText: { displayText: '⚔️ Escuadra 1' }, type: 1 },
    { buttonId: 'squad2', buttonText: { displayText: '🗡️ Escuadra 2' }, type: 1 },
    { buttonId: 'suplente', buttonText: { displayText: '🔄 Suplente' }, type: 1 },
    { buttonId: 'limpiar', buttonText: { displayText: '🗑️ Limpiar lista' }, type: 1 }
  ];

  const buttonMessage = {
    text: texto,
    footer: '👥 Selecciona una opción:',
    buttons: buttons,
    headerType: 1
  };

  await conn.sendMessage(m.chat, buttonMessage);
};

handler.command = /^(listaff|lista)$/i;
export default handler;

// Manejador de botones
export async function before(m, { conn }) {
  if (!m.message?.buttonsResponseMessage?.selectedButtonId) return;
  
  const user = m.sender;
  const username = '@' + user.split('@')[0];
  const buttonId = m.message.buttonsResponseMessage.selectedButtonId;

  let texto = 
`*EliteBot*
🎮 *MODALIDAD:* CLK  
👕 *ROPA:* verde  

*Escuadra 1:*  `;

  if (buttonId === 'squad1') {
    texto += `\n➡ ${username}\n➡ @user2\n➡ @user3\n➡ @user4`;
  } else {
    texto += `\n➡ @user1\n➡ @user2\n➡ @user3\n➡ @user4`;
  }

  texto += `\n\n*Escuadra 2:*  `;
  
  if (buttonId === 'squad2') {
    texto += `\n➡ ${username}\n➡ @user6\n➡ @user7\n➡ @user8`;
  } else {
    texto += `\n➡ @user5\n➡ @user6\n➡ @user7\n➡ @user8`;
  }

  texto += `\n\n*SUPLENTE:*  `;
  
  if (buttonId === 'suplente') {
    texto += `\n➡ ${username}\n➡ @user10\n➡ @user11`;
  } else {
    texto += `\n➡ @user9\n➡ @user10\n➡ @user11`;
  }

  texto += `\n\n*BOLLLOBOT / MELDEXZZ.*`;

  const buttons = [
    { buttonId: 'squad1', buttonText: { displayText: '⚔️ Escuadra 1' }, type: 1 },
    { buttonId: 'squad2', buttonText: { displayText: '🗡️ Escuadra 2' }, type: 1 },
    { buttonId: 'suplente', buttonText: { displayText: '🔄 Suplente' }, type: 1 },
    { buttonId: 'limpiar', buttonText: { displayText: '🗑️ Limpiar lista' }, type: 1 }
  ];

  const buttonMessage = {
    text: texto,
    footer: '👥 Selecciona una opción:',
    buttons: buttons,
    headerType: 1,
    mentions: [user]
  };

  try {
    // Primero reaccionamos al mensaje
    await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key }});
    
    // Enviamos mensaje de confirmación
    await conn.sendMessage(m.chat, {
      text: `✅ Te has unido a ${buttonId === 'squad1' ? 'Escuadra 1' : buttonId === 'squad2' ? 'Escuadra 2' : 'Suplente'}`,
      mentions: [user]
    });

    // Enviamos la lista actualizada
    await conn.sendMessage(m.chat, buttonMessage);
  } catch (error) {
    console.error(error);
    await conn.sendMessage(m.chat, { text: '❌ Ocurrió un error' });
  }
}
