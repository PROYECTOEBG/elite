import fs from 'fs/promises';
import path from 'path';

// Ruta donde están los subbots (ajústala si cambias la ubicación)
const rutaSubbots = '/home/container/GataJadiBot/';

// Función principal
async function verificarSubbots() {
  console.log(`[SUBBOTS] Verificación iniciada - ${new Date().toLocaleTimeString()}`);

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

// Simulación de funciones — Adáptalas según tu bot
async function isSubbotActivo(subbot) {
  // Aquí debes verificar si el subbot está activo. 
  // Puedes chequear si hay un proceso en ejecución o hacer un ping al bot.
  return Math.random() > 0.2; // Simulación: 80% de probabilidad de que esté activo.
}

async function activarSubbot(subbot) {
  // Aquí coloca tu lógica real para reiniciar el subbot.
  console.log(`[SUBBOT] Activando ${subbot}...`);
  await new Promise(res => setTimeout(res, 1000)); // Simulación de espera
}

// Inicia el proceso y repite cada 2 minutos
verificarSubbots();
setInterval(verificarSubbots, 2 * 60 * 1000);
