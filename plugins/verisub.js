import fs from 'fs/promises';
import { exec } from 'child_process';
import path from 'path';

const rutaSubbots = '/home/container/GataJadiBot'; // NUEVA ruta confirmada

async function verificarYReactivarSubbots() {
  console.log(`[SUBBOTS] ⏳ Verificando subbots en ${rutaSubbots} - ${new Date().toLocaleTimeString()}`);

  try {
    const carpetas = await fs.readdir(rutaSubbots, { withFileTypes: true });
    const subbots = carpetas.filter(dir => dir.isDirectory()).map(dir => dir.name);

    if (subbots.length === 0) {
      console.log('[SUBBOTS] ⚠️ No hay subbots dentro de GataBotSession.');
      return;
    }

    for (const subbot of subbots) {
      try {
        const activo = await isSubbotActivo(subbot);
        if (!activo) {
          console.log(`[SUBBOT] ❌ ${subbot} está inactivo. Reactivando...`);
          await activarSubbot(subbot);
        } else {
          console.log(`[SUBBOT] ✅ ${subbot} activo.`);
        }
      } catch (e) {
        console.log(`[ERROR] Fallo con ${subbot}:`, e);
      }
    }

    console.log(`[SUBBOTS] ✅ Verificación terminada.`);
  } catch (err) {
    console.error('[ERROR] No se pudo acceder a GataBotSession:', err);
  }
}

async function isSubbotActivo(nombre) {
  return new Promise((resolve) => {
    exec(`pgrep -f ${nombre}`, (error, stdout) => {
      resolve(!!stdout.trim());
    });
  });
}

async function activarSubbot(nombre) {
  return new Promise((resolve, reject) => {
    const ruta = path.join(rutaSubbots, nombre);
    const comando = `cd ${ruta} && npm start`; // o node index.js según tu caso

    exec(comando, (error) => {
      if (error) {
        console.error(`[ERROR] ❌ No se pudo iniciar ${nombre}:`, error);
        reject(error);
      } else {
        console.log(`[SUBBOT] 🔁 ${nombre} reactivado.`);
        resolve();
      }
    });
  });
}

// ⏱️ Ejecutar ahora y luego cada 2 minutos
verificarYReactivarSubbots();
setInterval(verificarYReactivarSubbots, 2 * 60 * 1000);
