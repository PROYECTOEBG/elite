export async function after(m, res, conn, usedPrefix, command) {
  // Solo responde si no hubo respuesta previa
  if (res !== null) return;

  const prefix = (global.prefix instanceof RegExp) ? global.prefix : /^[\.\!\#\/]/i;
  const prefixMatch = m.text?.match(prefix);
  if (!prefixMatch) return;

  const cmd = m.text.slice(prefixMatch[0].length).trim().split(/\s+/)[0]?.toLowerCase();
  if (!cmd) return;

  // Lista de comandos válidos
  const allCommands = Object.values(global.plugins || {}).flatMap(plugin => {
    if (!plugin?.command) return [];
    return Array.isArray(plugin.command)
      ? plugin.command.map(c => String(c).toLowerCase())
      : [String(plugin.command).toLowerCase()];
  });

  if (allCommands.includes(cmd)) {
    // Por seguridad, doble verificación
    return;
  }

  // Comando no válido, responde
  const userMention = m.sender ? `@${m.sender.split('@')[0]}` : 'usuario';
  const response = `✦ ¡Atención ${userMention}!\nEl comando *${usedPrefix}${cmd}* no existe.\nUsa *${usedPrefix}help* para ver los comandos disponibles.`;

  await m.reply(response, { mentions: [m.sender] });
}
