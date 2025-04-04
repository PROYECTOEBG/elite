const commandTracker = new Map();
const TRACKER_TTL = 60000; // 1 minuto

export async function all(m) {
  // Validación inicial del mensaje
  if (!m || !m.text || typeof m.text !== 'string' || m.isBaileys || m.fromMe) return;

  // Detección del prefijo
  const prefix = global.prefix instanceof RegExp ? global.prefix : /^[\.\!\#\/]/i;
  const prefixMatch = m.text.match(prefix);
  if (!prefixMatch) return;

  const usedPrefix = prefixMatch[0];
  const cmd = m.text.slice(usedPrefix.length).trim().split(/\s+/)[0]?.toLowerCase();
  if (!cmd) return;

  // Prevención de spam
  const trackerId = `${m.chat}_${cmd}`;
  if (commandTracker.has(trackerId)) return;

  // Verificación de comandos existentes
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

    // SOLUCIÓN DEFINITIVA PARA EL JID
    const getValidJid = (input) => {
      if (!input) return null;
      
      // Si es un objeto, intentamos extraer el JID
      if (typeof input === 'object') {
        return input.id || input.jid || input.from || null;
      }
      
      // Si es string, verificamos formato
      if (typeof input === 'string') {
        // Limpieza básica del JID
        let cleaned = input.split('@')[0].replace(/\D+/g, '');
        if (cleaned.length > 0) {
          return `${cleaned}@s.whatsapp.net`;
        }
      }
      
      return null;
    };

    // Obtenemos JID con múltiples fallbacks
    let jid = getValidJid(m.sender) || 
              getValidJid(m.chat) || 
              getValidJid(m.from) || 
              getValidJid(m.key?.remoteJid) || 
              'unknown@s.whatsapp.net';

    // Creación segura de la mención
    const mentionId = jid.split('@')[0];
    const mention = mentionId ? `@${mentionId}` : '@unknown';

    // Construcción del mensaje
    const response = `✦ ¡Atención ${mention}! ✦\n\n` +
      `El comando *${usedPrefix}${cmd}* no está registrado.\n` +
      `▶ Verifica la ortografía\n` +
      `▶ Usa *${usedPrefix}help* para ayuda\n\n` +
      `🔹 EliteBot Global 🔹`;

    try {
      // Envío con validación final
      if (jid.endsWith('@s.whatsapp.net') || jid.endsWith('@g.us')) {
        await m.reply(response, {
          mentions: [jid]
        });
      } else {
        console.error('JID no válido detectado:', jid);
        await m.reply(response); // Envío sin mención como fallback
      }
    } catch (error) {
      console.error('Error al enviar mensaje:', error);
      // Fallback final sin usar mentions
      await conn.sendMessage(m.chat, { text: response });
    }
  }
}
