let handler = async (m, { conn }) => {
  const buttons = [
    [{ buttonId: 'btn_1', buttonText: { displayText: 'Botón 1' }, type: 1 }],
    [{ buttonId: 'btn_2', buttonText: { displayText: 'Botón 2' }, type: 1 }],
    [{ buttonId: 'btn_3', buttonText: { displayText: 'Botón 3' }, type: 1 }],
  ];

  await conn.sendMessage(m.chat, {
    text: '*Probando botones...*',
    footer: 'Responde tocando un botón.',
    buttons: buttons,
    mentions: [m.sender]
  }, { quoted: m });
};

handler.command = /^\\.probando$/i;
export default handler;
