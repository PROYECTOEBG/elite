import fs from 'fs/promises';
import path from 'path';

const rutaSubbots = '/home/container/GataJadiBot/';
const archivoPreKey = 'pre_key';  // Nombre del archivo con la preclave
const archivoSenderKey = 'sender_key';  // Nombre del archivo con la clave del sender

// Función para conectar el subbot
async function conectarSubbot(nombre) {
  try {
    // Verificar si los archivos existen
    const preKeyPath = path.join(rutaSubbots, nombre, archivoPreKey);
    const senderKeyPath = path.join(rutaSubbots, nombre, archivoSenderKey);

    // Si los archivos no existen, mostramos un mensaje y retornamos
    try {
      await fs.access(preKeyPath);
      await fs.access(senderKeyPath);
    } catch (err) {
      console.error(`[ERROR] Los archivos necesarios para el subbot ${nombre} no se encontraron.`);
      return;
    }

    // Si los archivos existen, cargarlos
    const preKey = await fs.readFile(preKeyPath, 'utf8');
    const senderKey = await fs.readFile(senderKeyPath, 'utf8');

    // Aquí iría la lógica para conectar el subbot usando las claves
    console.log(`[SUBBOT] ${nombre} - Conectado con éxito usando las claves:`);
    console.log(`[SUBBOT] preKey: ${preKey}`);
    console.log(`[SUBBOT] senderKey: ${senderKey}`);
    // Lógica de conexión simulada aquí...

  } catch (err) {
    console.error(`[ERROR] No se pudo conectar el subbot ${nombre}:`, err);
  }
}

// Función para revisar si el subbot está activo
async function isSubbotActivo(nombre) {
  try {
    const preKeyPath = path.join(rutaSubbots, nombre, archivoPreKey);
    const senderKeyPath = path.join(rutaSubbots, nombre, archivoSenderKey);

    const existePreKey = await fs.access(preKeyPath).then(() => true).catch(() => false);
    const existeSenderKey = await fs.access(senderKeyPath).then(() => true).catch(() => false);

    return existePreKey && existeSenderKey;
  } catch (err) {
    console.error(`[ERROR] Error al verificar si el subbot ${nombre} está activo:`, err);
    return false;
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
