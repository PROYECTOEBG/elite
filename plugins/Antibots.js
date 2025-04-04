// Variable para control de mensajes procesados
const processedMessages = new Set();

export async function before(m) {
  // 1. Verificación básica del mensaje
  if (!m || !m.text || m.isBaileys || m.fromMe) return;

  try {
    // 2. Identificador único del mensaje
    const msgId = `${m.chat}_${m.id}`;
    if (processedMessages.has(msgId)) return;
    processedMessages.add(msgId);

    // 3. Limpieza periódica del registro
    if (processedMessages.size > 100) {
      const array = Array.from(processedMessages);
      processedMessages.clear();
      array.slice(-50).forEach(id => processedMessages.add(id));
    }

    // 4. Configuración de prefijo
    if (!global.prefix) global.prefix = /^[\.\!\#\/]/i;

    // 5. Detección de prefijo mejorada
    const prefixStr = global.prefix.source || global.prefix.toString();
    const prefixRegex = new RegExp(`^(${escapeRegex(prefixStr)})`, 'i');
    const prefixMatch = m.text.match(prefixRegex);
    if (!prefixMatch) return;

    const usedPrefix = prefixMatch[0];
    const fullCmd = m.text.slice(usedPrefix.length).trim();
    const [command] = fullCmd.split(/\s+/);
    const cmd = command?.toLowerCase();

    if (!cmd) return;

    // 6. Comandos especiales que se ignoran
    if (cmd === 'bot') return;

    // 7. Verificación de comando existente (versión robusta)
    const commandExists = await verifyCommandExistence(cmd);
    
    if (!commandExists) {
      await handleNonexistentCommand(m, usedPrefix, cmd);
      return;
    }

    // ... (tu lógica para comandos válidos aquí)

  } catch (error) {
    console.error('Error en before handler:', error);
  }
}

// Función mejorada para verificar comandos
async function verifyCommandExistence(cmd) {
  if (!global.plugins || typeof global.plugins !== 'object') {
    console.error('Error: global.plugins no está definido correctamente');
    return false;
  }

  for (const [name, plugin] of Object.entries(global.plugins)) {
    try {
      if (!plugin || typeof plugin !== 'object') continue;
      
      if (plugin.command) {
        const commands = Array.isArray(plugin.command) 
          ? plugin.command 
          : [plugin.command];
        
        if (commands.some(c => String(c).toLowerCase() === cmd)) {
          return true;
        }
      }
    } catch (e) {
      console.error(`Error verificando plugin ${name}:`, e);
    }
  }
  return false;
}

// Función mejorada para manejar comandos no existentes
async function handleNonexistentCommand(m, prefix, invalidCmd) {
  try {
    // 1. Preparar mención al usuario
    const userMention = m.sender ? `@${m.sender.split('@')[0]}` : 'Usuario';
    
    // 2. Obtener sugerencias relevantes
    const suggestions = await getCommandSuggestions(invalidCmd);
    
    // 3. Construir mensaje de respuesta
    let replyMsg = `❌ *${userMention}, el comando "${prefix}${invalidCmd}" no existe.*\n`;
    
    if (suggestions.length > 0) {
      replyMsg += `\n💡 *Sugerencias:*\n${suggestions.slice(0, 3).map(s => `▸ ${prefix}${s}`).join('\n')}\n`;
    }
    
    replyMsg += `\n📋 Usa *${prefix}help* para ver todos los comandos.`;
    
    // 4. Enviar respuesta con múltiples intentos
    try {
      await m.reply(replyMsg, { mentions: [m.sender] });
    } catch (e) {
      console.error('Error al enviar reply, intentando método alternativo...');
      await this.sendMessage(m.chat, { text: replyMsg }, { quoted: m });
    }
    
  } catch (error) {
    console.error('Error en handleNonexistentCommand:', error);
    // Respuesta mínima de emergencia
    await m.reply(`⚠️ El comando "${prefix}${invalidCmd}" no existe.`);
  }
}

// Función mejorada para sugerencias
async function getCommandSuggestions(wrongCmd, limit = 3) {
  if (!global.plugins) return [];
  
  const commandList = [];
  
  try {
    for (const plugin of Object.values(global.plugins)) {
      if (!plugin?.command) continue;
      
      const commands = Array.isArray(plugin.command) 
        ? plugin.command 
        : [plugin.command];
      
      commandList.push(...commands.filter(c => typeof c === 'string'));
    }
    
    const uniqueCommands = [...new Set(commandList)];
    
    return uniqueCommands
      .filter(c => c.toLowerCase() !== wrongCmd)
      .sort((a, b) => {
        // Priorizar comandos que comienzan igual
        const aStart = a.toLowerCase().startsWith(wrongCmd);
        const bStart = b.toLowerCase().startsWith(wrongCmd);
        if (aStart && !bStart) return -1;
        if (!aStart && bStart) return 1;
        
        // Luego por similitud
        return similarity(b, wrongCmd) - similarity(a, wrongCmd);
      })
      .slice(0, limit);
      
  } catch (e) {
    console.error('Error generando sugerencias:', e);
    return [];
  }
}

// Función de similitud mejorada
function similarity(s1, s2) {
  const longer = s1.length > s2.length ? s1 : s2;
  const shorter = s1.length > s2.length ? s2 : s1;
  
  if (longer.includes(shorter)) return 0.8;
  
  let score = 0;
  for (let i = 0; i < shorter.length; i++) {
    if (longer.includes(shorter[i])) score += 0.2;
  }
  return score;
}

// Función para escapar regex
function escapeRegex(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
