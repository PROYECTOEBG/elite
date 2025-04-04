const commandTracker = new Map();
const TRACKER_TTL = 60000; // 1 minuto

export async function before(m, { command }) {
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

    // Asegurar que se omitan comandos válidos conocidos
    const allCommands = Object.values(global.plugins || {}).flatMap(plugin => {
      if (!plugin?.command) return [];
      return Array.isArray(plugin.command)
        ? plugin.command.map(c => String(c).toLowerCase())
        : [String(plugin.command).toLowerCase()];
    });

    if (allCommands.includes(cmd)) {
      // Es un comando válido, no responder
      return;
    }

    // Comando inválido, responder
    commandTracker.set(trackerId, true);
    setTimeout(() => commandTracker.delete(trackerId), TRACKER_TTL);

    const userMention = m.sender ? `@${m.sender.split('@')[0]}` : 'Usuario';
    const response = `✦ ¡Atención ${userMention}! ✦\n\n`
      + `El comando *${usedPrefix}${cmd}* no está registrado.\n`
      + `▶ Verifica la ortografía\n`
      + `▶ Usa *${usedPrefix}help* para ayuda\n\n`
      + `🔹 EliteBot Global 🔹`;

    await m.reply(response, { mentions: [m.sender] });

  } catch (error) {
    console.error('Error crítico en before handler:', error);
  }
}
