const fs = require('fs');
const path = require('path');

let handler = async (m, { conn, args, usedPrefix, command }) => {
  console.log(`[.borrar] Comando recibido: ${args[0]}`);

  if (!args[0]) {
    return m.reply(`*Uso correcto:*\n${usedPrefix + command} <número>\n*Ejemplo:* ${usedPrefix + command} 51912345678`);
  }

  let number = args[0].replace(/\D/g, '');
  if (!number) return m.reply('Número inválido.');

  let sessionFolder = path.join('./GataJadiBot', number);
  console.log(`[.borrar] Buscando carpeta: ${sessionFolder}`);

  if (fs.existsSync(sessionFolder)) {
    try {
      fs.rmSync(sessionFolder, { recursive: true, force: true });
      console.log(`[.borrar] Carpeta eliminada: ${sessionFolder}`);
      m.reply(`✅ Se eliminó correctamente la sesión del subbot *${number}*.`);
    } catch (e) {
      console.error(`[.borrar] Error eliminando carpeta:`, e);
      m.reply(`❌ Error al eliminar la sesión del subbot *${number}*.`);
    }
  } else {
    m.reply(`❌ No se encontró ninguna sesión para el número *${number}*.`);
  }
};

handler.command = /^borrar$/i;
handler.owner = true;

module.exports = handler;
