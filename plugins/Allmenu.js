import pkg from '@whiskeysockets/baileys';
const { generateWAMessageFromContent, proto } = pkg;

let listas = {
  squad1: ['➤', '➤', '➤', '➤'],
  squad2: ['➤', '➤', '➤', '➤'],
  suplente: ['✔', '✔', '✔']
};

const handler = async (m, { conn }) => {
  await enviarLista(conn, m.chat);
};

async function enviarLista(conn, chatId, user = null, tipo = null) {
  // Añadir usuario si se especifica escuadra
  if (user && tipo) {
    let lista = listas[tipo];
    let index = lista.findIndex(x => x === '➤' || x === '✔');
    if (index !== -1) lista[index] = `@${user.split('@')[0]}`;
  }

  const texto =
`*MODALIDAD:* CLK  
*ROPA:* verde

*Escuadra 1:*  
${listas.squad1.map(p => `➡ ${p}`).join('\n')}

*Escuadra 2:*  
${listas.squad2.map(p => `➡ ${p}`).join('\n')}

*SUPLENTE:*  
${listas.suplente.map(p => `➡ ${p}`).join('\n')}

*BOLLLOBOT / MELDEXZZ.*`;

  const mensaje = generateWAMessageFromContent(chatId, {
    viewOnceMessage: {
      message: {
        messageContextInfo: { deviceListMetadata: {} },
        interactiveMessage: proto.Message.InteractiveMessage.create({
          body: { text: texto },
          footer: { text: "Selecciona una opción:" },
          nativeFlowMessage: {
            buttons: [
              { name: "quick_reply", buttonParamsJson: JSON.stringify({ display_text: "Escuadra 1", id: "squad1" }) },
              { name: "quick_reply", buttonParamsJson: JSON.stringify({ display_text: "Escuadra 2", id: "squad2" }) },
              { name: "quick_reply", buttonParamsJson: JSON.stringify({ display_text: "Suplente", id: "suplente" }) },
              { name: "quick_reply", buttonParamsJson: JSON.stringify({ display_text: "Limpiar lista", id: "limpiar" }) }
            ]
          }
        })
      }
    }
  }, {});

  // Guardamos el ID del mensaje para poder responderlo (opcional)
  await conn.relayMessage(chatId, mensaje.message, { messageId: mensaje.key.id });
}

export async function after(m, { conn }) {
  if (!m.message?.buttonsResponseMessage) return;

  const seleccion = m.message.buttonsResponseMessage.selectedButtonId;
  const user = m.sender;

  if (seleccion === 'limpiar') {
    listas = {
      squad1: ['➤', '➤', '➤', '➤'],
      squad2: ['➤', '➤', '➤', '➤'],
      suplente: ['✔', '✔', '✔']
    };
    return conn.sendMessage(m.chat, { text: `♻️ Listas reiniciadas por @${user.split('@')[0]}`, mentions: [user] });
  }

  // Actualizar lista y reenviar mensaje con botones
  await enviarLista(conn, m.chat, user, seleccion);

  // Mensaje informativo
  await conn.sendMessage(m.chat, {
    text: `✅ @${user.split('@')[0]} fue agregado a *${seleccion.replace('squad', 'Escuadra ').replace('suplente', 'Suplente')}*`,
    mentions: [user]
  }, { quoted: m });
}

handler.command = /^(listaff)$/i;
export default handler;
