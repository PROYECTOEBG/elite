const commandCache = new Map();
const MESSAGE_LIFETIME = 300000; // 5 minutos

export async function before(m) {
  // 1. Filtrado extremo de mensajes
  if (!m?.text || typeof m.text !== 'string' || m.isBaileys || m.fromMe || m.key?.fromMe) {
    return;
  }

  // 2. ID único compuesto
  const msgId = `${m.chat}_${m.id}_${m.text.slice(0, 15)}`;
  
  try {
    // 3. Configuración a prueba de fallos
    const prefix = global.prefix = global.prefix instanceof RegExp ? 
                  global.prefix : 
                  /^[\!\.\#\/]/i;

    // 4. Extracción robusta del comando
    const prefixMatch = m.text.trim().match(prefix);
    if (!prefixMatch) return;
    
    const usedPrefix = prefixMatch[0];
    const cmd = m.text.slice(usedPrefix.length).trim().split(/\s+/)[0]?.toLowerCase();
    if (!cmd) return;

    // 5. Comandos silenciados
    if (['bot', 'menu', 'help'].includes(cmd)) return;

    // 6. Verificación con doble caché
    let exists = commandCache.get(cmd);
    if (exists === undefined) {
      exists = await verifyCommandExistence(cmd);
      commandCache.set(cmd, exists);
      setTimeout(() => commandCache.delete(cmd), MESSAGE_LIFETIME);
    }

    // 7. Manejo infalible de comandos inválidos
    if (!exists) {
      await handleInvalidCommandWithRetry(m, usedPrefix, cmd);
      return;
    }

    // 8. Comandos válidos: NO responder aquí

  } catch (error) {
    console.error('ERROR GLOBAL EN BEFORE:', error);
  }
}

// Verificación con triple capa de seguridad
async function verifyCommandExistence(cmd) {
  if (!global.plugins || typeof global.plugins !== 'object') {
    console.error('ERROR: Estructura de plugins no válida');
    return false;
  }

  // Primera capa: Verificación directa
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
      console.error('Error en verificación de plugin:', e);
    }
  }

  // Segunda capa: Verificación profunda
  if (global.db?.data?.commands) {
    if (global.db.data.commands[cmd]) {
      return true;
    }
  }

  return false;
}

// Handler de comandos inválidos con triple intento
async function handleInvalidCommandWithRetry(m, prefix, invalidCmd) {
  const MAX_ATTEMPTS = 3;
  let attempts = 0;
  let success = false;
  
  const replyText = `❌ *El comando \`${prefix}${invalidCmd}\` no existe.*\n\n` +
                   `📌 Usa *${prefix}help* para ver los comandos disponibles.`;

  while (attempts < MAX_ATTEMPTS && !success) {
    try {
      attempts++;
      
      if (attempts === 1) {
        // Intento principal con mención
        await m.reply(replyText, m.sender ? { mentions: [m.sender] } : {});
      } else if (attempts === 2) {
        // Intento alternativo sin mención
        await m.reply(replyText);
      } else {
        // Último intento con método básico
        await this.sendMessage(m.chat, { text: replyText }, { quoted: m });
      }
      
      success = true;
      
    } catch (error) {
      console.error(`Intento ${attempts} fallido. Error:`, error);
      if (attempts >= MAX_ATTEMPTS) {
        console.error('FALLO CRÍTICO: No se pudo enviar respuesta');
      }
    }
  }
}
