import fs from 'fs/promises';
import { exec } from 'child_process';
import path from 'path';

// Configuración - Ajusta estas rutas según tu entorno
const rutaPrincipal = '/home/container/Gata.JadIBot';
const LOG_FILE = path.join(rutaPrincipal, 'subbots_monitor.log');
const INTERVALO_VERIFICACION = 60 * 1000; // 1 minuto en milisegundos

// Sistema de logging mejorado
async function log(message) {
  const timestamp = new Date().toLocaleTimeString();
  const logMessage = `[${timestamp}] ${message}\n`;
  
  try {
    await fs.appendFile(LOG_FILE, logMessage);
    console.log(logMessage.trim());
  } catch (error) {
    console.error('Error escribiendo en log:', error);
  }
}

// Detección inteligente de subbots
async function detectarSubbots() {
  try {
    const items = await fs.readdir(rutaPrincipal, { withFileTypes: true });
    const subbots = [];

    for (const item of items) {
      if (item.isDirectory()) {
        // Verifica si es un subbot válido (tiene package.json)
        try {
          await fs.access(path.join(rutaPrincipal, item.name, 'package.json'));
          subbots.push(item.name);
          await log(`✓ Subbot detectado: ${item.name}`);
        } catch {
          // No es un subbot válido
          continue;
        }
      }
    }

    return subbots;
  } catch (err) {
    await log(`Error detectando subbots: ${err.message}`);
    return [];
  }
}

// Verificación de estado
async function isSubbotActivo(subbot) {
  return new Promise((resolve) => {
    exec(`pgrep -f "${subbot}"`, (error, stdout) => {
      resolve(!error && stdout.trim().length > 0);
    });
  });
}

// Activación de subbots
async function activarSubbot(subbot) {
  const rutaSubbot = path.join(rutaPrincipal, subbot);
  const logSubbot = path.join(rutaSubbot, 'console.log');
  
  return new Promise((resolve, reject) => {
    const comando = `cd "${rutaSubbot}" && npm start >> "${logSubbot}" 2>&1 &`;
    
    exec(comando, (error, stdout, stderr) => {
      if (error || stderr) {
        reject(new Error(`Error iniciando ${subbot}: ${error?.message || stderr}`));
      } else {
        resolve();
      }
    });
  });
}

// Proceso principal de monitoreo
async function monitorearSubbots() {
  await log('\n🔃 Iniciando ciclo de monitoreo');
  
  try {
    const subbots = await detectarSubbots();
    
    if (subbots.length === 0) {
      await log('⚠️ No se encontraron subbots configurados');
      return;
    }

    await log(`📋 Subbots a verificar: ${subbots.join(', ')}`);

    // Procesamiento en paralelo
    await Promise.all(subbots.map(async (subbot) => {
      try {
        if (!await isSubbotActivo(subbot)) {
          await log(`⚡ Reactivando ${subbot}...`);
          await activarSubbot(subbot);
          await log(`✅ ${subbot} reactivado correctamente`);
        } else {
          await log(`👍 ${subbot} está activo`);
        }
      } catch (error) {
        await log(`❌ Error con ${subbot}: ${error.message}`);
      }
    }));

    await log('✅ Ciclo completado\n');
  } catch (error) {
    await log(`🔥 Error crítico: ${error.message}`);
  }
}

// Manejo de cierre
process.on('SIGINT', async () => {
  await log('🛑 Deteniendo monitor...');
  process.exit(0);
});

// Inicio del servicio
(async () => {
  await log('🚀 Iniciando monitor de subbots (1 minuto)');
  
  // Ejecución inmediata y luego cada minuto
  await monitorearSubbots();
  setInterval(monitorearSubbots, INTERVALO_VERIFICACION);
})();
