// CONTROL CENTRAL DE MENSAJES
const messageControl = new class {
  constructor() {
    this.handledMessages = new Map();
    setInterval(() => this.cleanup(), 60000); // Limpieza cada minuto
  }

  shouldProcess(msgId) {
    return !this.handledMessages.has(msgId);
  }

  markAsProcessed(msgId) {
    this.handledMessages.set(msgId, Date.now());
  }

  cleanup() {
    const now = Date.now();
    for (const [msgId, timestamp] of this.handledMessages) {
      if (now - timestamp > 300000) { // 5 minutos de retención
        this.handledMessages.delete(msgId);
      }
    }
  }
}();

export async function before(m) {
  // 1. Verificación EXTREMA del mensaje
  if (!m?.text || typeof m.text !== 'string' || 
      m.isBaileys || m.fromMe || m.key?.fromMe) {
    return;
  }

  // 2. ID único compuesto (chat + id + contenido)
  const msgId = `${m.chat}_${m.id}_${m.text.slice(0, 20)}`;
  
  if (!messageControl.shouldProcess(msgId)) {
    console.log('Mensaje duplicado detectado, ignorando:', msgId);
    return;
  }

  try {
    // 3. Configuración a prueba de fallos
    const prefix = global.prefix instanceof RegExp ? 
                 global.prefix : 
                 /^[\!\.\#\/]/i;

    // 4. Extracción segura del comando
    const prefixMatch = m.text.trim().match(prefix);
    if (!prefixMatch) return;
    
    const usedPrefix = prefixMatch[0];
    const cmd = m.text.slice(usedPrefix.length).trim().split(/\s+/)[0]?.toLowerCase();
    if (!cmd) return;

    // 5. Comandos silenciados (no generan respuesta)
    if (['bot', 'menu', 'help'].includes(cmd)) {
      messageControl.markAsProcessed(msgId);
      return;
    }

    // 6. Verificación de comando con doble validación
    const exists = await this.verifyCommandExistence(cmd);
    
    if (!exists) {
      await this.handleInvalidCommand(m, usedPrefix, cmd);
      messageControl.markAsProcessed(msgId);
      return;
    }

    // 7. PARA COMANDOS VÁLIDOS:
    // - NO responder aquí
    // - El handler específico debe marcar como procesado
    // - Solo debe haber UN handler por comando

  } catch (error) {
    console.error('ERROR GLOBAL:', error);
    messageControl.markAsProcessed(msgId);
  }
}

// Handler para comandos inválidos (UNIFICADO)
async function handleInvalidCommand(m, prefix, invalidCmd) {
  try {
    const userTag = m.sender ? `@${m.sender.split('@')[0]}` : 'Usuario';
    
    const replyMsg = `❌ *${userTag}, el comando \`${prefix}${invalidCmd}\` no existe.*\n\n` +
                    `📌 Usa *${prefix}help* para ver los comandos disponibles.`;
    
    await m.reply(replyMsg, { mentions: [m.sender] });
    
  } catch (error) {
    console.error('Error al responder comando inválido:', error);
    try {
      await this.sendMessage(
        m.chat, 
        { text: `⚠️ Comando \`${prefix}${invalidCmd}\` no reconocido` },
        { quoted: m }
      );
    } catch (finalError) {
      console.error('Fallo catastrófico:', finalError);
    }
  }
}

// Sistema de verificación MEJORADO
async function verifyCommandExistence(cmd) {
  if (!global.plugins || typeof global.plugins !== 'object') {
    console.error('Estructura de plugins no válida');
    return false;
  }

  for (const [name, plugin] of Object.entries(global.plugins)) {
    try {
      if (!plugin?.command) continue;
      
      const commands = Array.isArray(plugin.command) ? 
                      plugin.command.map(String) : 
                      [String(plugin.command)];
      
      if (commands.some(c => c.toLowerCase() === cmd)) {
        return true;
      }
    } catch (e) {
      console.error(`Error en plugin ${name}:`, e);
    }
  }
  return false;
}
