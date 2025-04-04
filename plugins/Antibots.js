const handler = async (m, { conn, command }) => {
  // Verifica si el mensaje fue un comando que no está en la base de datos
  const validCommands = ['comando1', 'comando2', 'comando3']; // Aquí agrega los comandos válidos
  
  // Identificar al usuario que escribió el comando
  const who = m.mentionedJid && m.mentionedJid[0] || m.sender;

  // Verificar si el comando existe en los comandos válidos
  if (!validCommands.includes(command)) {
    // Enviar mensaje si el comando no existe y etiquetar al usuario
    await conn.sendMessage(m.chat, {
      text: `👋 *Hola humano @${who.split('@')[0]}*!\nEste comando no existe en mi base de datos, por favor verifica si escribiste bien. Si necesitas ayuda, usa el comando *#menu* para ver los comandos disponibles.`,
      mentions: [who], // Etiquetar al usuario que cometió el error
    });
  }
};

// Aquí se deben agregar los comandos válidos que el bot podrá reconocer
handler.help = ['comando1', 'comando2', 'comando3']; 
handler.tags = ['general'];
handler.command = /^(comando1|comando2|comando3)$/i; // Los comandos válidos que el bot puede reconocer

export default handler;
