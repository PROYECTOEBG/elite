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

    // Asegurarse de que `m.sender` sea una cadena de texto válida
    let jid = m.sender;
    if (typeof jid !== 'string') {
      // Verificamos si `m.key` tiene la propiedad `participant`, de no ser así usamos `m.chat`
      jid = m.key?.participant || m.chat;
    }

    // Si `jid` no es una cadena de texto, la convertimos a una
    jid = String(jid);

    // Verificamos que el `jid` tenga el formato correcto (contenga '@')
    if (!jid.includes('@')) {
      jid = String(m.chat); // Usamos el ID del chat como fallback si no es válido
    }

    // Asegurándonos de que no se pase un valor no válido a `mentions`
    const userMention = `@${jid.split('@')[0]}`;
    const response = `✦ ¡Atención ${userMention}! ✦\n\n`
      + `El comando *${usedPrefix}${cmd}* no está registrado.\n`
      + `▶ Verifica la ortografía\n`
      + `▶ Usa *${usedPrefix}help* para ayuda\n\n`
      + `🔹 EliteBot Global 🔹`;

    await m.reply(response, {
      mentions: [jid] // Mencionamos correctamente al usuario
    });
  }
}
