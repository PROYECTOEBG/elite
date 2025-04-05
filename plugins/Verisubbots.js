import fs from 'fs/promises';
import { exec } from 'child_process';
import path from 'path';

const rutaSubbots = './GataJadiBot/'; // Ruta donde están los subbots

// Función principal
async function verificarYReactivarSubbots() {
  console.log(`[SUBBOTS] 🔄 Iniciando verificación - ${new Date().toLocaleTimeString()}`);

  try {
    const carpetas = await fs.readdir(rutaSubbots, { withFileTypes: true });
    const subbots = carpetas.filter(dir => dir.isDirectory()).map(dir => dir.name);

    if (subbots.length === 0) {
      console.log('[SUBBOTS] ⚠️ No se encontraron subbots.');
      return;
    }

    for (const subbot of subbots) {
      try {
        const activo = await isSubbotActivo(subbot);
        if (!activo) {
          console.log(`[SUBBOT] ❌ ${subbot} está inactivo. Intentando reactivarlo...`);
          await activarSubbot(subbot);
        } else {
          console.log(`[SUBBOT] ✅ ${subbot} está activo.`);
        }
      } catch (e) {
        console.log(`[ERROR] ❌ Al verificar/activar ${subbot}:`, e);
      }
    }

    console.log(`[SUBBOTS] ✅ Verificación completada.`);
  } catch (err) {
    console.error('[ERROR] ❌ No se pudo acceder a la carpeta de subbots:', err);
  }
}

// 💡 Función para verificar si un subbot está activo (ajusta según tu sistema)
async function isSubbotActivo(subbot) {
  return new Promise((resolve) => {
    exec(`pgrep -f ${subbot}`, (error, stdout) => {
      resolve(!!stdout.trim()); // Si hay salida, el proceso está activo
    });
  });
}

// 🚀 Función para activar un subbot (ajusta según cómo los inicias)
async function activarSubbot(subbot) {
  return new Promise((resolve, reject) => {
    const comando = `cd ${path.join(rutaSubbots, subbot)} && npm start`; // Ajusta según tu bot
    exec(comando, (error) => {
      if (error) {
        console.error(`[ERROR] ❌ No se pudo iniciar ${subbot}:`, error);
        reject(error);
      } else {
        console.log(`[SUBBOT] 🔥 ${subbot} ha sido reactivado.`);
        resolve();
      }
    });
  });
}

// 🔄 Iniciar la verificación cada 2 minutos
verificarYReactivarSubbots();
setInterval(verificarYReactivarSubbots, 2 * 60 * 1000);
