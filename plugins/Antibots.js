const commandTracker = new Map();
const TRACKER_TTL = 60000; // 1 minuto

export async function before(m) {
  if (!m?.text || typeof m.text !== 'string' || m.isBaileys || m.fromMe) return;

  const trackerId = `${m.chat}_${m.text.slice(0, 20).trim().toLowerCase()}`;
  if (commandTracker.has(trackerId)) return;

  try {
    const prefix = (global.prefix instanceof RegExp) ? global.prefix : /^[\.\!\#\/]/i;
    const prefixMatch = m.text.match(prefix);
    if (!prefixMatch) return;

    const usedPrefix = prefixMatch[0];
    const cmd = m.text.slice(usedPrefix.length).trim().split(/\s+/)[0]?.toLowerCase();
    if (!cmd) return;

    // Saltar algunos comandos comunes
    if (['bot', 'menu', 'help'].includes(cmd)) return;

    let commandExists = false;
    for (const plugin of Object.values(global.plugins || {})) {
      if (!plugin?.command) continue;

      const commands = Array.isArray(plugin.command)
        ? plugin.command.map(c => String(c).toLowerCase())
        : [String(plugin.command).toLowerCase()];

      if (commands.includes(cmd)) {
        commandExists = true;
        break;
      }
    }

    // Solo responde si NO existe el comando
    if (!commandExists) {
      commandTracker.set(trackerId, true);
      setTimeout(() => commandTracker.delete(trackerId), TRACKER_TTL);

      const response = `✦ Comando *${usedPrefix}${cmd}* no reconocido.\n`
        + `Usa *${usedPrefix}help* para ver los comandos disponibles.`;

      await m.reply(response);
    }

  } catch (error) {
    console.error('Error en before handler:', error);
  }
}
