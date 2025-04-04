const handler = async (m, { conn, command }) => {
  // Verifica si el mensaje fue un comando que no está en la base de datos
  const validCommands = ['comando1', 'comando2', 'comando3']; // Aquí agrega los comandos válidos
  const who = m.mentionedJid && m.mentionedJid[0] || m.sender; // Identificar al usuario que envió el mensaje
  
  if (!validCommands.includes(command)) {
    // Enviar mensaje si el comando no existe y etiquetar al usuario
    await conn.sendMessage(m.chat, {
      text: `👋 *Hola humano @${who.split('@')[0]}*!\nEste comando no existe en mi base de datos, por favor verifica si escribiste bien. Si necesitas ayuda, usa el comando *#menu* para ver los comandos disponibles.`,
      mentions: [who], // Etiquetar al usuario que cometió el error
    });
  }
};

handler.help = ['comando1', 'comando2', 'comando3']; // Lista de comandos válidos
handler.tags = ['general'];
handler.command = /^(comando1|comando2|comando3)$/i; // Comandos válidos que el bot puede reconocer

export default handler;
