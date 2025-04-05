import fs from 'fs/promises';
import path from 'path';
import { exec } from 'child_process';

const rutaSubbots = '/home/container/GataJadiBot/';
const archivoPreKey = 'pre_key';  // Ruta al archivo 'pre_key'
const archivoSenderKey = 'sender_key';  // Ruta al archivo 'sender_key'

// Función para iniciar el subbot directamente con las claves
async function iniciarSubbotDirectamente(nombre) {
  try {
    const preKey = await fs.readFile(path.join(rutaSubbots, nombre, archivoPreKey), 'utf8');
    const senderKey = await fs.readFile(path.join(rutaSubbots, nombre, archivoSenderKey), 'utf8');

    console.log(`[SUBBOT] ${nombre} - Claves cargadas con éxito.`);
    console.log(`[SUBBOT] preKey: ${preKey}`);
    console.log(`[SUBBOT] senderKey: ${senderKey}`);

    // Aquí es donde puedes agregar la lógica que el subbot debería ejecutar
    // Por ejemplo, si el bot se conecta a una API, realiza alguna operación, etc.

    console.log(`[SUBBOT] ${nombre} ejecutado correctamente.`);
  } catch (err) {
    console.error(`[ERROR] No se pudo iniciar el subbot ${nombre}:`, err);
  }
}

// Función para verificar los subbots y asegurarse de que se ejecuten
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
          await iniciarSubbotDirectamente(subbot);
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

// Función para comprobar si el subbot está activo
function isSubbotActivo(nombre) {
  return new Promise((resolve, reject) => {
    exec(`ps aux | grep "${nombre}" | grep -v grep`, (err, stdout) => {
      if (err) return reject(err);
      resolve(stdout.includes(nombre));
    });
  });
}

// Llamada inicial para verificar los subbots
verificarSubbots();

// Verificación continua cada minuto
setInterval(verificarSubbots, 60 * 1000); // Cada minuto (puedes cambiar el intervalo)
