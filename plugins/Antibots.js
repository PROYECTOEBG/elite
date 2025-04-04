const commandCache = new Map();
const MESSAGE_COOLDOWN = new Set();

export async function before(m) {
  // 1. Filtrado estricto de mensajes
  if (!m?.text || typeof m.text !== 'string' || m.isBaileys || m.fromMe) return;

  // 2. Control de mensajes duplicados
  const msgKey = `${m.chat}_${m.id}`;
  if (MESSAGE_COOLDOWN.has(msgKey)) return;
  MESSAGE_COOLDOWN.add(msgKey);

  // 3. Limpieza periódica
  if (MESSAGE_COOLDOWN.size > 100) {
    const arr = Array.from(MESSAGE_COOLDOWN).slice(-50);
    MESSAGE_COOLDOWN.clear();
    arr.forEach(id => MESSAGE_COOLDOWN.add(id));
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

    // ... (tu lógica para comandos válidos)

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
  setTimeout(() => commandCache.delete(cmd), 300000); // 5 minutos de caché
  return exists;
}

// Función mejorada para responder a comandos no válidos
async function sendInvalidCommandResponse(m, prefix, invalidCmd) {
  const MAX_ATTEMPTS = 3;
  let attempts = 0;
  let success = false;
  
  const userMention = m.sender ? `@${m.sender.split('@')[0]}` : 'Usuario';
  const responseText = `👋 *Hola ${userMention}*, el comando *${prefix}${invalidCmd}* no se encuentra en mi base de datos.\n\n` +
                      `🔍 *Por favor verifica si está bien escrito e intenta de nuevo.*\n\n` +
                      `💡 *Tip:* Usa *${prefix}help* para ver mis comandos disponibles.`;

  while (attempts < MAX_ATTEMPTS && !success) {
    try {
      attempts++;
      
      if (attempts === 1) {
        // Intento principal con mención
        await m.reply(responseText, { mentions: [m.sender] });
      } else if (attempts === 2) {
        // Intento alternativo sin mención
        await m.reply(responseText);
      } else {
        // Último intento con método básico
        await this.sendMessage(m.chat, { text: responseText }, { quoted: m });
      }
      
      success = true;
      
    } catch (error) {
      console.error(`Intento ${attempts} fallido. Error:`, error);
      if (attempts >= MAX_ATTEMPTS) {
        console.error('No se pudo enviar respuesta de comando inválido');
      }
    }
  }
}
