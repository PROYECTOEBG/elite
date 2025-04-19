import pkg from '@whiskeysockets/baileys';
const { generateWAMessageFromContent, proto } = pkg;

// Estado global simplificado
let squad1 = ['➢', '➢', '➢', '➢'];

const handler = async (m, { conn }) => {
  const msgText = (m.text || '').toLowerCase().trim();
  const user = m.sender.split('@')[0];
  
  // Comando básico para escuadra 1
  if (msgText === 'escuadra 1') {
    const emptySlot = squad1.findIndex(slot => slot === '➢');
    
    if (emptySlot !== -1) {
      squad1[emptySlot] = `@${user}`;
      
      // Enviar confirmación directa
      await conn.sendMessage(m.chat, {
        text: `✅ @${user} agregado a Escuadra 1 (posición ${emptySlot + 1})`,
        mentions: [m.sender]
      });
      
      // Mostrar lista actualizada
      await showUpdatedList(conn, m.chat);
    } else {
      await conn.sendMessage(m.chat, {
        text: '⚠️ Escuadra 1 está llena',
        mentions: [m.sender]
      });
    }
    return;
  }
  
  // Mostrar lista por defecto
  await showUpdatedList(conn, m.chat);
};

// Función simplificada para mostrar lista
async function showUpdatedList(conn, chatId) {
  const listText = `*ESCUADRA 1:*\n${squad1.map((p, i) => `${i+1}. ${p}`).join('\n')}`;
  
  await conn.sendMessage(chatId, {
    text: listText,
    footer: 'Escribe "escuadra 1" para unirte',
    mentions: []
  });
}

// Manejo de botones (versión mínima)
export async function after(m, { conn }) {
  const button = m?.message?.buttonsResponseMessage;
  if (button && button.selectedButtonId === 'reset') {
    squad1 = ['➢', '➢', '➢', '➢'];
    await conn.sendMessage(m.chat, { text: '♻️ Lista reiniciada' });
    await showUpdatedList(conn, m.chat);
  }
}

handler.command = /^listaff$/i;
export default handler;
