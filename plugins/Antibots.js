let commandHistory = new Map();
const HISTORY_LIMIT = 100;

export async function before(m) {
  // 1. Verificación ultra-estricta del mensaje
  if (!m || !m.text || typeof m.text !== 'string' || m.isBaileys || m.fromMe || m.key.remoteJid.includes('status')) {
    return;
  }

  try {
    // 2. Sistema anti-duplicados mejorado
    const messageId = `${m.chat}_${m.id}`;
    if (commandHistory.has(messageId)) return;
    
    // 3. Limpieza automática del historial
    if (commandHistory.size >= HISTORY_LIMIT) {
      const entries = Array.from(commandHistory.entries());
      commandHistory = new Map(entries.slice(entries.length - (HISTORY_LIMIT / 2)));
    }
    commandHistory.set(messageId, Date.now());

    // 4. Configuración garantizada del prefijo
    if (!global.prefix || !(global.prefix instanceof RegExp)) {
      global.prefix = /^[\.\!\#\/]/i;
    }

    // 5. Extracción infalible del comando
    const prefixMatch = m.text.match(global.prefix);
    if (!prefixMatch) return;
    
    const usedPrefix = prefixMatch[0];
    const fullCmd = m.text.slice(usedPrefix.length).trim();
    const [command] = fullCmd.split(/\s+/);
    const cmd = command?.toLowerCase();
    
    if (!cmd) return;

    // 6. Comandos especiales silenciosos
    if (cmd === 'bot' || cmd === 'menu') return;

    // 7. Verificación ABSOLUTA del comando
    const commandExists = await absolutelyVerifyCommand(cmd);
    
    if (!commandExists) {
      await handleInvalidCommandWithRetry(m, usedPrefix, cmd);
      return;
    }

    // ... (tu lógica para comandos válidos)

  } catch (error) {
    console.error('⚠️ Error crítico en before:', error);
  }
}

// Función de verificación INDESTRUCTIBLE
async function absolutelyVerifyCommand(cmd) {
  try {
    if (!global.plugins || typeof global.plugins !== 'object') return false;
    
    const plugins = Object.values(global.plugins);
    for (const plugin of plugins) {
      if (!plugin || typeof plugin !== 'object') continue;
      
      try {
        if (plugin.command) {
          const commands = Array.isArray(plugin.command) 
            ? plugin.command.map(String)
            : [String(plugin.command)];
            
          if (commands.some(c => c.toLowerCase() === cmd)) {
            return true;
          }
        }
      } catch (e) {
        console.error('Error en plugin:', e);
      }
    }
    return false;
  } catch (error) {
    console.error('Error en absolutelyVerifyCommand:', error);
    return false;
  }
}

// Función de manejo de errores a PRUEBA DE BALAS
async function handleInvalidCommandWithRetry(m, prefix, invalidCmd) {
  const MAX_RETRIES = 2;
  let attempts = 0;
  
  while (attempts < MAX_RETRIES) {
    try {
      const userTag = m.sender ? `@${m.sender.split('@')[0]}` : 'Usuario';
      const suggestions = await getSmartSuggestions(invalidCmd);
      
      let replyText = `📛 *${userTag}, el comando "${prefix}${invalidCmd}" no existe.*\n`;
      
      if (suggestions.length > 0) {
        replyText += `\n🔍 ¿Quizás quisiste decir?\n${suggestions.map(s => `• ${prefix}${s}`).join('\n')}\n`;
      }
      
      replyText += `\n📌 Usa *${prefix}help* para ver todos los comandos.`;
      
      // Intento principal de envío
      await m.reply(replyText, { mentions: [m.sender] });
      return;
      
    } catch (error) {
      attempts++;
      console.error(`Intento ${attempts} fallido. Error:`, error);
      
      if (attempts >= MAX_RETRIES) {
        // Último intento con método alternativo
        try {
          await this.sendMessage(
            m.chat, 
            { text: `⚠️ Comando "${prefix}${invalidCmd}" no reconocido` },
            { quoted: m }
          );
        } catch (finalError) {
          console.error('Fallo catastrófico al responder:', finalError);
        }
      }
    }
  }
}

// Sistema de sugerencias INTELIGENTE
async function getSmartSuggestions(wrongCmd, limit = 3) {
  if (!global.plugins) return [];
  
  try {
    const commandSet = new Set();
    
    for (const plugin of Object.values(global.plugins)) {
      if (!plugin?.command) continue;
      
      const commands = Array.isArray(plugin.command)
        ? plugin.command.map(String)
        : [String(plugin.command)];
      
      commands.forEach(cmd => commandSet.add(cmd.toLowerCase()));
    }
    
    return Array.from(commandSet)
      .filter(cmd => cmd !== wrongCmd)
      .sort((a, b) => {
        // Priorizar coincidencias al inicio
        if (a.startsWith(wrongCmd)) return -1;
        if (b.startsWith(wrongCmd)) return 1;
        
        // Luego coincidencias que contengan el texto
        if (a.includes(wrongCmd)) return -1;
        if (b.includes(wrongCmd)) return 1;
        
        return 0;
      })
      .slice(0, limit);
      
  } catch (error) {
    console.error('Erro
