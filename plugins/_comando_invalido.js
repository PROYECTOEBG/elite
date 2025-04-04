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

  // Verificación de comandos existentes (modificado)
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

  // SOLO responder si el comando NO existe (cambio clave)
  if (commandExists) return;

  commandTracker.set(trackerId, true);
  setTimeout(() => commandTracker.delete(trackerId), TRACKER_TTL);

  // Función mejorada para obtener JID válido
  const getValidJid = () => {
    const sources = [m.sender, m.chat, m.from, m.key?.remoteJid];
    for (const source of sources) {
      if (!source) continue;
      
      // Si es string con formato correcto
      if (typeof source === 'string' && source.includes('@')) {
        const cleaned = source.replace(/[^0-9@]/g, '');
        if (cleaned.includes('@s.whatsapp.net') || cleaned.includes('@g.us')) {
          return cleaned;
        }
        return `${cleaned.split('@')[0]}@s.whatsapp.net`;
      }
      
      // Si es objeto con propiedad jid/id
      if (typeof source === 'object') {
        const jid = source.jid || source.id || source.from;
        if (jid && typeof jid === 'string' && jid.includes('@')) {
          return jid;
        }
      }
    }
    return 'unknown@s.whatsapp.net'; // Fallback seguro
  };

  const jid = getValidJid();
  const mentionId = jid.split('@')[0];
  const mention = mentionId ? `@${mentionId}` : '@unknown';

  const response = `✦ ¡Hey! 
Parece que escribiste mal el comando verifica si está bien escrito e intenta de nuevo.

©EliteBotGlobal 2023`;

  try {
    if (jid.endsWith('@s.whatsapp.net') || jid.endsWith('@g.us')) {
      await m.reply(response, { mentions: [jid] });
    } else {
      await m.reply(response); // Sin mención si el JID no es válido
    }
  } catch (error) {
    console.error('Error al responder a comando inválido:', error);
    // Último fallback
    await conn.sendMessage(m.chat, { text: response });
  }
}
