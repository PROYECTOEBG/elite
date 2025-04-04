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

    // Obtener todos los comandos registrados
    const allCommands = Object.values(global.plugins || {}).flatMap(plugin => {
      if (!plugin?.command) return [];
      return Array.isArray(plugin.command)
        ? plugin.command.map(c => String(c).toLowerCase())
        : [String(plugin.command).toLowerCase()];
    });

    console.log('Comando recibido:', cmd);
    console.log('Todos los comandos válidos:', allCommands);

    // Verificación directa
    if (allCommands.includes(cmd)) {
      console.log('→ Es un comando válido. No responder.');
      return;
    }

    // Si llega aquí, es inválido
    console.log('→ Comando NO válido. Responder al usuario.');

    commandTracker.set(trackerId, true);
    setTimeout(() => commandTracker.delete(trackerId), TRACKER_TTL);

    const response = `*✦ Comando no reconocido:* ${usedPrefix}${cmd}\n`
      + `Verifica la ortografía o usa *${usedPrefix}help* para ayuda.`;

    await m.reply(response);

  } catch (error) {
    console.error('Error crítico en before handler:', error);
  }
}
