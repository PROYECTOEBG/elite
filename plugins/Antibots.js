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
    
    console.log(`Detectado: Prefix: ${usedPrefix}, Command: ${cmd}`);

    if (!cmd) return;

    if (['bot', 'menu', 'help'].includes(cmd)) {
      commandTracker.set(trackerId, true);
      setTimeout(() => commandTracker.delete(trackerId), TRACKER_TTL);
      return;
    }

    let commandExists = false;
    console.log("Buscando en plugins...");

    pluginSearch: for (const plugin of Object.values(global.plugins || {})) {
      try {
        if (!plugin?.command) continue;

        const commands = Array.isArray(plugin.command) 
          ? plugin.command.map(c => String(c).toLowerCase())
          : [String(plugin.command).toLowerCase()];
        
        if (commands.includes(cmd)) {
          commandExists = true;
          break pluginSearch;
        }
      } catch (e) {
        console.error(`Error en plugin ${plugin.name || 'unnamed'}:`, e);
      }
    }

    console.log(`Comando encontrado: ${commandExists}`);

    if (!commandExists) {
      commandTracker.set(trackerId, true);
      setTimeout(() => commandTracker.delete(trackerId), TRACKER_TTL);
      
      const userMention = m.sender ? `@${m.sender.split('@')[0]}` : 'Usuario';
      const response = `✦ ¡Atención ${userMention}! ✦\n\n`
        + `El comando *${usedPrefix}${cmd}* no está registrado.\n`
        + `▶ Verifica la ortografía\n`
        + `▶ Usa *${usedPrefix}help* para ayuda\n\n`
        + `🔹 EliteBot Global 🔹`;

      console.log(`Enviando respuesta: ${response}`);
      
      await m.reply(response, { mentions: [m.sender] });
    }

  } catch (error) {
    console.error('Error crítico en before handler:', error);
  }
}
