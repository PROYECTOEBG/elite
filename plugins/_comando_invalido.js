const commandTracker = new Map();
const TRACKER_TTL = 60000; // 1 minuto

export async function all(m) {
  if (!m?.text || typeof m.text !== 'string' || m.isBaileys || m.fromMe) return;

  const prefix = global.prefix instanceof RegExp ? global.prefix : /^[\.\!\#\/]/i;
  const prefixMatch = m.text.match(prefix);
  if (!prefixMatch) return;

  const usedPrefix = prefixMatch[0];
  const cmd = m.text.slice(usedPrefix.length).trim().split(/\s+/)[0]?.toLowerCase();
  if (!cmd) return;

  const trackerId = `${m.chat}_${cmd}`;
  if (commandTracker.has(trackerId)) return;

  let commandExists = false;
  for (const name in global.plugins) {
    const plugin = global.plugins[name];
    if (!plugin?.command) continue;

    const commands = Array.isArray(plugin.command)
      ? plugin.command.map(c => String(c).toLowerCase())
      : [String(plugin.command).toLowerCase()];

    if (commands.includes(cmd)) {
      commandExists = true;
      break;
    }
  }

  if (!commandExists) {
    commandTracker.set(trackerId, true);
    setTimeout(() => commandTracker.delete(trackerId), TRACKER_TTL);

    // Asegurarnos de que `jid` sea un string y esté correctamente formateado
    let jid = m.sender;
    if (typeof jid !== 'string') {
      jid = String(jid); // Convertimos `jid` a string si no lo es
    }

    // Si `jid` no está en el formato correcto, usamos `m.chat` como fallback
    if (!jid.includes('@')) {
      jid = String(m.chat); // Si no contiene '@', lo convertimos a `m.chat`
    }

    // Mensaje de respuesta
    const userMention = `@${jid.split('@')[0]}`;
    const response = `✦ ¡Atención ${userMention}! ✦\n\n`
      + `El comando *${usedPrefix}${cmd}* no está registrado.\n`
      + `▶ Verifica la ortografía\n`
      + `▶ Usa *${usedPrefix}help* para ayuda\n\n`
      + `🔹 EliteBot Global 🔹`;

    // Enviar mensaje y mencionar al usuario correctamente
    await m.reply(response, {
      mentions: [jid] // Mencionamos correctamente al usuario
    });
  }
}
