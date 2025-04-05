import fs from 'fs/promises';
import path from 'path';
import { exec } from 'child_process';
import { getProcesses } from 'ps-node'; // Usamos ps-node para listar procesos

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
    console.log(`[SUBBOT] ${nombre} ejecutado correctamente.`);
  } catch (err) {
    console.error(`[ERROR] No se pudo iniciar el subbot ${nombre}:`, err);
  }
}

// Función para comprobar si el subbot está activo usando ps-node
function isSubbotActivo(nombre) {
  return new Promise((resolve, reject) => {
    getProcesses({}, (err, processes) => {
      if (err) {
        console.error('[ERROR] Error al obtener procesos:', err);
        return reject(err);
      }

      // Depuración: mostrar los procesos encontrados
      console.log(`[SUBBOT] Procesos encontrados:`, processes);

      const subbotActivo = processes.some(process => process.command.includes(nombre));
      resolve(subbotActivo);
    });
  });
}

// Función para verificar los subbots y asegurarse de que se ejecuten
async function verificarSubbots() {
  console.log('[INFO] Ejecutando verificarSubbots...');  // Depuración

  console.log(`\n[SUBBOTS] Verificación iniciada - ${new Date().toLocaleTimeString()}`);
  
  try {
    const carpetas = await fs.readdir(rutaSubbots, { withFileTypes: true });
    console.log('[SUBBOTS] Carpetas encontradas:', carpetas);
    const subbots = carpetas.filter(dir => dir.isDirectory()).map(dir => dir.name);

    if (subbots.length === 0) {
      console.log('[SUBBOTS] No se encontraron subbots en la carpeta.');
      return;
    }

    console.log(`[SUBBOTS] Se encontraron los siguientes subbots: ${subbots.join(', ')}`);

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

// Llamada inicial para verificar los subbots
verificarSubbots();

// Verificación continua cada minuto
setInterval(() => {
  console.log('[INFO] Verificando subbots...');
  verificarSubbots();
}, 60 * 1000); // Cada 1 minuto (60000ms)
