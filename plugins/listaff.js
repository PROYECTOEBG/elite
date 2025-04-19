import pkg from '@whiskeysockets/baileys';
const { generateWAMessageFromContent, proto } = pkg;

// Estado global de las listas
const listas = {
  squad1: ['➢', '➢', '➢', '➢'],
  squad2: ['➢', '➢', '➢', '➢'],
  suplente: ['✔', '✔', '✔']
};

let handler = async (m, { conn }) => {
  try {
    const msgText = (m.text || '').toLowerCase().trim();
    
    // Manejo del comando "escuadra 1"
    if (msgText === 'escuadra 1') {
      await handleSquadRequest(conn, m, 'squad1');
      return;
    }
    
    // Mostrar lista normal si no es un comando específico
    await enviarLista(conn, m.chat);
  } catch (error) {
    console.error('Error en handler:', error);
    await conn.sendMessage(m.chat, { text: '❌ Ocurrió un error al procesar tu solicitud' });
  }
};

// Función para manejar solicitudes de escuadra
async function handleSquadRequest(conn, m, squadType) {
  const usuario = m.sender.split('@')[0];
  const tag = m.sender;
  const squadName = squadType === 'squad1' ? 'Escuadra 1' : squadType === 'squad2' ? 'Escuadra 2' : 'Suplente';
  
  // Buscar espacio libre
  const libre = listas[squadType].findIndex(p => p === '➢' || p === '✔');
  
  if (libre !== -1) {
    listas[squadType][libre] = `@${usuario}`;
    await conn.sendMessage(m.chat, {
      text: `✅ @${usuario} agregado a ${squadName}`,
      mentions: [tag]
    });
    await enviarLista(conn, m.chat);
  } else {
    await conn.sendMessage(m.chat, {
      text: `⚠️ ${squadName} está llena`,
      mentions: [tag]
    });
  }
}

// Función para enviar la lista interactiva
async function enviarLista(conn, chatId, usuario = null, tipo = null, tag = null) {
  try {
    // Actualizar lista si se proporciona usuario
    if (usuario && tipo) {
      const libre = listas[tipo].findIndex(p => p === '➢' || p === '✔');
      if (libre !== -1) listas[tipo][libre] = `@${usuario}`;
    }

    const texto = 
`*MODALIDAD:* CLK  
*ROPA:* verde  

*Escuadra 1:*  
${listas.squad1.map(p => `➡ ${p}`).join('\n')}  

*Escuadra 2:*  
${listas.squad2.map(p => `➡ ${p}`).join('\n')}  

*SUPLENTE:*  
${listas.suplente.map(p => `➡ ${p}`).join('\n')}`;

    const buttons = [
      {
        name: "quick_reply",
        buttonParamsJson: JSON.stringify({
          display_text: "Escuadra 1",
          id: "escuadra 1"
        })
      },
      {
        name: "quick_reply",
        buttonParamsJson: JSON.stringify({
          display_text: "Escuadra 2",
          id: "escuadra 2"
        })
      },
      {
        name: "quick_reply",
        buttonParamsJson: JSON.stringify({
          display_text: "Suplente",
          id: "suplente"
        })
      },
      {
        name: "quick_reply",
        buttonParamsJson: JSON.stringify({
          display_text: "Limpiar lista",
          id: "limpiar lista"
        })
      }
    ];

    const mensaje = generateWAMessageFromContent(chatId, {
      viewOnceMessage: {
        message: {
          messageContextInfo: { deviceListMetadata: {} },
          interactiveMessage: proto.Message.InteractiveMessage.create({
            body: { text: texto },
            footer: { text: "Selecciona una opción:" },
            nativeFlowMessage: { buttons }
          })
        }
      }
    }, {});

    await conn.relayMessage(chatId, mensaje.message, { messageId: mensaje.key.id });

    // Confirmación adicional si se agregó usuario
    if (usuario && tag) {
      await conn.sendMessage(chatId, {
        text: `✅ @${usuario} agregado a ${tipo === 'squad1' ? 'Escuadra 1' : tipo === 'squad2' ? 'Escuadra 2' : 'Suplente'}`,
        mentions: [tag]
      });
    }
  } catch (error) {
    console.error('Error en enviarLista:', error);
    throw error;
  }
}

// Manejo de respuestas a botones
export async function after(m, { conn }) {
  try {
    const button = m?.message?.buttonsResponseMessage;
    if (!button) return;

    const id = button.selectedButtonId;
    const numero = m.sender.split('@')[0];
    const tag = m.sender;

    if (id === 'limpiar lista') {
      listas = {
        squad1: ['➢', '➢', '➢', '➢'],
        squad2: ['➢', '➢', '➢', '➢'],
        suplente: ['✔', '✔', '✔']
      };
      await conn.sendMessage(m.chat, {
        text: `♻️ Listas reiniciadas por @${numero}`,
        mentions: [tag]
      }, { quoted: m });
    } else {
      await handleSquadRequest(conn, m, id === 'escuadra 1' ? 'squad1' : id === 'escuadra 2' ? 'squad2' : 'suplente');
    }
  } catch (error) {
    console.error('Error en after:', error);
    await conn.sendMessage(m.chat, { text: '❌ Error al procesar tu selección' });
  }
}

handler.command = /^(listaff|lista)$/i;
handler.tags = ['main'];

export { listas };
export default handler;
