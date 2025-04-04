const processedCommands = new Set();

export async function before(m) {
  // 1. Filtrado básico de mensajes
  if (!m?.text || typeof m.text !== 'string' || m.isBaileys || m.fromMe) return;

  // 2. ID único para cada interacción
  const commandId = `${m.chat}_${m.id}_${m.text.slice(0, 10)}`;
  if (processedCommands.has(commandId)) return;
  processedCommands.add(commandId);

  try {
    // 3. Detección de prefijo mejorada
    const prefix = global.prefix instanceof RegExp ? global.prefix : /^[\.\!\#\/]/i;
    const prefixMatch = m.text.match(prefix);
    if (!prefixMatch) return;

    const usedPrefix = prefixMatch[0];
    const cmd = m.text.slice(usedPrefix.length).trim().split(/\s+/)[0]?.toLowerCase();
    if (!cmd) return;

    // 4. Comandos que se ignoran
    if (['bot', 'menu', 'help'].includes(cmd)) return;

    // 5. Verificación directa en plugins
    let commandExists = false;
    pluginLoop: for (const plugin of Object.values(global.plugins || {})) {
      if (!plugin?.command) continue;
      
      const commands = Array.isArray(plugin.command) 
        ? plugin.command.map(c => c?.toLowerCase?.())
        : [plugin.command?.toLowerCase?.()];
      
      if (commands.includes(cmd)) {
        commandExists = true;
        break pluginLoop;
      }
    }

    // 6. Solo responder a comandos no reconocidos
    if (!commandExists) {
      const userMention = m.sender ? `@${m.sender.split('@')[0]}` : 'Usuario';
      const response = `✦ ¡Hey! *${userMention}*\n\n`
        + `El comando *${usedPrefix}${cmd}* no existe en mi sistema.\n\n`
        + `Verifica la ortografía o escribe *${usedPrefix}help* para ver comandos disponibles.\n\n`
        + `©EliteBotGlobal ${new Date().getFullYear()}`;
      
      await m.reply(response, { mentions: [m.sender] });
    }

  } catch (error) {
    console.error('Error en before handler:', error);
  } finally {
    // Limpieza periódica
    if (processedCommands.size > 100) {
      const recent = Array.from(processedCommands).slice(-50);
      processedCommands.clear();
      recent.forEach(id => processedCommands.add(id));
    }
  }
}
