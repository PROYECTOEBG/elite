export const customPrefix = /^[\.\!\#\/]/i;

export const handler = async (m, { usedPrefix }) => {
  if (!m.text) return;

  const cmd = m.text.slice(usedPrefix.length).trim().split(/\s+/)[0]?.toLowerCase();
  if (!cmd) return;

  // Obtener todos los comandos válidos
  const allCommands = Object.values(global.plugins || {}).flatMap(plugin => {
    if (!plugin?.command) return [];
    return Array.isArray(plugin.command)
      ? plugin.command.map(c => String(c).toLowerCase())
      : [String(plugin.command).toLowerCase()];
  });

  if (allCommands.includes(cmd)) return; // ES VÁLIDO, no respondas

  // Comando no válido → responde
  const userMention = m.sender ? `@${m.sender.split('@')[0]}` : 'Usuario';
  const response = `✦ ¡Hola ${userMention}!\n\nEl comando *${usedPrefix}${cmd}* no existe.\nUsa *${usedPrefix}help* para ver los comandos válidos.`;

  await m.reply(response, { mentions: [m.sender] });
};

export const tags = ['info'];
export const help = ['Comando inválido handler'];
export const disabled = false;
