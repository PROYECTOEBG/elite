export async function before(m) {
  // 1. Verificaciones básicas
  if (!m.text) return;
  if (!global.prefix) {
    console.error('Error: No se ha definido global.prefix');
    return;
  }

  // 2. Detección del prefijo
  const prefixRegex = new RegExp(`^(${escapeRegex(global.prefix)})`, 'i');
  if (!prefixRegex.test(m.text)) return;

  // 3. Extraer comando
  const usedPrefix = m.text.match(prefixRegex)[0];
  const [command, ...args] = m.text.slice(usedPrefix.length).trim().split(' ');
  const cmd = command.toLowerCase();

  // 4. Manejo de comandos incorrectos
  if (!isValidCommand(cmd)) {
    return await handleWrongCommand(m, usedPrefix, cmd);
  }

  // 5. Resto de tu lógica original...
  // (Mantén aquí tu código para comandos válidos)
}

// Función auxiliar para escapar regex
function escapeRegex(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Función mejorada para validar comandos
function isValidCommand(cmd) {
  if (!global.plugins) return false;
  
  return Object.values(global.plugins).some(plugin => {
    if (!plugin.command) return false;
    const commands = Array.isArray(plugin.command) ? plugin.command : [plugin.command];
    return commands.includes(cmd);
  });
}

// Manejo mejorado de comandos erróneos
async function handleWrongCommand(m, prefix, wrongCmd) {
  const allCommands = getAllCommands();
  const suggestions = getSuggestions(wrongCmd, allCommands, 3);
  
  let reply = `❌ Comando *"${prefix}${wrongCmd}"* no reconocido.`;
  
  if (suggestions.length > 0) {
    reply += `\n\n¿Quisiste decir?\n${suggestions.map(cmd => `▸ *${prefix}${cmd}*`).join('\n')}`;
  }
  
  reply += `\n\nUsa *${prefix}help* para ver todos los comandos.`;
  
  await m.reply(reply);
}

// Obtener todos los comandos disponibles
function getAllCommands() {
  if (!global.plugins) return [];
  
  const commands = [];
  Object.values(global.plugins).forEach(plugin => {
    if (plugin.command) {
      if (Array.isArray(plugin.command)) {
        commands.push(...plugin.command);
      } else {
        commands.push(plugin.command);
      }
    }
  });
  
  return [...new Set(commands)]; // Eliminar duplicados
}

// Sistema de sugerencias mejorado
function getSuggestions(wrongCmd, allCommands, max = 3) {
  return allCommands
    .filter(cmd => {
      // Coincidencia de inicio
      if (cmd.startsWith(wrongCmd)) return true;
      // Coincidencia de letras
      const wrongChars = wrongCmd.split('');
      return wrongChars.some(c => cmd.includes(c));
    })
    .slice(0, max);
                                     }
