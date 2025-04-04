import { promises as fs, existsSync } from 'fs';
import path from 'path';

async function limpiarSession() {
  const sessionPath = './GataBotSession/';
  try {
    if (!existsSync(sessionPath)) {
      console.log('[LIMPIEZA] Carpeta de sesión no existe o está vacía');
      return;
    }

    const files = await fs.readdir(sessionPath);
    let filesDeleted = 0;

    for (const file of files) {
      if (file !== 'creds.json') {
        await fs.unlink(path.join(sessionPath, file));
        filesDeleted++;
      }
    }

    if (filesDeleted === 0) {
      console.log('[LIMPIEZA] No se encontraron archivos para eliminar.');
    } else {
      console.log(`[LIMPIEZA] Se eliminaron ${filesDeleted} archivos de sesión.`);
    }
  } catch (err) {
    console.error('[LIMPIEZA] Error al limpiar sesión:', err);
  }
}

// Ejecutar la limpieza al iniciar
limpiarSession();

// Ejecutar cada 1 minuto
setInterval(() => {
  limpiarSession();
}, 60 * 1000); // 60 segundos
