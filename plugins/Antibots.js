export async function before(m) {
  try {
    // 1. Configuración esencial
    if (!global.prefix) global.prefix = /^[.!?#/]|^bot/i; // Prefijo por defecto
    if (!global.plugins) global.plugins = {};
    if (!global.db.data) global.db.data = { chats: {}, users: {} };

    // 2. Validación básica del mensaje
    if (!m.text || typeof m.text !== 'string') return;
    
    // 3. Detección del prefijo mejorado
    const prefixMatch = m.text.match(global.prefix);
    if (!prefixMatch) return;
    const usedPrefix = prefixMatch[0];

    // 4. Extracción del comando
    const fullCmd = m.text.slice(usedPrefix.length).trim();
    const [command, ...args] = fullCmd.split(/\s+/);
    const cmd = command.toLowerCase();

    // 5. Comandos especiales (como 'bot')
    if (cmd === 'bot') return;

    // 6. Sistema de comandos mejorado
    const commandHandler = {
      exists: checkCommandExists(cmd),
      suggestions: getCommandSuggestions(cmd),
      execute: async () => {
        // Tu lógica para comandos válidos aquí
        if (!global.db.data.chats[m.chat]) {
          global.db.data.chats[m.chat] = {};
        }
        if (!global.db.data.users[m.sender]) {
          global.db.data.users[m.sender] = { commands: 0 };
        }

        const chat = global.db.data.chats[m.chat];
        const user = global.db.data.users[m.sender];

        if (chat.isBanned) {
          await m.reply(
            `🚫 El bot está desactivado en este grupo.\n` +
            `Un administrador puede activarlo con:\n` +
            `» ${usedPrefix}bot on`
          );
          return;
        }

        user.commands = (user.commands || 0) + 1;
      }
    };

    // 7. Manejo de comandos inválidos
    if (!commandHandler.exists) {
      let reply = `❌ *Comando no reconocido:* ${usedPrefix}${cmd}\n`;
      
      if (commandHandler.suggestions.length > 0) {
        reply += `\n¿Quizás quisiste decir?\n` +
          commandHandler.suggestions.map(s => `› ${usedPrefix}${s}`).join('\n');
      }
      
      reply += `\nEscribe *${usedPrefix}help* para ver todos los comandos.`;
      
      await m.reply(reply);
      return;
    }

    // 8. Ejecutar comando válido
    await commandHandler.execute();

  } catch (error) {
    console.error('Error en before handler:', error);
    // Opcional: Notificar al usuario del error
    await m.reply('⚠️ Ocurrió un error al procesar tu comando. Por favor intenta nuevamente.');
  }
}

// Funciones auxiliares mejoradas
function checkCommandExists(cmd) {
  return Object.values(global.plugins).some(plugin => {
    if (!plugin.command) return false;
    const commands = Array.isArray(plugin.command) ? plugin.command : [plugin.command];
    return commands.some(c => c.toLowerCase() === cmd);
  });
}

function getCommandSuggestions(wrongCmd, limit = 3) {
  const allCommands = [];
  Object.values(global.plugins).forEach(plugin => {
    if (plugin.command) {
      const cmds = Array.isArray(plugin.command) ? plugin.command : [plugin.command];
      allCommands.push(...cmds);
    }
  });

  // Algoritmo de sugerencia mejorado
  return [...new Set(allCommands)]
    .filter(c => c.toLowerCase() !== wrongCmd)
    .sort((a, b) => {
      // Priorizar comandos que comienzan igual
      const aStart = a.toLowerCase().startsWith(wrongCmd);
      const bStart = b.toLowerCase().startsWith(wrongCmd);
      if (aStart && !bStart) return -1;
      if (!aStart && bStart) return 1;
      
      // Luego por similitud de letras
      const aSim = stringSimilarity(wrongCmd, a.toLowerCase());
      const bSim = stringSimilarity(wrongCmd, b.toLowerCase());
      return bSim - aSim;
    })
    .slice(0, limit);
}

// Función de similitud de strings mejorada
function stringSimilarity(a, b) {
  const longer = a.length > b.length ? a : b;
  const shorter = a.length > b.length ? b : a;
  let score = 0;

  // Coincidencia al inicio
  if (longer.startsWith(shorter)) return 0.8;
  
  // Coincidencia de caracteres
  for (let i = 0; i < shorter.length; i++) {
    if (longer.includes(shorter[i])) score += 0.1;
  }

  return score;
}
