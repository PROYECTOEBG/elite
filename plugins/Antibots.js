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

    // Solo para probar: muestra el comando aunque sí exista
    console.log("Verificando comando:", cmd);

    // Búsqueda en plugins
    let commandExists = false;
    for (const plugin of Object.values(global.plugins || {})) {
      try {
        if (!plugin?.command) continue;

        const commands = Array.isArray(plugin.command)
          ? plugin.command.map(c => String(c).toLowerCase())
          : [String(plugin.command).toLowerCase()];

        if (commands.includes(cmd)) {
          commandExists = true;
          break;
        }
      } catch (e) {
        console.error(`Error al buscar en plugin:`, e);
      }
    }

    if (!commandExists) {
      console.log("Comando NO encontrado:", cmd);

      commandTracker.set(trackerId, true);
      setTimeout(() => commandTracker.delete(trackerId), TRACKER_TTL);

      const response = `*Comando no válido:* ${usedPrefix}${cmd}\nUsa *${usedPrefix}help* para ver los comandos disponibles.`;

      // Aquí probamos directamente con reply
      if (typeof m.reply === 'function') {
        await m.reply(response);
      } else {
        console.error('m.reply no es una función válida');
      }
    }

  } catch (error) {
    console.error('Error crítico en before:', error);
  }
}
