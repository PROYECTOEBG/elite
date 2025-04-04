const commandCache = new Map();
const processedMessages = new Set();
const CACHE_TTL = 300000; // 5 minutos de caché

export async function before(m) {
  // 1. Filtrado estricto de mensajes
  if (!m?.text || typeof m.text !== 'string' || m.isBaileys || m.fromMe) return;

  // 2. Control de mensajes duplicados
  const msgKey = `${m.chat}_${m.id}_${m.text.slice(0, 15)}`;
  if (processedMessages.has(msgKey)) return;
  processedMessages.add(msgKey);

  // 3. Limpieza periódica
  if (processedMessages.size > 100) {
    const recent = Array.from(processedMessages).slice(-50);
    processedMessages.clear();
    recent.forEach(id => processedMessages.add(id));
  }

  try {
    // 4. Configuración del prefijo
    const prefix = global.prefix instanceof RegExp ? global.prefix : /^[\.\!\#\/]/i;

    // 5. Extracción del comando
    const prefixMatch = m.text.match(prefix);
    if (!prefixMatch) return;
    
    const usedPrefix = prefixMatch[0];
    const cmd = m.text.slice(usedPrefix.length).trim().split(/\s+/)[0]?.toLowerCase();
    if (!cmd) return;

    // 6. Comandos especiales silenciados
    if (cmd === 'bot') return;

    // 7. Verificación de existencia del comando
    const exists = commandCache.has(cmd) ? 
                  commandCache.get(cmd) : 
                  await checkCommandExistence(cmd);
    
    if (!exists) {
      await sendInvalidCommandResponse(m, usedPrefix, cmd);
      return;
    }

    // 8. IMPORTANTE: No responder a comandos válidos aquí
    // Los comandos válidos deben ser manejados por sus handlers específicos
    return;

  } catch (error) {
    console.error('Error en before handler:', error);
  }
}

async function checkCommandExistence(cmd) {
  if (!global.plugins || typeof global.plugins !== 'object') {
    console.error('Error: global.plugins no está definido correctamente');
    return false;
  }
  
  let exists = false;
  
  for (const plugin of Object.values(global.plugins)) {
    try {
      if (!plugin?.command) continue;
      
      const commands = Array.isArray(plugin.command) ?
        plugin.command.map(String) :
        [String(plugin.command)];
      
      if (commands.some(c => c.toLowerCase() === cmd)) {
        exists = true;
        break;
      }
    } catch (e) {
      console.error('Error verificando plugin:', e);
    }
  }

  commandCache.set(cmd, exists);
  setTimeout(() => commandCache.delete(cmd), CACHE_TTL);
  return exists;
}

async function sendInvalidCommandResponse(m, prefix, invalidCmd) {
  const MAX_ATTEMPTS = 3;
  let attempts = 0;
  
  const userMention = m.sender ? `@${m.sender.split('@')[0]}` : 'Usuario';
  const responseText = `✦ ¡Hey! *${userMention}*\n\n` +
                      `Parece que escribiste mal el comando verifica si está bien escrito e intenta de nuevo.\n\n` +
                      `©EliteBotGlobal 2023`;

  while (attempts < MAX_ATTEMPTS) {
    try {
      attempts++;
      
      if (attempts === 1) {
        await m.reply(responseText, { mentions: [m.sender] });
      } else if (attempts === 2) {
        await m.reply(responseText);
      } else {
        await this.sendMessage(m.chat, { text: responseText }, { quoted: m });
      }
      return; // Si tiene éxito, salir
      
    } catch (error) {
      console.error(`Intento ${attempts} fallido. Error:`, error);
      if (attempts >= MAX_ATTEMPTS) {
        console.error('No se pudo enviar respuesta de comando inválido');
      }
    }
  }
}
