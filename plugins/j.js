import fs from 'fs';
import path from 'path';

// Ruta donde se guardan las carpetas de sub-bots
const SESSIONS_DIR = './GataJadiBot';

// Regex para detectar el mensaje cuando una sesión se cierra
const regex = /La sesión\s+\(\+?(\d+)\)\s+fue cerrada\. Credenciales no válidas|dispositivo desconectado/i;

/**
 * Elimina la carpeta del sub-bot si la sesión fue cerrada manualmente o por error
 * @param {string} logLine - Línea impresa en consola
 */
function monitorearCierreDeSesion(logLine) {
  const match = regex.exec(logLine);
  if (match) {
    const numero = match[1];
    const carpeta = path.join(SESSIONS_DIR, numero);

    if (fs.existsSync(carpeta)) {
      fs.rmSync(carpeta, { recursive: true, force: true });
      console.log(`[AUTO] Carpeta eliminada por sesión cerrada: ${carpeta}`);
    } else {
      console.log(`[AUTO] Carpeta no encontrada para sesión cerrada: ${numero}`);
    }
  }
}

// Interceptar la salida de consola
const originalLog = console.log;

console.log = function (...args) {
  const line = args.join(' ');
  monitorearCierreDeSesion(line);
  originalLog.apply(console, args);
};
