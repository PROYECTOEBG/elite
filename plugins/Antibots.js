export async function before(m) {
  try {
    // 1. Diagnóstico inicial (puedes quitarlo después)
    console.log('Mensaje recibido:', m.text);
    if (!global.prefix) {
      console.warn('Advertencia: global.prefix no está definido, usando valor por defecto');
      global.prefix = /^[\.\!\#\/]/i; // Prefijo por defecto
    }

    // 2. Verificación básica del mensaje
    if (!m.text || typeof m.text !== 'string') {
      console.log('Mensaje sin texto ignorado');
      return;
    }

    // 3. Detección de prefijo mejorada
    const prefixRegex = new RegExp(`^(${escapeRegex(global.prefix.source || global.prefix)})`, 'i');
    const prefixMatch = m.text.match(prefixRegex);
    
    if (!prefixMatch) {
      console.log('Mensaje sin prefijo ignorado');
      return;
    }
    const usedPrefix = prefixMatch[0];

    // 4. Extracción del comando
    const fullCmd = m.text.slice(usedPrefix.length).trim();
    const [command, ...args] = fullCmd.split(/\s+/);
    const cmd = command.toLowerCase();

    console.log(`Procesando comando: ${cmd}`, `Prefijo: ${usedPrefix}`);

    // 5. Sistema de respuesta garantizada
    const replyWithFallback = async (text) => {
      try {
        await m.reply(text);
      } catch (error) {
        console.error('Error al enviar respuesta:', error);
        // Intento alternativo de respuesta
        await this.sendMessage(m.chat, { text: text }, { quoted: m });
      }
    };

    // 6. Manejo de comandos especiales
    if (cmd === 'bot') {
      console.log('Comando especial "bot" ignorado');
      return;
    }

    // 7. Verificación de comandos existentes
    const commandExists = checkCommandExists(cmd);
    console.log(`El comando ${cmd} existe:`, commandExists);

    if (!commandExists) {
      console.log(`Comando no reconocido: ${cmd}`);
      await handleWrongCommand(m, usedPrefix, cmd, replyWithFallback);
      return;
    }

    // 8. Ejecución de comandos válidos
    console.log(`Ejecutando comando válido: ${cmd}`);
    await executeValidCommand(m, usedPrefix, cmd, replyWithFallback);

  } catch (error) {
    console.error('Error crítico en before handler:', error);
    // Respuesta de emergencia
    await m.reply('⚠️ Se produjo un error interno. Por favor intenta nuevamente.');
  }
}

// Función mejorada para ejecutar comandos válidos
async function executeValidCommand(m, prefix, cmd, replyFn) {
  try {
    // 1. Inicialización de datos si no existen
    if (!global.db.data.chats) global.db.data.chats = {};
    if (!global.db.data.users) global.db.data.users = {};

    // 2. Obtener contexto del chat y usuario
    const chat = global.db.data.chats[m.chat] || {};
    const user = global.db.data.users[m.sender] || { commands: 0 };

    // 3. Verificar si el bot está baneado
    if (chat.isBanned) {
      console.log(`Bot baneado en el chat: ${m.chat}`);
      await replyFn(
        `🚫 El bot está desactivado en este grupo.\n` +
        `Un administrador puede activarlo con:\n` +
        `» ${prefix}bot on`
      );
      return;
    }

    // 4. Actualizar estadísticas
    user.commands = (user.commands || 0) + 1;
    console.log(`Comando ${cmd} ejecutado por ${m.sender}. Total: ${user.commands}`);

    // 5. Aquí deberías llamar al handler específico del comando
    // Ejemplo:
    // const plugin = findPluginForCommand(cmd);
    // await plugin.handler(m, { usedPrefix: prefix, args });
    
    // Respuesta temporal de prueba
    await replyFn(`✅ Comando ${cmd} recibido correctamente`);

  } catch (error) {
    console.error(`Error ejecutando comando ${cmd}:`, error);
    await replyFn('⚠️ Ocurrió un error al procesar tu comando. Por favor intenta nuevamente.');
  }
}

// Función auxiliar para escapar regex
function escapeRegex(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Resto de funciones auxiliares (checkCommandExists, handleWrongCommand, etc.) mantienen la misma implementación anterior
