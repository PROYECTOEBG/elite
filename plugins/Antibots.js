export async function fail(m, { usedPrefix }) {
  const prefix = (global.prefix instanceof RegExp) ? global.prefix : /^[\.\!\#\/]/i;
  const prefixMatch = m.text?.match(prefix);
  if (!prefixMatch) return;

  const cmd = m.text.slice(prefixMatch[0].length).trim().split(/\s+/)[0]?.toLowerCase();
  if (!cmd) return;

  // Responder solo si no es válido
  const response = `✦ El comando *${usedPrefix}${cmd}* no está registrado.\nUsa *${usedPrefix}help* para ver los comandos disponibles.`;
  await m.reply(response);
}
