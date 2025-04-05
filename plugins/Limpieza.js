/*import { promises as fs, existsSync } from 'fs';
import path from 'path';

// Carpeta de sesión que se limpia (excepto creds.json)
const sessionPath = './GataBotSession/';

// Limpieza de sesión
async function limpiarSession() {
  try {
    console.log('[LIMPIEZA] Iniciando limpieza de sesión...');

    if (!existsSync(sessionPath)) {
      console.log(`[LIMPIEZA] Carpeta no encontrada: ${sessionPath}`);
      return;
    }

    const files = await fs.readdir(sessionPath);
    console.log(`[LIMPIEZA] Archivos encontrados: ${files.join(', ')}`);

    let eliminados = 0;

    for (const file of files) {
      if (file !== 'creds.json') {
        await fs.unlink(path.join(sessionPath, file));
        console.log(`[LIMPIEZA] Eliminado: ${file}`);
        eliminados++;
      }
    }

    console.log(`[LIMPIEZA] Archivos de sesión eliminados: ${eliminados}`);
  } catch (err) {
    console.error('[ERROR] Al limpiar sesión:', err);
  }
}

// Función principal
async function mantenimiento() {
  console.log(`[LIMPIEZA] Limpieza ejecutada a las ${new Date().toLocaleTimeString()}`);
  await limpiarSession();
}

// Ejecutar al inicio
mantenimiento();

// Repetir cada minuto
setInterval(() => {
  mantenimiento();
}, 60 * 1000); // 60 segundos = 1 minuto
*/
