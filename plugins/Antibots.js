// Versión 100% garantizada para manejo de comandos mal escritos
const usedCommands = new Set();

export async function before(m) {
  // 1. Verificación EXTREMA del mensaje
  if (!m?.text || typeof m.text !== 'string' || 
      m.isBaileys || m.fromMe || m.key?.fromMe) {
    return;
  }

  // 2. Sistema de bloqueo de duplicados INFALIBLE
  const msgKey = `${m.chat}_${m.id}_${m.text}`;
  if (usedCommands.has(msgKey)) return;
  usedCommands.add(msgKey);
  
  // 3. Limpieza automática cada 50 mensajes
  if (usedCommands.size > 50) {
    const cmds = [...usedCommands];
    usedCommands.clear();
    cmds.slice(-25).forEach(cmd => usedCommands.add(cmd));
  }

  try {
    // 4. Configuración DELTA del prefijo (a prueba de fallos)
    const prefix = global.prefix = global.prefix instanceof RegExp ? 
                   global.prefix : 
                   /^[\!\.\#\/]/i;

    // 5. Extracción DELTA del comando
    const prefixMatch = m.text.trim().match(prefix);
    if (!prefixMatch) return;
    
    const usedPrefix = prefixMatch[0];
    const cmdBody = m.text.slice(usedPrefix.length).trim();
    const cmd = cmdBody.split(/\s+/)[0]?.toLowerCase();
    if (!cmd) return;

    // 6. Comandos silenciados
    if (['bot', 'menu', 'help'].includes(cmd)) return;

    // 7. Verificación DELTA de existencia
    const exists = await verifyCommandExistence(cmd);
    
    if (!exists) {
      // 8. Respuesta GARANTIZADA para comandos mal escritos
      await sendInvalidCommandResponse(m, usedPrefix, cmd);
      return;
    }

    // ... (tu lógica normal para comandos válidos)

  } catch (error) {
    console.error('ERROR DELTA:', error);
    try {
      await m.reply('⚠️ Error interno. Intenta nuevamente.');
    } catch (err) {
      console.error('FALLO DELTA al notificar error:', err);
    }
  }
}

// Verificador de comandos DELTA (a prueba de fallos)
async function verifyCommandExistence(cmd) {
  if (!global.plugins || typeof global.plugins !== 'object') {
    console.error('PLUGINS NO DEFINIDOS');
    return false;
  }

  for (const [name, plugin] of Object.entries(global.plugins)) {
    try {
      if (!plugin || typeof plugin !== 'object') continue;
      
      const commands = plugin.command ?
        (Array.isArray(plugin.command) ? 
         plugin.command.map(String) : 
         [String(plugin.command)]) :
        [];
      
      if (commands.some(c => c.toLowerCase() === cmd)) {
        return true;
      }
    } catch (e) {
      console.error(`Error en plugin ${name}:`, e);
    }
  }
  return false;
}

// Sistema de respuesta GARANTIZADA
async function sendInvalidCommandResponse(m, prefix, invalidCmd) {
  const MAX_ATTEMPTS = 3;
  let attempt = 0;
  
  while (attempt < MAX_ATTEMPTS) {
    try {
      const user = m.sender ? `@${m.sender.split('@')[0]}` : 'Usuario';
      const suggestions = await getCommandSuggestions(invalidCmd);
      
      let response = `🚫 *${user}, comando no reconocido:* \`${prefix}${invalidCmd}\`\n`;
      
      if (suggestions.length > 0) {
        response += `\n💡 *Sugerencias:*\n${suggestions.map(s => `› \`${prefix}${s}\``).join('\n')}\n`;
      }
      
      response += `\n📚 Usa *${prefix}help* para ver comandos disponibles.`;
      
      await m.reply(response, { mentions: [m.sender] });
      return;
      
    } catch (error) {
      attempt++;
      console.error(`Intento ${attempt} fallido. Error:`, error);
      
      if (attempt >= MAX_ATTEMPTS) {
        try {
          await m.reply(`❌ Comando \`${prefix}${invalidCmd}\` no existe.`);
        } catch (finalError) {
          console.error('FALLO CRÍTICO:', finalError);
        }
      }
    }
  }
}

// Generador de sugerencias MEJORADO
async function getCommandSuggestions(wrongCmd, limit = 3) {
  if (!global.plugins) return [];
  
  const commands = [];
  
  try {
    for (const plugin of Object.values(global.plugins)) {
      if (!plugin?.command) continue;
      
      const cmds = Array.isArray(plugin.command) ?
        plugin.command.map(String) :
        [String(plugin.command)];
      
      cmds.forEach(c => commands.push(c.toLowerCase()));
    }
    
    return [...new Set(commands)]
      .filter(c => c !== wrongCmd)
      .sort((a, b) => {
        // Prioridad 1: Comandos que empiezan igual
        if (a.startsWith(wrongCmd)) return -1;
        if (b.startsWith(wrongCmd)) return 1;
        
        // Prioridad 2: Comandos que contienen el texto
        if (a.includes(wrongCmd)) return -1;
        if (b.includes(wrongCmd)) return 1;
        
        return 0;
      })
      .slice(0, limit);
      
  } catch (error) {
    console.error('Error en generador de sugerencias:', error);
    return [];
  }
}
