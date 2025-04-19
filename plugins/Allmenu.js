let handler = async (m, { conn }) => {
  let templateButtons = [
    { index: 1, quickReplyButton: { displayText: "Botón 1", id: "boton_1" }},
    { index: 2, quickReplyButton: { displayText: "Botón 2", id: "boton_2" }},
    { index: 3, quickReplyButton: { displayText: "Botón 3", id: "boton_3" }},
  ];

  const buttonMessage = {
    text: "Probando botones clásicos...",
    footer: "¿Funcionan estos?",
    templateButtons: templateButtons
  };

  await conn.sendMessage(m.chat, buttonMessage, { quoted: m });
};

handler.command = /^\\.probando$/i;
export default handler;
