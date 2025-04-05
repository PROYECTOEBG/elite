import fs from 'fs/promises';
import path from 'path';
import { exec } from 'child_process';

const rutaSubbots = '/home/container/GataJadiBot/';
const archivoEjecucion = 'bot.js'; // Cambia si tus subbots usan otro archivo principal
const archivoEstado = 'activo.txt';  // Archivo que indica si el subbot está activo

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

// Verificación basada en la existencia de un archivo de estado
function isSubbotActivo(nombre) {
  const rutaEstado = path.join(rutaSubbots, nombre, archivoEstado);
  return fs.access(rutaEstado)
    .then(() => true)  // Si el archivo existe, el subbot está activo
    .catch(() => false);  // Si no, el subbot no está activo
}

function activarSubbot(nombre) {
  return new Promise((resolve, reject) => {
    const rutaCompleta = path.join(rutaSubbots, nombre, archivoEjecucion);
    
    // Iniciar el subbot y crear el archivo de estado
    exec(`node "${rutaCompleta}"`, (err, stdout, stderr) => {
      if (err) {
        console.error(`[ERROR] No se pudo iniciar ${nombre}:`, stderr);
        return reject(err);
      }
      
      // Crear el archivo de estado que indica que el subbot está activo
      const rutaEstado = path.join(rutaSubbots, nombre, archivoEstado);
      fs.writeFile(rutaEstado, 'activo', (err) => {
        if (err) {
          console.error(`[ERROR] No se pudo crear el archivo de estado para ${nombre}:`, err);
        } else {
          console.log(`[SUBBOT] ${nombre} activado y archivo de estado creado.`);
        }
      });
      
      resolve();
    });
  });
}

verificarSubbots();
setInterval(verificarSubbots, 60 * 1000); // Cada minuto (puedes bajarlo a 1000ms si quieres)
