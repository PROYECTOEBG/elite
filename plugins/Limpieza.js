import { promises as fs, existsSync } from 'fs';
import path from 'path';

// Carpeta de sesión que se limpia (excepto creds.json)
const sessionPath = './GataBotSession/';
// Carpetas comunes para archivos temporales o medios
const carpetasTemporales = ['./media', './temp', './downloads', './tmp'];

// Limpieza de sesión
async function limpiarSession() {
  try {
    if (!existsSync(sessionPath)) {
      console.log('[LIMPIEZA] Carpeta de sesión no existe.');
      return;
    }

    const files = await fs.readdir(sessionPath);
    let eliminados = 0;

    for (const file of files) {
      if (file !== 'creds.json') {
        await fs.unlink(path.join(sessionPath, file));
        eliminados++;
      }
    }

    console.log(`[LIMPIEZA] Archivos de sesión eliminados: ${eliminados}`);
  } catch (err) {
    console.error('[ERROR] Al limpiar sesión:', err);
  }
}

// Limpieza de carpetas temporales
async function limpiarCarpetaTemporal(carpeta) {
  try {
    if (!existsSync(carpeta)) return;

    const files = await fs.readdir(carpeta);
    let eliminados = 0;

    for (const file of files) {
      const fullPath = path.join(carpeta, file);
      const stat = await fs.lstat(fullPath);
      if (stat.isFile()) {
        await fs.unlink(fullPath);
        eliminados++;
      }
    }

    console.log(`[LIMPIEZA] ${carpeta}: ${eliminados} archivos eliminados.`);
  } catch (err) {
    console.error(`[ERROR] No se pudo limpiar ${carpeta}:`, err);
  }
}

// Monitoreo de memoria
function monitorearMemoria() {
  const memoria = process.memoryUsage().heapUsed / 1024 / 1024;
  console.log(`[MEMORIA] Uso actual: ${Math.round(memoria * 100) / 100} MB`);
}

// Limpieza de consola
function limpiarConsola() {
  console.clear();
  console.log(`[CONSOLa] Consola limpiada automáticamente a las ${new Date().toLocaleTimeString()}`);
}

// Función principal
async function mantenimiento() {
  limpiarConsola();
  await limpiarSession();
  for (const carpeta of carpetasTemporales) {
    await limpiarCarpetaTemporal(carpeta);
  }
  monitorearMemoria();
}

// Ejecutar al inicio
mantenimiento();

// Repetir cada minuto
setInterval(() => {
  mantenimiento();
}, 60 * 1000);
