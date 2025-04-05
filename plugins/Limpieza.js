import { promises as fs, existsSync } from 'fs'; import path from 'path';

// Carpeta de sesión que se limpia (excepto creds.json) const sessionPath = './GataBotSession/';

// Limpieza de sesión async function limpiarSession() { try { if (!existsSync(sessionPath)) { console.log('[LIMPIEZA] Carpeta de sesión no existe.'); return; }

const files = await fs.readdir(sessionPath);
let eliminados = 0;

for (const file of files) {
  if (file !== 'creds.json') {
    await fs.unlink(path.join(sessionPath, file));
    eliminados++;
  }
}

console.log(`[LIMPIEZA] Archivos de sesión eliminados: ${eliminados}`);

} catch (err) { console.error('[ERROR] Al limpiar sesión:', err); } }

// Función principal async function mantenimiento() { await limpiarSession(); }

// Ejecutar al inicio mantenimiento();

// Repetir cada minuto setInterval(() => { mantenimiento(); }, 60 * 1000);

