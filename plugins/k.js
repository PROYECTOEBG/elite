import fs from 'fs';
import path from 'path';

const SESSIONS_DIR = './GataJadiBot/';

const regexes = [
  /Sub-bot\s+\+?(\d+)\s+no tiene creds\.json/i,
  /!\s+Creds no encontradas para\s+(\d+)/i
];

function limpiarTexto(texto) {
  return texto.replace(/\x1b[0-9;]*m/g, '');
}

function monitorearCredenciales(logLine) {
  const limpio = limpiarTexto(logLine);
  
  // DEBUG: mostrar línea capturada
  console.log('[DEBUG] Línea capturada:', JSON.stringify(limpio));

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

const interceptarSalida = (stream) => {
  const originalWrite = stream.write;

  stream.write = function (chunk, ...args) {
    const line = chunk.toString();
    monitorearCredenciales(line);
    return originalWrite.call(this, chunk, ...args);
  };
};

interceptarSalida(process.stdout);
interceptarSalida(process.stderr);
