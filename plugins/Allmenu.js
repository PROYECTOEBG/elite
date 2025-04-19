let handler = async (m, { conn }) => {
  let id = m.chat;
  global.listasff = global.listasff || {};
  if (!global.listasff[id]) {
    global.listasff[id] = {
      msgId: null,
      escuadra1: [],
      escuadra2: [],
      suplente: [],
    };
  }

  const textoInicial = `
> 🗓️ *COL*: 22:00
> ⚔️ *MODALIDAD*: CLK
> 👕 *ROPA*: verde

⬅️ *Escuadra 1:*
┊👨🏻‍💻 ➤ ${global.listasff[id].escuadra1[0] || ' '}
┊👨🏻‍💻 ➤ ${global.listasff[id].escuadra1[1] || ' '}
┊👨🏻‍💻 ➤ ${global.listasff[id].escuadra1[2] || ' '}
┊👨🏻‍💻 ➤ ${global.listasff[id].escuadra1[3] || ' '}

⬅️ *Escuadra 2:*
┊👨🏻‍💻 ➤ ${global.listasff[id].escuadra2[0] || ' '}
┊👨🏻‍💻 ➤ ${global.listasff[id].escuadra2[1] || ' '}
┊👨🏻‍💻 ➤ ${global.listasff[id].escuadra2[2] || ' '}
┊👨🏻‍💻 ➤ ${global.listasff[id].escuadra2[3] || ' '}

⥤ *SUPLENTE:*
┊👨🏻‍💻 ➤ ${global.listasff[id].suplente[0] || ' '}
┊👨🏻‍💻 ➤ ${global.listasff[id].suplente[1] || ' '}
`;

  const buttons = [
    [{ buttonId: 'add_escuadra1', buttonText: { displayText: '⚔️ Escuadra 1' }, type: 1 }],
    [{ buttonId: 'add_escuadra2', buttonText: { displayText: '⚔️ Escuadra 2' }, type: 1 }],
    [{ buttonId: 'add_suplente', buttonText: { displayText: '♻️ Suplente' }, type: 1 }],
    [{ buttonId: 'limpiar_lista', buttonText: { displayText: '🗑️ Limpiar lista' }, type: 1 }],
  ];

  let sent = await conn.sendMessage(id, {
    text: textoInicial,
    buttons: buttons,
    footer: 'BOLILLOBOT | MELDEXZZ.',
    mentions: [m.sender]
  }, { quoted: m });

  global.listasff[id].msgId = sent.key.id;
};

handler.command = /^\\.listaff$/i;
export default handler;
