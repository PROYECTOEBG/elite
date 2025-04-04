export async function before(m) {
  try {
    // 1. DIAGNÓSTICO INICIAL (puedes quitarlo después de verificar)
    console.log('[DIAGNÓSTICO] Mensaje recibido:', m.text);
    
    // 2. CONFIGURACIÓN MÍNIMA ESENCIAL
    if (!global.prefix) {
      console.warn('[CONFIG] No hay global.prefix, usando por defecto');
      global.prefix = /^[\.\!\#\/]/i; // Prefijo por defecto
    }
    
    if (!global.plugins) {
      console.warn('[CONFIG] No hay global.plugins, inicializando objeto vacío');
      global.plugins = {};
    }

    // 3. VERIFICACIÓN BÁSICA DEL MENSAJE
    if (!m?.text || typeof m.text !== 'string') {
      console.log('[IGNORADO] Mensaje sin texto válido');
      return;
    }

    // 4. DETECCIÓN DE PREFIJO MEJORADA (con diagnóstico)
    const prefixStr = global.prefix.source || global.prefix.toString();
    console.log('[PREFIJO] Usando patrón:', prefixStr);
    
    const prefixRegex = new RegExp(`^(${escapeRegex(prefixStr)})`, 'i');
    const prefixMatch = m.text.match(prefixRegex);
    
    if (!prefixMatch) {
      console.log('[IGNORADO] No coincide con el prefijo');
      return;
    }
    
    const usedPrefix = prefixMatch[0];
    console.log('[PREFIJO] Prefijo detectado:', usedPrefix);

    // 5. EXTRACCIÓN DEL COMANDO (con verificación)
    const fullCmd = m.text.slice(usedPrefix.length).trim();
    if (!fullCmd) {
      console.log('[IGNORADO] Comando vacío después del prefijo');
      return;
    }
    
    const [command, ...args] = fullCmd.split(/\s+/);
    const cmd = command.toLowerCase();
    console.log('[COMANDO] Comando a procesar:', cmd);

    // 6. VERIFICACIÓN DE COMANDO (CON DIAGNÓSTICO DETALLADO)
    const commandExists = checkCommandExists(cmd);
    console.log('[VERIFICACIÓN] Comando existe:', commandExists);
    
    if (!commandExists) {
      console.log('[COMANDO INVÁLIDO] Iniciando manejo...');
      await handleInvalidCommand(m, usedPrefix, cmd);
      return;
    }

    // ... (aquí continúa tu lógica normal para comandos válidos)

  } catch (error) {
    console.error('[ERROR CRÍTICO] en before handler:', error);
    try {
      await m.reply('⚠️ Error interno al procesar tu comando');
    } catch (err) {
      console.error('[ERROR] No se pudo enviar mensaje de error:', err);
    }
  }
}

// FUNCIÓN MEJORADA PARA MANEJO DE COMANDOS INVÁLIDOS
async function handleInvalidCommand(m, prefix, invalidCmd) {
  try {
    console.log(`[MANEJO INVÁLIDO] Procesando comando no reconocido: ${invalidCmd}`);
    
    // 1. Preparar mención al usuario
    const userMention = m.sender ? `@${m.sender.split('@')[0]}` : 'Usuario';
    
    // 2. Obtener sugerencias (con diagnóstico)
    const suggestions = getCommandSuggestions(invalidCmd);
    console.log('[SUGERENCIAS] Posibles comandos similares:', suggestions);
    
    // 3. Construir respuesta
    let replyMsg = `❌ *${userMention}, el comando no existe:* \`${prefix}${invalidCmd}\`\n`;
    
    if (suggestions.length > 0) {
      replyMsg += `\n🔍 ¿Quizás quisiste decir?\n${suggestions.map(s => `→ \`${prefix}${s}\``).join('\n')}\n`;
    }
    
    replyMsg += `\n📝 Usa *${prefix}help* para ver todos los comandos.`;
    
    // 4. Enviar respuesta (con múltiples intentos)
    console.log('[RESPUESTA] Mensaje a enviar:', replyMsg);
    
    try {
      await m.reply(replyMsg, { mentions: [m.sender] });
      console.log('[ÉXITO] Respuesta enviada correctamente');
    } catch (error) {
      console.error('[FALLO] No se pudo enviar reply, intentando método alternativo...');
      await this.sendMessage(m.chat, { text: replyMsg }, { quoted: m });
    }
    
  } catch (error) {
    console.error('[ERROR] En handleInvalidCommand:', error);
  }
}

// FUNCIÓN DIAGNÓSTICO PARA VERIFICAR COMANDOS
function checkCommandExists(cmd) {
  console.log('[CHECK] Verificando existencia de comando:', cmd);
  
  if (!global.plugins || typeof global.plugins !== 'object') {
    console.error('[ERROR] global.plugins no es un objeto válido');
    return false;
  }
  
  const plugins = Object.values(global.plugins);
  console.log('[CHECK] Total de plugins a verificar:', plugins.length);
  
  for (const plugin of plugins) {
    if (!plugin || typeof plugin !== 'object') continue;
    
    if (plugin.command) {
      const commands = Array.isArray(plugin.command) 
        ? plugin.command 
        : [plugin.command];
      
      console.log(`[CHECK] Comandos en plugin: ${commands.join(', ')}`);
      
      if (commands.some(c => c.toLowerCase() === cmd)) {
        console.log('[CHECK] Comando encontrado en plugin');
        return true;
      }
    }
  }
  
  console.log('[CHECK] Comando no encontrado en ningún plugin');
  return false;
}

// (Mantener las mismas funciones getCommandSuggestions y stringSimilarity de la solución anterior)
