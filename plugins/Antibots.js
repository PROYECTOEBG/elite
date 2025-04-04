const commandLocks = new Map();
const CACHE_TTL = 300000; // 5 minutos

export async function before(m) {
  // 1. Filtrado estricto de mensajes
  if (!m?.text || typeof m.text !== 'string' || m.isBaileys || m.fromMe) return;

  try {
    // 2. Configuración del prefijo
    const prefix = global.prefix instanceof RegExp ? global.prefix : /^[\.\!\#\/]/i;

    // 3. Extracción del comando
    const prefixMatch = m.text.match(prefix);
    if (!prefixMatch) return;
    
    const usedPrefix = prefixMatch[0];
    const cmd = m.text.slice(usedPrefix.length).trim().split(/\s+/)[0]?.toLowerCase();
    if (!cmd) return;

    // 4. Comandos especiales silenciados
    if (cmd === 'bot') return;

    // 5. Sistema de bloqueo para evitar duplicados
    const lockKey = `${m.chat}_${cmd}`;
    if (commandLocks.has(lockKey)) return;
    commandLocks.set(lockKey, true);
    setTimeout(() => commandLocks.delete(lockKey), 5000); // Bloqueo por 5 segundos

    // 6. Verificación de existencia del comando
    const exists = await checkCommandExistence(cmd);
    
    if (!exists) {
      await sendInvalidCommandResponse(m, usedPrefix, cmd);
    }
    // No hacer nada para comandos válidos

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

async function sendInvalidCommandResponse(m, prefix, invalidCmd) {
  try {
    const userMention = m.sender ? `@${m.sender.split('@')[0]}` : 'Usuario';
    const responseText = `✦ ¡Hey! *${userMention}*\n\n` +
                        `Parece que escribiste mal el comando. Verifica si está bien escrito e intenta de nuevo.\n\n` +
                        `©EliteBotGlobal 2023`;
    
    await m.reply(responseText, { mentions: [m.sender] });
  } catch (error) {
    console.error('Error al enviar respuesta:', error);
  }
}
