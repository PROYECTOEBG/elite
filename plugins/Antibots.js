const processedMessages = new Map();
const MAX_HISTORY = 100;

export async function before(m) {
  // 1. Verificación ultra-estricta
  if (!m?.text || typeof m.text !== 'string' || m.isBaileys || m.fromMe) return;

  // 2. Sistema anti-duplicados reforzado
  const msgKey = `${m.chat}_${m.id}_${m.text}`;
  if (processedMessages.has(msgKey)) return;
  processedMessages.set(msgKey, true);

  // 3. Limpieza automática
  if (processedMessages.size > MAX_HISTORY) {
    const half = Math.floor(MAX_HISTORY / 2);
    const recent = [...processedMessages.keys()].slice(-half);
    processedMessages.clear();
    recent.forEach(key => processedMessages.set(key, true));
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
    if (['bot', 'menu'].includes(cmd)) return;

    // 7. Verificación de comando
    const exists = await checkCommandExistence(cmd);
    
    if (!exists) {
      await handleInvalidCommand(m, usedPrefix, cmd);
      return;
    }

    // 8. PARA COMANDOS VÁLIDOS: NO RESPONDER AQUÍ
    // El handler específico del comando debe responder

  } catch (error) {
    console.error('Error en before handler:', error);
  }
}

async function checkCommandExistence(cmd) {
  if (!global.plugins || typeof global.plugins !== 'object') return false;
  
  for (const plugin of Object.values(global.plugins)) {
    try {
      if (!plugin?.command) continue;
      
      const commands = Array.isArray(plugin.command) ?
        plugin.command.map(String) :
        [String(plugin.command)];
      
      if (commands.some(c => c.toLowerCase() === cmd)) {
        return true;
      }
    } catch (e) {
      console.error('Error verificando plugin:', e);
    }
  }
  return false;
}

async function handleInvalidCommand(m, prefix, invalidCmd) {
  try {
    const userMention = m.sender ? `@${m.sender.split('@')[0]}` : 'Usuario';
    const suggestions = await getCommandSuggestions(invalidCmd);
    
    let reply = `❌ *${userMention}, el comando \`${prefix}${invalidCmd}\` no existe.*\n`;
    
    if (suggestions.length > 0) {
      reply += `\n💡 ¿Quizás quisiste decir?\n${suggestions.map(s => `› \`${prefix}${s}\``).join('\n')}\n`;
    }
    
    reply += `\n📋 Usa *${prefix}help* para ver todos los comandos.`;
    
    await m.reply(reply, { mentions: [m.sender] });
    
  } catch (error) {
    console.error('Error al manejar comando inválido:', error);
    try {
      await m.reply(`⚠️ El comando \`${prefix}${invalidCmd}\` no existe.`);
    } catch (e) {
      console.error('Error al enviar respuesta mínima:', e);
    }
  }
}

// ... (funciones getCommandSuggestions y otras auxiliares igual que antes)
