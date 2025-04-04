const processedCommands = new Set();

export async function before(m) {
  // 1. Filtrado estricto de mensajes
  if (!m?.text || typeof m.text !== 'string' || m.isBaileys || m.fromMe) return;

  // 2. Sistema anti-duplicados reforzado
  const msgId = `${m.chat}_${m.id}`;
  if (processedCommands.has(msgId)) return;
  processedCommands.add(msgId);

  // 3. Limpieza periódica
  if (processedCommands.size > 100) {
    const recent = Array.from(processedCommands).slice(-50);
    processedCommands.clear();
    recent.forEach(id => processedCommands.add(id));
  }

  try {
    // 4. Configuración a prueba de fallos
    const prefix = global.prefix instanceof RegExp ? global.prefix : /^[\.\!\#\/]/i;

    // 5. Extracción del comando
    const prefixMatch = m.text.match(prefix);
    if (!prefixMatch) return;
    
    const usedPrefix = prefixMatch[0];
    const cmd = m.text.slice(usedPrefix.length).trim().split(/\s+/)[0]?.toLowerCase();
    if (!cmd) return;

    // 6. Comandos especiales silenciados
    if (cmd === 'bot') return;

    // 7. Verificación de existencia
    const exists = await checkCommandExistence(cmd);
    
    if (!exists) {
      await handleInvalidCommand(m, usedPrefix, cmd);
    }
    // 8. NO responder a comandos válidos aquí
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
    
    const replyMsg = `❌ *${userMention}, el comando \`${prefix}${invalidCmd}\` no existe.*\n\n` +
                    `📌 Usa *${prefix}help* para ver los comandos disponibles.`;
    
    await m.reply(replyMsg, { mentions: [m.sender] });
    
  } catch (error) {
    console.error('Error al manejar comando inválido:', error);
    try {
      await this.sendMessage(
        m.chat,
        { text: `⚠️ Comando \`${prefix}${invalidCmd}\` no reconocido` },
        { quoted: m }
      );
    } catch (finalError) {
      console.error('Fallo al enviar respuesta mínima:', finalError);
    }
  }
}
