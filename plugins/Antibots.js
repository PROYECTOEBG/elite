const commandRegistry = new Map();

export async function before(m) {
  // 1. Verificación básica del mensaje
  if (!m?.text || typeof m.text !== 'string' || m.isBaileys || m.fromMe) return;

  try {
    // 2. Configuración del prefijo (a prueba de fallos)
    const prefix = global.prefix instanceof RegExp ? global.prefix : /^[\.\!\#\/]/i;

    // 3. Extracción del comando
    const prefixMatch = m.text.match(prefix);
    if (!prefixMatch) return;
    
    const usedPrefix = prefixMatch[0];
    const cmd = m.text.slice(usedPrefix.length).trim().split(/\s+/)[0]?.toLowerCase();
    if (!cmd) return;

    // 4. Comandos especiales que se ignoran
    if (cmd === 'bot') return;

    // 5. Verificación de existencia del comando (sistema nuevo)
    const exists = await checkCommandExistence(cmd);
    
    if (!exists) {
      await handleNonexistentCommand(m, usedPrefix, cmd);
      return;
    }

    // ... (tu lógica para comandos válidos)

  } catch (error) {
    console.error('Error en before handler:', error);
  }
}

// Nuevo sistema de verificación de comandos
async function checkCommandExistence(cmd) {
  // Primera verificación: caché local
  if (commandRegistry.has(cmd)) {
    return commandRegistry.get(cmd);
  }

  // Segunda verificación: plugins globales
  if (!global.plugins || typeof global.plugins !== 'object') {
    console.error('Error: global.plugins no está definido correctamente');
    return false;
  }

  let exists = false;
  
  for (const [name, plugin] of Object.entries(global.plugins)) {
    try {
      if (!plugin || typeof plugin !== 'object') continue;
      
      if (plugin.command) {
        const commands = Array.isArray(plugin.command) ? 
                       plugin.command.map(String) : 
                       [String(plugin.command)];
        
        if (commands.some(c => c.toLowerCase() === cmd)) {
          exists = true;
          break;
        }
      }
    } catch (e) {
      console.error(`Error verificando plugin ${name}:`, e);
    }
  }

  // Actualizar caché
  commandRegistry.set(cmd, exists);
  return exists;
}

// Handler mejorado para comandos no existentes
async function handleNonexistentCommand(m, prefix, invalidCmd) {
  try {
    // 1. Preparar mención al usuario
    const userMention = m.sender ? `@${m.sender.split('@')[0]}` : 'Usuario';
    
    // 2. Construir mensaje de respuesta
    const replyMsg = `❌ *${userMention}, el comando \`${prefix}${invalidCmd}\` no existe.*\n\n` +
                    `📌 Usa *${prefix}help* para ver los comandos disponibles.`;
    
    // 3. Enviar respuesta con dos métodos alternativos
    try {
      await m.reply(replyMsg, { mentions: [m.sender] });
    } catch (error) {
      console.error('Error con m.reply, intentando método alternativo...');
      await this.sendMessage(m.chat, { text: replyMsg }, { quoted: m });
    }
    
  } catch (error) {
    console.error('Error crítico en handleNonexistentCommand:', error);
    // Respuesta mínima de emergencia
    try {
      await m.reply(`⚠️ El comando \`${prefix}${invalidCmd}\` no existe.`);
    } catch (finalError) {
      console.error('Fallo al enviar respuesta mínima:', finalError);
    }
  }
}
