const handler = async (m, { conn, command, text }) => {
  // Lista de comandos válidos
  const validCommands = ['comando1', 'comando2', 'comando3']; // Agrega aquí los comandos válidos que el bot debe reconocer

  // Si el comando no está en la lista de comandos válidos
  if (!validCommands.includes(command)) {
    const who = m.mentionedJid && m.mentionedJid[0] || m.sender; // Identifica al usuario que envió el mensaje

    // Enviar mensaje con etiquetado al usuario
    await conn.sendMessage(m.chat, {
      text: `👋 *Hola humano @${who.split('@')[0]}*!\nEste comando no existe en mi base de datos, por favor verifica si escribiste bien. Si necesitas ayuda, usa el comando *#menu* para ver los comandos disponibles.`,
      mentions: [who], // Etiquetar al usuario que cometió el error
    });
  }
};

handler.help = ['comando1', 'comando2', 'comando3']; // Lista de comandos válidos
handler.tags = ['general'];
handler.command = /^(comando1|comando2|comando3)$/i; // Comandos válidos que el bot debe reconocer

export default handler;
