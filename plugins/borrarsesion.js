const fs = require('fs');
const path = require('path');

let handler = async (m, { conn, args, usedPrefix, command }) => {
  if (!args[0]) {
    return m.reply(`*Uso correcto:*\n${usedPrefix + command} <número>\n*Ejemplo:* ${usedPrefix + command} 51912345678`);
  }

  let number = args[0].replace(/\D/g, '');
  if (!number) return m.reply('Número inválido.');

  let sessionFolder = path.join('./GataJadiBot', number);

  if (fs.existsSync(sessionFolder)) {
    try {
      fs.rmSync(sessionFolder, { recursive: true, force: true });
      m.reply(`✅ Se eliminó correctamente la sesión del subbot *${number}*.`);
    } catch (e) {
      console.error(e);
      m.reply(`❌ Error al eliminar la sesión del subbot *${number}*.`);
    }
  } else {
    m.reply(`❌ No se encontró ninguna sesión para el número *${number}*.`);
  }
};

handler.command = /^borrar$/i;
handler.owner = true; // Solo el dueño del bot puede usar este comando

module.exports = handler;
