import fs from 'fs/promises';
import path from 'path';
import { exec } from 'child_process';

const rutaSubbots = '/home/container/GataJadiBot/';
const archivoEjecucion = 'bot.js'; // Cambia si tus subbots usan otro archivo principal

async function verificarSubbots() {
  console.log(`\n[SUBBOTS] Verificación iniciada - ${new Date().toLocaleTimeString()}`);

  try {
    const carpetas = await fs.readdir(rutaSubbots, { withFileTypes: true });
    const subbots = carpetas.filter(dir => dir.isDirectory()).map(dir => dir.name);

    if (subbots.length === 0) {
      console.log('[SUBBOTS] No se encontraron subbots en la carpeta.');
      return;
    }

    for (const subbot of subbots) {
      try {
        const activo = await isSubbotActivo(subbot);
        if (!activo) {
          console.log(`[SUBBOT] ${subbot} está inactivo. Reactivando...`);
          await activarSubbot(subbot);
        } else {
          console.log(`[SUBBOT] ${subbot} está activo.`);
        }
      } catch (e) {
        console.log(`[ERROR] Al verificar o reactivar ${subbot}:`, e);
      }
    }

    console.log(`[SUBBOTS] Verificación completada.`);
  } catch (err) {
    console.error('[ERROR] No se pudo acceder a la carpeta de subbots:', err);
  }
}

// Cambié esta parte para usar pgrep en lugar de ps
function isSubbotActivo(nombre) {
  return new Promise((resolve, reject) => {
    exec(`pgrep -f "${nombre}"`, (err, stdout) => {
      if (err) return reject(err);
      resolve(stdout.trim().length > 0);  // Si el resultado tiene longitud, el subbot está activo
    });
  });
}

function activarSubbot(nombre) {
  return new Promise((resolve, reject) => {
    const rutaCompleta = path.join(rutaSubbots, nombre, archivoEjecucion);
    exec(`node "${rutaCompleta}"`, (err, stdout, stderr) => {
      if (err) {
        console.error(`[ERROR] No se pudo iniciar ${nombre}:`, stderr);
        return reject(err);
      }
      console.log(`[SUBBOT] ${nombre} activado.`);
      resolve();
    });
  });
}

verificarSubbots();
setInterval(verificarSubbots, 60 * 1000); // Cada minuto (puedes bajarlo a 1000ms si quieres)
