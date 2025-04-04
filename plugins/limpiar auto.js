import fs from 'fs';
import path from 'path';

const carpeta = './GataBotSession/'; // Ruta de la carpeta a limpiar

function limpiarCarpeta() {
  if (!fs.existsSync(carpeta)) {
    console.log(`[!] La carpeta ${carpeta} no existe.`);
    return;
  }

  const archivos = fs.readdirSync(carpeta);

  if (archivos.length === 0) {
    console.log(`[✓] No hay archivos que eliminar en ${carpeta}.`);
    return;
  }

  archivos.forEach(archivo => {
    const rutaArchivo = path.join(carpeta, archivo);
    try {
      fs.unlinkSync(rutaArchivo);
      console.log(`[✓] Eliminado: ${archivo}`);
    } catch (err) {
      console.error(`[X] Error al eliminar ${archivo}:`, err.message);
    }
  });
}

console.log('Iniciando limpieza automática cada 1 minuto...');
limpiarCarpeta(); // primera limpieza inmediata

setInterval(limpiarCarpeta, 60 * 1000); // cada 60 segundos
