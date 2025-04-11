import fs from 'fs';
import path from 'path';

// Carpeta base de sub-bots
const SESSIONS_DIR = path.join(process.cwd(), 'GataJadiBot');

// Regex para detectar "Intentando reconectar (+<número>)"
const regexReconn = /Intentando reconectar\s+\+?(\d+)/i;

// Guardamos la función original de console.log
const originalLog = console.log;

// Interceptamos console.log
console.log = function (...args) {
  // Convertimos el array de args en un string
  const line = args.join(' ');

  // Llamamos a la función original para que aparezca el log normal
  originalLog.apply(console, args);

  // Buscamos el patrón "Intentando reconectar (+<número>)"
  const match = line.match(regexReconn);
  if (match) {
    const numero = match[1];
    // Ruta a creds.json del sub-bot
    const credsPath = path.join(SESSIONS_DIR, numero, 'creds.json');

    // Si existe, lo eliminamos
    if (fs.existsSync(credsPath)) {
      try {
        fs.rmSync(credsPath, { force: true });
        originalLog(`[AUTO] creds.json eliminada para el sub-bot +${numero}`);
      } catch (error) {
        originalLog(`[AUTO] Error al eliminar creds.json para +${numero}:`, error);
      }
    } else {
      originalLog(`[AUTO] No se encontró creds.json para el sub-bot +${numero}`);
    }
  }
};
