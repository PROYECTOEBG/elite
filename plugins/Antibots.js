export async function before(m) {
  // Verificación inicial de requisitos
  if (!global.prefix || typeof global.prefix.test !== 'function') {
    console.error('Error: El prefijo no está configurado correctamente');
    return;
  }

  if (!m.text) return; // Si no hay texto, no hacer nada

  // Verificar si el mensaje comienza con el prefijo
  if (!global.prefix.test(m.text)) return;

  try {
    const prefixMatch = global.prefix.exec(m.text);
    if (!prefixMatch) return;
    
    const usedPrefix = prefixMatch[0];
    const fullCommand = m.text.slice(usedPrefix.length).trim();
    const [command, ...args] = fullCommand.split(' ');
    const commandLower = command.toLowerCase();

    // Comando especial "bot" (no hacer nada)
    if (commandLower === "bot") return;

    // Verificar si el comando existe
    if (!isValidCommand(commandLower, global.plugins)) {
      await handleInvalidCommand(m, usedPrefix, fullCommand);
      return;
    }

    // Procesar comando válido
    await processValidCommand(m, usedPrefix, commandLower);
    
  } catch (error) {
    console.error('Error en el manejo del comando:', error);
    await m.reply('《✖》Ocurrió un error al procesar tu comando. Por favor intenta nuevamente.');
  }
}

// Función para validar comandos
function isValidCommand(command, plugins) {
  if (!plugins) return false;
  
  return Object.values(plugins).some(plugin => {
    if (!plugin.command) return false;
    
    const commands = Array.isArray(plugin.command) ? 
                    plugin.command : 
                    [plugin.command];
                    
    return commands.includes(command);
  });
}

// Manejo de comandos inválidos
async function handleInvalidCommand(m, usedPrefix, fullCommand) {
  const commandAttempt = fullCommand.split(' ')[0];
  const similarCommands = findSimilarCommands(commandAttempt, global.plugins);
  
  let replyMessage = `《✖》El comando *${usedPrefix}${commandAttempt}* no existe.`;
  
  if (similarCommands.length > 0) {
    replyMessage += `\n\n¿Quizás quisiste decir:\n${similarCommands
      .map(cmd => `» *${usedPrefix}${cmd}*`)
      .join('\n')}`;
  }
  
  replyMessage += `\n\nEscribe *${usedPrefix}help* para ver todos los comandos disponibles.`;
  
  await m.reply(replyMessage);
}

// Función para encontrar comandos similares (ayuda al usuario)
function findSimilarCommands(inputCommand, plugins, maxSuggestions = 3) {
  if (!plugins) return [];
  
  const allCommands = [];
  Object.values(plugins).forEach(plugin => {
    if (plugin.command) {
      if (Array.isArray(plugin.command)) {
        allCommands.push(...plugin.command);
      } else {
        allCommands.push(plugin.command);
      }
    }
  });
  
  // Eliminar duplicados
  const uniqueCommands = [...new Set(allCommands)];
  
  // Calcular similitud (puedes mejorar este algoritmo)
  return uniqueCommands
    .map(cmd => ({
      command: cmd,
      similarity: calculateSimilarity(inputCommand, cmd)
    }))
    .filter(item => item.similarity > 0.3) // Umbral de similitud
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, maxSuggestions)
    .map(item => item.command);
}

// Función simple para calcular similitud entre strings
function calculateSimilarity(a, b) {
  const longer = a.length > b.length ? a : b;
  const shorter = a.length > b.length ? b : a;
  
  if (longer.includes(shorter)) return 0.8;
  if (shorter.includes(longer)) return 0.5;
  
  // Implementación básica - puedes usar un algoritmo más sofisticado
  let matches = 0;
  for (let i = 0; i < shorter.length; i++) {
    if (longer.includes(shorter[i])) matches++;
  }
  
  return matches / longer.length;
}

// Procesamiento de comandos válidos
async function processValidCommand(m, usedPrefix, command) {
  if (!global.db.data?.chats || !global.db.data?.users) {
    console.error('Error: Estructura de base de datos incompleta');
    return;
  }
  
  const chat = global.db.data.chats[m.chat] || {};
  const user = global.db.data.users[m.sender] || { commands: 0 };
  
  // Verificar si el bot está baneado en el chat
  if (chat.isBanned) {
    const botname = global.botname || "este bot"; // Usar nombre configurado o genérico
    await m.reply(
      `《✖》El bot *${botname}* está desactivado en este grupo.\n\n` +
      `> Un *administrador* puede activarlo con:\n` +
      `> » *${usedPrefix}bot on*`
    );
    return;
  }
  
  // Incrementar contador de comandos del usuario
  user.commands = (user.commands || 0) + 1;
}
