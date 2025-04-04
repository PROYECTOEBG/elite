const activeCommands = new Set();

export async function before(m) {
  // 1. Filtrado básico de mensajes
  if (!m?.text || typeof m.text !== 'string' || m.isBaileys || m.fromMe) return;

  // 2. Crear un ID único para el comando
  const commandId = `${m.chat}_${m.id}_${m.text.trim().toLowerCase().slice(0, 15)}`;
  if (activeCommands.has(commandId)) return;
  activeCommands.add(commandId);

  try {
    // 3. Detección de prefijo infalible
    const prefix = (global.prefix instanceof RegExp) ? global.prefix : /^[\.\!\#\/]/i;
    const prefixMatch = m.text.trim().match(prefix);
    if (!prefixMatch) return;

    const usedPrefix = prefixMatch[0];
    const cmd = m.text.slice(usedPrefix.length).trim().split(/\s+/)[0]?.toLowerCase();
    if (!cmd) return;

    // 4. Comandos que se ignoran completamente
    if (['bot', 'menu', 'help'].includes(cmd)) return;

    // 5. Verificación directa y exhaustiva en plugins
    let commandFound = false;
    
    for (const plugin of Object.values(global.plugins || {})) {
      if (!plugin || typeof plugin !== 'object') continue;
      
      try {
        if (plugin.command) {
          const commands = Array.isArray(plugin.command) 
            ? plugin.command.map(c => String(c).toLowerCase())
            : [String(plugin.command).toLowerCase()];
          
          if (commands.includes(cmd)) {
            commandFound = true;
            break;
          }
        }
      } catch (e) {
        console.error(`Error verificando plugin:`, e);
      }
    }

    // 6. Respuesta solo para comandos no encontrados
    if (!commandFound) {
      const userTag = m.sender ? `@${m.sender.split('@')[0]}` : 'Usuario';
      const errorMessage = `✦ ¡Hey! *${userTag}*\n\n`
        + `El comando *${usedPrefix}${cmd}* no existe en mi base de datos.\n\n`
        + `Por favor verifica la ortografía o escribe *${usedPrefix}help*.\n\n`
        + `© ${new Date().getFullYear()} EliteBot Global`;
      
      await m.reply(errorMessage, { mentions: [m.sender] });
    }

  } catch (error) {
    console.error('Error crítico en before handler:', error);
  } finally {
    // Limpieza programada
    setTimeout(() => activeCommands.delete(commandId), 60000); // Limpiar después de 1 minuto
    if (activeCommands.size > 200) {
      const recent = Array.from(activeCommands).slice(-100);
      activeCommands.clear();
      recent.forEach(id => activeCommands.add(id));
    }
  }
}
