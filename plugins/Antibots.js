export async function before(m) {
  // 1. Configuración mínima esencial
  if (!global.prefix) global.prefix = /^[\.\!\#\/]/i; // Prefijo por defecto
  
  // 2. Verificación básica del mensaje
  if (!m?.text || typeof m.text !== 'string') return;

  // 3. Detección de prefijo mejorada
  const prefixRegex = new RegExp(`^(${escapeRegex(global.prefix.source || global.prefix)})`, 'i');
  const prefixMatch = m.text.match(prefixRegex);
  if (!prefixMatch) return;
  
  const usedPrefix = prefixMatch[0];
  const fullCmd = m.text.slice(usedPrefix.length).trim();
  const [command, ...args] = fullCmd.split(/\s+/);
  const cmd = command.toLowerCase();

  // 4. Comandos especiales que no deben generar respuesta
  if (cmd === 'bot') return;

  // 5. Verificación de comando existente (FUNCIÓN CLAVE MEJORADA)
  const commandExists = checkCommandExists(cmd);
  
  if (!commandExists) {
    // 6. MANEJO DE COMANDOS MAL ESCRITOS (VERSIÓN MEJORADA)
    const userName = m.pushName || 'Usuario';
    const userMention = m.sender ? `@${m.sender.split('@')[0]}` : userName;
    
    const suggestions = getCommandSuggestions(cmd);
    let replyMessage = `📛 *${userMention}, el comando no existe:* \`${usedPrefix}${cmd}\``;
    
    if (suggestions.length > 0) {
      replyMessage += `\n\n🔍 ¿Quizás quisiste decir?\n${suggestions.map(s => `• \`${usedPrefix}${s}\``).join('\n')}`;
    }
    
    replyMessage += `\n\n📌 Usa \`${usedPrefix}help\` para ver todos los comandos disponibles.`;
    
    try {
      await m.reply(replyMessage, { mentions: [m.sender] });
    } catch (error) {
      console.error('Error al responder a comando mal escrito:', error);
      // Respuesta alternativa si falla el reply
      await this.sendMessage(m.chat, { text: replyMessage }, { quoted: m });
    }
    return;
  }

  // ... (Aquí continúa tu lógica para comandos válidos)
}

// FUNCIÓN MEJORADA PARA VERIFICAR COMANDOS
function checkCommandExists(cmd) {
  if (!global.plugins || typeof global.plugins !== 'object') {
    console.error('Error: global.plugins no está definido o no es un objeto');
    return false;
  }
  
  return Object.values(global.plugins).some(plugin => {
    if (!plugin || typeof plugin !== 'object') return false;
    if (!plugin.command) return false;
    
    const commands = Array.isArray(plugin.command) 
      ? plugin.command 
      : [plugin.command];
      
    return commands.some(c => c.toLowerCase() === cmd);
  });
}

// FUNCIÓN MEJORADA PARA SUGERENCIAS
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

// Función de similitud mejorada
function stringSimilarity(a, b) {
  const longer = a.length > b.length ? a : b;
  const shorter = a.length > b.length ? b : a;
  
  // Coincidencia exacta al inicio
  if (longer.startsWith(shorter)) return 1.0;
  
  // Coincidencia de subcadenas
  if (longer.includes(shorter)) return 0.8;
  
  // Coincidencia de caracteres
  const commonChars = [...shorter].filter(c => longer.includes(c)).length;
  return commonChars / longer.length;
}

// Función auxiliar para escapar regex
function escapeRegex(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
