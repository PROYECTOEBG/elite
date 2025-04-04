// Variable para controlar respuestas duplicadas
let commandCooldown = new Set();

export async function before(m) {
  try {
    // 1. Verificación básica del mensaje
    if (!m?.text || typeof m.text !== 'string' || m.isBaileys) return;
    
    // 2. Configuración mínima esencial
    if (!global.prefix) global.prefix = /^[\.\!\#\/]/i;
    if (!global.plugins) global.plugins = {};
    
    // 3. Prevenir respuestas duplicadas
    const messageKey = `${m.chat}_${m.id}`;
    if (commandCooldown.has(messageKey)) return;
    commandCooldown.add(messageKey);
    
    // 4. Limpieza periódica del cooldown
    if (commandCooldown.size > 100) {
      commandCooldown = new Set([...commandCooldown].slice(50));
    }

    // 5. Detección de prefijo
    const prefixRegex = new RegExp(`^(${escapeRegex(global.prefix.source || global.prefix)})`, 'i');
    const prefixMatch = m.text.match(prefixRegex);
    if (!prefixMatch) return;
    
    const usedPrefix = prefixMatch[0];
    const fullCmd = m.text.slice(usedPrefix.length).trim();
    const [command] = fullCmd.split(/\s+/);
    const cmd = command?.toLowerCase();
    
    if (!cmd) return;

    // 6. Manejo de comandos especiales
    if (cmd === 'bot') return;

    // 7. Verificación de comando existente
    const commandExists = checkCommandExists(cmd);
    
    if (!commandExists) {
      return await handleInvalidCommand(m, usedPrefix, cmd);
    }

    // ... (tu lógica normal para comandos válidos aquí)

  } catch (error) {
    console.error('Error en before handler:', error);
  }
}

// Función mejorada para manejar comandos inválidos
async function handleInvalidCommand(m, prefix, invalidCmd) {
  try {
    const userMention = m.sender ? `@${m.sender.split('@')[0]}` : 'Usuario';
    const suggestions = getCommandSuggestions(invalidCmd);
    
    let replyMsg = `📛 *${userMention}, el comando no existe:* \`${prefix}${invalidCmd}\``;
    
    if (suggestions.length > 0) {
      replyMsg += `\n\n💡 ¿Quizás quisiste decir?\n${suggestions.map(s => `› \`${prefix}${s}\``).join('\n')}`;
    }
    
    replyMsg += `\n\n📌 Usa *${prefix}help* para ver la lista completa.`;
    
    await m.reply(replyMsg, { mentions: [m.sender] });
    
  } catch (error) {
    console.error('Error al manejar comando inválido:', error);
    // Respuesta mínima si falla todo
    await m.reply(`❌ El comando *${prefix}${invalidCmd}* no existe.`);
  }
}

// Función para verificar comandos
function checkCommandExists(cmd) {
  if (!global.plugins || typeof global.plugins !== 'object') return false;
  
  return Object.values(global.plugins).some(plugin => {
    if (!plugin?.command) return false;
    
    const commands = Array.isArray(plugin.command) 
      ? plugin.command 
      : [plugin.command];
      
    return commands.some(c => c.toLowerCase() === cmd);
  });
}

// Función para sugerencias de comandos
function getCommandSuggestions(wrongCmd, limit = 3) {
  if (!global.plugins) return [];
  
  const allCommands = [];
  Object.values(global.plugins).forEach(plugin => {
    if (plugin?.command) {
      const cmds = Array.isArray(plugin.command) 
        ? plugin.command 
        : [plugin.command];
      allCommands.push(...cmds.filter(c => typeof c === 'string'));
    }
  });

  return [...new Set(allCommands)]
    .filter(c => c.toLowerCase() !== wrongCmd)
    .sort((a, b) => {
      const aMatch = a.toLowerCase().startsWith(wrongCmd);
      const bMatch = b.toLowerCase().startsWith(wrongCmd);
      if (aMatch && !bMatch) return -1;
      if (!aMatch && bMatch) return 1;
      return 0;
    })
    .slice(0, limit);
}

// Función auxiliar para escapar regex
function escapeRegex(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
