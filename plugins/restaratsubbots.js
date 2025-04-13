const handler = async (m, { conn, isROwner, text }) => {
  if (!process.send) throw '❌ Este comando solo funciona con: node index.js';

  // Mensaje de confirmación
  const { key } = await conn.sendMessage(m.chat, { text: `⚡ *Reinicio Automático de SubBots* ⚡\n\nSe reiniciarán los SubBots (GataJadiBot) cada 1 minuto.` }, { quoted: m });
  
  // Iniciar el reinicio automático
  startAutoRestart(conn, m.chat, key);
};

// Función para reinicio automático cada 1 minuto
function startAutoRestart(conn, chatId, originalMsgKey) {
  let intervalId = setInterval(async () => {
    try {
      // Mensaje de estado antes del reinicio
      await conn.sendMessage(chatId, { text: `🔄 *Reiniciando SubBots (GataJadiBot)...*`, edit: originalMsgKey });
      
      // Forzar el reinicio (simulado con process.exit, pero deberías usar un método específico para SubBots)
      process.exit(0); // Esto reiniciará el proceso actual (ajusta según tu sistema de SubBots)
      
    } catch (error) {
      console.error('Error en el reinicio automático:', error);
      await conn.sendMessage(chatId, { text: `❌ *Error al reiniciar SubBots*`, edit: originalMsgKey });
    }
  }, 60 * 1000); // 60,000 ms = 1 minuto

  // Guardar el intervalo para posible limpieza
  global.subBotsRestartInterval = intervalId;
}

// Comando para detener el reinicio automático (opcional)
const stopHandler = async (m, { conn }) => {
  if (global.subBotsRestartInterval) {
    clearInterval(global.subBotsRestartInterval);
    await conn.sendMessage(m.chat, { text: `✋ *Reinicio automático detenido*` });
  } else {
    await conn.sendMessage(m.chat, { text: `⚠️ *No hay reinicio automático en curso*` });
  }
};

handler.help = ['autorestart'];
handler.tags = ['owner'];
handler.command = ['autorestart', 'autoreinicio'];
handler.owner = true;

export default handler;

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
