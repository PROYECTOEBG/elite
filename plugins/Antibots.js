export const all = async function (m, { command, usedPrefix }) {
  // Si el mensaje no es un comando, ignora
  const prefix = (global.prefix instanceof RegExp) ? global.prefix : /^[\.\!\#\/]/i;
  const prefixMatch = m.text?.match(prefix);
  if (!prefixMatch) return;

  const cmd = m.text.slice(prefixMatch[0].length).trim().split(/\s+/)[0]?.toLowerCase();
  if (!cmd) return;

  // Verifica si algún plugin manejó el comando
  const allCommands = Object.values(global.plugins || {}).flatMap(plugin => {
    if (!plugin?.command) return [];
    return Array.isArray(plugin.command)
      ? plugin.command.map(c => String(c).toLowerCase())
      : [String(plugin.command).toLowerCase()];
  });

  if (allCommands.includes(cmd)) {
    // Si existe, no responder
    return;
  }

  // Si no existe, manda mensaje
  const response = `✦ El comando *${usedPrefix}${cmd}* no está registrado.\nUsa *${usedPrefix}help* para ver la lista.`;
  await m.reply(response);
};

export const options = {
  all: true, // se ejecuta en todos los mensajes, como un "fallback"
};
