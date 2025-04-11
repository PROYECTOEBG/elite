import fs from 'fs';
import path from 'path';

// Ruta completa a la carpeta donde están los sub-bots
const SESSIONS_DIR = './GataJadiBot/';

// Regex para detectar mensajes relevantes
const regexNoCreds = /Sub-bot\s+\+?(\d+)\s+no tiene creds\.json/i;
const regexReconectando = /Intentando reconectar\s+\+?(\d+)/i;

/**
 * Elimina automáticamente la carpeta del sub-bot si hay mensajes específicos
 * @param {string} logLine - Línea de consola
 */
function monitorearLineaConsola(logLine) {
  let match = regexNoCreds.exec(logLine);
  if (match) {
    eliminarCarpeta(match[1], 'falta de creds.json');
    return;
  }

  match = regexReconectando.exec(logLine);
  if (match) {
    eliminarCarpeta(match[1], 'fallo de reconexión');
    return;
  }
}

/**
 * Elimina la carpeta del número dado
 * @param {string} numero - Número del sub-bot
 * @param {string} razon - Razón de eliminación
 */
function eliminarCarpeta(numero, razon) {
  const carpeta = path.join(SESSIONS_DIR, numero);

  if (fs.existsSync(carpeta)) {
    fs.rmSync(carpeta, { recursive: true, force: true });
    console.log(`[AUTO] Sub-bot ${numero} eliminado por ${razon}`);
  } else {
    console.log(`[AUTO] Carpeta del sub-bot ${numero} no encontrada`);
  }
}

// Interceptar la salida de consola
const originalLog = console.log;

console.log = function (...args) {
  const line = args.join(' ');
  monitorearLineaConsola(line);
  originalLog.apply(console, args);
};
