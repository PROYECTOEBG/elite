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

    // SOLUCIÓN MEJORADA - Validación exhaustiva del JID
    let jid = '';
    
    // 1. Primero intentamos obtener un JID válido
    if (m?.sender && typeof m.sender === 'string' && m.sender.includes('@')) {
      jid = m.sender;
    } else if (m?.chat && typeof m.chat === 'string' && m.chat.includes('@')) {
      jid = m.chat;
    } else {
      // Si todo falla, usamos un valor por defecto seguro
      console.error('No se pudo obtener un JID válido:', { sender: m.sender, chat: m.chat });
      jid = 'error@invalid.jid'; // Valor por defecto seguro
    }

    // 2. Forzamos el formato correcto
    if (!jid.endsWith('@s.whatsapp.net') && !jid.endsWith('@g.us')) {
      jid = jid.split('@')[0] + '@s.whatsapp.net';
    }

    // 3. Creamos la mención de manera segura
    const mentionId = jid.split('@')[0];
    const mention = mentionId ? `@${mentionId}` : '@unknown';

    // 4. Mensaje de respuesta
    const response = `✦ ¡Atención ${mention}! ✦\n\n`
      + `El comando *${usedPrefix}${cmd}* no está registrado.\n`
      + `▶ Verifica la ortografía\n`
      + `▶ Usa *${usedPrefix}help* para ayuda\n\n`
      + `🔹 EliteBot Global 🔹`;

    try {
      // 5. Envío seguro con verificación final
      if (jid.endsWith('@s.whatsapp.net') || jid.endsWith('@g.us')) {
        await m.reply(response, {
          mentions: [jid]
        });
      } else {
        console.error('JID no válido para enviar mensaje:', jid);
      }
    } catch (error) {
      console.error('Error al enviar mensaje de comando inválido:', error);
    }
  }
}
