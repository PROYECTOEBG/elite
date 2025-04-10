import fs from 'fs';
import path from 'path';

// Ruta completa a la carpeta donde están los sub-bots
const SESSIONS_DIR = './GataJadiBot/';

// Expresiones regulares para detectar errores de creds
const regexes = [
  /Sub-bot\s+\+?(\d+)\s+no tiene creds\.json/i,
  /!\s+Creds no encontradas para\s+(\d+)/i
];

// Elimina caracteres ANSI (códigos de color de consola)
function limpiarTexto(texto) {
  return texto.replace(/\x1b[0-9;]*m/g, '');
}

/**
 * Elimina automáticamente la carpeta del sub-bot si no tiene creds.json
 * @param {string} logLine - Línea de consola
 */
function monitorearCredenciales(logLine) {
  const limpio = limpiarTexto(logLine);
  for (const regex of regexes) {
    const match = regex.exec(limpio);
    if (match) {
      const numero = match[1];
      const carpeta = path.join(SESSIONS_DIR, numero);

      if (fs.existsSync(carpeta)) {
        fs.rmSync(carpeta, { recursive: true, force: true });
        console.log(`[AUTO] Sub-bot ${numero} eliminado por falta de creds.json`);
      } else {
        console.log(`[AUTO] Carpeta del sub-bot ${numero} no encontrada`);
      }
      break;
    }
  }
}

// Interceptar salidas de consola
const interceptar = (originalFn) => {
  return function (...args) {
    const line = args.join(' ');
    monitorearCredenciales(line);
    originalFn.apply(console, args);
  };
};

console.log = interceptar(console.log);
console.warn = interceptar(console.warn);
console.error = interceptar(console.error);
