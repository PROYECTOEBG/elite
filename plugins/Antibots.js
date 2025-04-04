export async function before(m) {
  // 1. Configuración esencial
  if (!global.prefix) global.prefix = /^[.!?#/]|^bot/i;
  if (!global.plugins) global.plugins = {};
  if (!global.db.data) global.db.data = { chats: {}, users: {} };

  // 2. Validación básica del mensaje
  if (!m.text || typeof m.text !== 'string') return;
  
  // 3. Detección del prefijo
  const prefixMatch = m.text.match(global.prefix);
  if (!prefixMatch) return;
  const usedPrefix = prefixMatch[0];

  // 4. Extracción del comando
  const fullCmd = m.text.slice(usedPrefix.length).trim();
  const [command, ...args] = fullCmd.split(/\s+/);
  const cmd = command.toLowerCase();

  // 5. Comandos especiales
  if (cmd === 'bot') return;

  // 6. Manejo de comandos
  if (!checkCommandExists(cmd)) {
    return await handleWrongCommand(m, usedPrefix, cmd);
  }

  // ... resto de tu lógica para comandos válidos
}

// Función mejorada de manejo de errores
async function handleWrongCommand(m, prefix, wrongCmd) {
  const userName = m.pushName || 'Usuario';
  const userMention = m.sender ? `@${m.sender.split('@')[0]}` : userName;

  const allCommands = getAllCommands();
  const suggestions = getSuggestions(wrongCmd, allCommands, 3);
  
  let reply = `🔍 *${userMention}, ese comando no existe:* \`${prefix}${wrongCmd}\`\n`;
  
  if (suggestions.length > 0) {
    reply += `\n¿Quizás quisiste decir? ${suggestions.map(cmd => `\n▸ \`${prefix}${cmd}\``).join('')}`;
  }
  
  reply += `\n\n📌 Usa \`${prefix}help\` para ver la lista completa de comandos.`;
  
  await m.reply(reply, { mentions: [m.sender] });
}

// Funciones auxiliares (mantener igual que antes)
function checkCommandExists(cmd) {
  // ... misma implementación anterior
}

function getAllCommands() {
  // ... misma implementación anterior
}

function getSuggestions(wrongCmd, allCommands, max = 3) {
  // ... misma implementación anterior
}
