const commandLocks = new Map();
const PREFIX = /^[\.\!\#\/]/i; // Prefijo por defecto

export async function before(m) {
  // 1. Filtrado estricto de mensajes
  if (!m?.text || typeof m.text !== 'string' || m.isBaileys || m.fromMe) return;

  try {
    // 2. Extracción del comando
    const prefixMatch = m.text.match(global.prefix || PREFIX);
    if (!prefixMatch) return;
    
    const usedPrefix = prefixMatch[0];
    const cmd = m.text.slice(usedPrefix.length).trim().split(/\s+/)[0]?.toLowerCase();
    if (!cmd) return;

    // 3. Comandos especiales silenciados
    if (cmd === 'bot') return;

    // 4. Sistema de bloqueo para evitar duplicados
    const lockKey = `${m.chat}_${m.id}_${cmd}`;
    if (commandLocks.has(lockKey)) return;
    commandLocks.set(lockKey, true);
    setTimeout(() => commandLocks.delete(lockKey), 5000);

    // 5. Verificación directa de existencia
    const exists = checkCommandExists(cmd);
    
    if (!exists) {
      await replyToInvalidCommand(m, usedPrefix, cmd);
    }
    // No hacer nada para comandos válidos

  } catch (error) {
    console.error('Error en before handler:', error);
  }
}

function checkCommandExists(cmd) {
  if (!global.plugins || typeof global.plugins !== 'object') return false;
  
  for (const plugin of Object.values(global.plugins)) {
    try {
      if (!plugin?.command) continue;
      
      const commands = Array.isArray(plugin.command) ?
        plugin.command.map(c => c?.toLowerCase?.()) :
        [plugin.command?.toLowerCase?.()];
      
      if (commands.includes(cmd)) return true;
    } catch (e) {
      console.error('Error verificando plugin:', e);
    }
  }
  return false;
}

async function replyToInvalidCommand(m, prefix, invalidCmd) {
  try {
    const userMention = m.sender ? `@${m.sender.split('@')[0]}` : 'Usuario';
    const responseText = `✦ ¡Hey! *${userMention}*\n\n` +
                        `El comando *${prefix}${invalidCmd}* no existe. Verifica la ortografía.\n\n` +
                        `Escribe *${prefix}help* para ver comandos disponibles.\n\n` +
                        `©EliteBotGlobal 2023`;
    
    await m.reply(responseText, { mentions: [m.sender] });
  } catch (error) {
    console.error('Error al responder comando inválido:', error);
    // Intento alternativo
    try {
      await this.sendMessage(
        m.chat, 
        { 
          text: `⚠️ Comando *${prefix}${invalidCmd}* no reconocido. Usa *${prefix}help*`,
          mentions: [m.sender] 
        }, 
        { quoted: m }
      );
    } catch (finalError) {
      console.error('Error en respuesta alternativa:', finalError);
    }
  }
}
