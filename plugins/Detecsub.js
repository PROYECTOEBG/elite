import fs from 'fs/promises';
import path from 'path';
import { exec } from 'child_process';

const rutaSubbots = '/home/container/GataJadiBot/';

// Función para verificar si el subbot está en ejecución
function isSubbotActivo(nombre) {
  return new Promise((resolve, reject) => {
    // Verificar si el subbot tiene un proceso en ejecución
    exec(`ps aux | grep "${nombre}" | grep -v grep`, (err, stdout, stderr) => {
      if (err) return reject(err);

      // Si la salida contiene el nombre del subbot, significa que está en ejecución
      if (stdout.includes(nombre)) {
        resolve(true);
      } else {
        resolve(false);
      }
    });
  });
}

// Función para conectar el subbot (sin necesidad de verificar pre_key y sender_key)
async function conectarSubbot(nombre) {
  try {
    // Intentamos conectar el subbot sin verificar los archivos pre_key y sender_key
    console.log(`[SUBBOT] ${nombre} - Conectando...`);
    // Aquí va tu lógica de conexión real para el subbot

  } catch (err) {
    console.error(`[ERROR] No se pudo conectar el subbot ${nombre}:`, err);
  }
}

// Función principal para verificar los subbots
async function verificarSubbots() {
  console.log('[INFO] Ejecutando verificarSubbots...');

  try {
    const carpetas = await fs.readdir(rutaSubbots, { withFileTypes: true });
    const subbots = carpetas.filter(dir => dir.isDirectory()).map(dir => dir.name);

    if (subbots.length === 0) {
      console.log('[SUBBOTS] No se encontraron subbots en la carpeta.');
      return;
    }

    console.log(`[SUBBOTS] Se encontraron los siguientes subbots: ${subbots.join(', ')}`);

    for (const subbot of subbots) {
      const activo = await isSubbotActivo(subbot);
      if (!activo) {
        console.log(`[SUBBOT] ${subbot} está inactivo. Conectando...`);
        await conectarSubbot(subbot);
      } else {
        console.log(`[SUBBOT] ${subbot} está activo.`);
      }
    }

    console.log('[SUBBOTS] Verificación completada.');
  } catch (err) {
    console.error('[ERROR] No se pudo acceder a la carpeta de subbots:', err);
  }
}

// Ejecutar la verificación inicial
verificarSubbots();

// Verificación continua cada 1 minuto (60000ms)
setInterval(() => {
  console.log('[INFO] Verificando subbots...');
  verificarSubbots();
}, 60 * 1000); // Cada 1 minuto
