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

    // Validación robusta del JID
    let jid = m.sender || m.chat; // Fallback a m.chat si m.sender es undefined
    if (typeof jid !== 'string') jid = String(jid);

    // Asegurar formato correcto del JID (número@s.whatsapp.net)
    if (!jid.endsWith('@s.whatsapp.net')) {
      // Si no es un JID válido, usamos el chat como último recurso
      jid = m.chat.endsWith('@g.us') ? m.chat : `${jid.split('@')[0]}@s.whatsapp.net`;
    }

    // Crear mención segura
    const mention = jid.startsWith('whatsapp://') ? jid.split('@')[0] : `@${jid.split('@')[0]}`;
    const response = `✦ ¡Atención ${mention}! ✦\n\n`
      + `El comando *${usedPrefix}${cmd}* no está registrado.\n`
      + `▶ Verifica la ortografía\n`
      + `▶ Usa *${usedPrefix}help* para ayuda\n\n`
      + `🔹 EliteBot Global 🔹`;

    // Enviar mensaje con menciones válidas
    await m.reply(response, {
      mentions: [jid],
    });
  }
}
