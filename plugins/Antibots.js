const commandCache = new Map();

export async function before(m) {
  // 1. Filtrado de mensajes
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

    // 5. Verificación de existencia del comando
    const exists = commandCache.has(cmd) ? 
                  commandCache.get(cmd) : 
                  await checkCommandExistence(cmd);
    
    if (!exists) {
      await sendCustomInvalidMessage(m, usedPrefix, cmd);
      return;
    }

    // ... (tu lógica para comandos válidos)

  } catch (error) {
    console.error('Error en before handler:', error);
  }
}

async function checkCommandExistence(cmd) {
  if (!global.plugins || typeof global.plugins !== 'object') return false;
  
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
  return exists;
}

// Función con mensaje personalizado y etiqueta de usuario
async function sendCustomInvalidMessage(m, prefix, invalidCmd) {
  try {
    // Obtener mención del usuario
    const userMention = m.sender ? `@${m.sender.split('@')[0]}` : 'Usuario';
    
    const responseMessage = `👋 *Hola ${userMention}*, el comando *${prefix}${invalidCmd}* no se encuentra en mi base de datos.\n\n` +
                           `🔍 *Por favor verifica si está bien escrito e intenta de nuevo.*\n\n` +
                           `💡 *Tip:* Usa *${prefix}help* para ver mis comandos disponibles.`;
    
    // Enviar mensaje mencionando al usuario
    await m.reply(responseMessage, { mentions: [m.sender] });
    
  } catch (error) {
    console.error('Error al enviar mensaje personalizado:', error);
    try {
      // Respuesta alternativa si falla el primer intento
      const userMention = m.sender ? `@${m.sender.split('@')[0]}` : 'Usuario';
      await this.sendMessage(
        m.chat,
        { text: `⚠️ *${userMention}*, el comando *${prefix}${invalidCmd}* no existe. Verifica por favor.` },
        { quoted: m, mentions: [m.sender] }
      );
    } catch (finalError) {
      console.error('Error en respuesta alternativa:', finalError);
    }
  }
}
