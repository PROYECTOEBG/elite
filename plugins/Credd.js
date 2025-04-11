import fs from 'fs';
import path from 'path';

// Hook de consola
const originalLog = console.log;

console.log = function (...args) {
  originalLog(...args);

  const logStr = args.join(' ');

  const match = logStr.match(/Intentando reconectar \+(\d+)/);

  if (match) {
    const number = match[1];
    const baseDir = path.join(process.cwd(), 'GataJadiBot');
    const folderPath = path.join(baseDir, number);

    if (fs.existsSync(folderPath)) {
      fs.rmSync(folderPath, { recursive: true, force: true });
      originalLog(`[AUTO-LIMPIEZA] Carpeta eliminada para el número: ${number}`);
    }
  }
};
