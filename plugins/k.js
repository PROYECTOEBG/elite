import fs from 'fs';
import path from 'path';

// Ruta completa a la carpeta donde están los sub-bots
const SESSIONS_DIR = './GataJadiBot/';

// Regex que detecta el mensaje de error en la consola
const regex = /Sub-bot\s+\(\+?(\d+)\)\s+no tiene creds\.json/i;

/**
 * Elimina automáticamente la carpeta del sub-bot si no tiene creds.json
 * @param {string} logLine - Línea de consola
 */
function monitorearCredenciales(logLine) {
  const match = regex.exec(logLine);
  if (match) {
    const numero = match[1];
    const carpeta = path.join(SESSIONS_DIR, numero);

    if (fs.existsSync(carpeta)) {
      fs.rmSync(carpeta, { recursive: true, force: true });
      console.log(`[AUTO] Sub-bot ${numero} eliminado por falta de creds.json`);
    } else {
      console.log(`[AUTO] Carpeta del sub-bot ${numero} no encontrada`);
    }
  }
}

// Interceptar la salida de consola para revisar mensajes
const originalLog = console.log;

console.log = function (...args) {
  const line = args.join(' ');
  monitorearCredenciales(line);
  originalLog.apply(console, args);
};
