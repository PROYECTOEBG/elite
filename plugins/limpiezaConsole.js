import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';
import { createInterface } from 'readline';

// Configuración avanzada
const config = {
  SESSION_PREFIX: 'GataJadibot_',
  MAX_RETRIES: 10,
  DEBUG: true, // Cambiar a false en producción
  RETRY_DELAY: 1000, // 1 segundo entre reintentos
  MAX_RETRY_ATTEMPTS: 5
};

// Sistema de logging mejorado
class Logger {
  static log(message, level = 'info') {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] [${level.toUpperCase()}] ${message}`;
    
    console[level](logMessage);
    
    // Escribir también en archivo de log
    if (config.DEBUG) {
      fs.appendFile('cleanup_debug.log', logMessage + '\n').catch(() => {});
    }
  }
}

// 1. Función de eliminación súper robusta
async function nuclearDelete(folderPath) {
  try {
    Logger.log(`Iniciando eliminación nuclear de: ${folderPath}`, 'debug');
    
    // Método 1: fs.promises.rm estándar
    try {
      await fs.rm(folderPath, { recursive: true, force: true, maxRetries: 3 });
      Logger.log(`✅ Eliminación exitosa (método estándar)`, 'info');
      return true;
    } catch (stdError) {
      Logger.log(`Método estándar falló: ${stdError.message}`, 'debug');
    }
    
    // Método 2: Cambiar permisos y reintentar
    try {
      await fs.chmod(folderPath, 0o777); // Dar todos los permisos
      await fs.rm(folderPath, { recursive: true, force: true });
      Logger.log(`✅ Eliminación exitosa (con cambio de permisos)`, 'info');
      return true;
    } catch (chmodError) {
      Logger.log(`Método de permisos falló: ${chmodError.message}`, 'debug');
    }
    
    // Método 3: Comandos del sistema operativo
    try {
      const command = process.platform === 'win32' 
        ? `rmdir /s /q "${folderPath}"`
        : `rm -rf "${folderPath}"`;
      
      execSync(command, { stdio: 'pipe' });
      Logger.log(`✅ Eliminación exitosa (comando del sistema)`, 'info');
      return true;
    } catch (cmdError) {
      Logger.log(`Comando del sistema falló: ${cmdError.message}`, 'debug');
    }
    
    // Método 4: Eliminación archivo por archivo
    try {
      const files = await fs.readdir(folderPath);
      await Promise.all(files.map(async file => {
        const curPath = path.join(folderPath, file);
        await fs.unlink(curPath);
      }));
      await fs.rmdir(folderPath);
      Logger.log(`✅ Eliminación exitosa (archivo por archivo)`, 'info');
      return true;
    } catch (manualError) {
      Logger.log(`Eliminación manual falló: ${manualError.message}`, 'debug');
    }
    
    Logger.log(`❌ Todos los métodos fallaron para: ${folderPath}`, 'error');
    return false;
    
  } catch (finalError) {
    Logger.log(`❌ Error inesperado en nuclearDelete: ${finalError.message}`, 'error');
    return false;
  }
}

// 2. Sistema de monitoreo mejorado
function setupMonitoring() {
  // Monitorear stdout
  const stdout = createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
  });

  stdout.on('line', processLogLine);
  
  // Monitorear stderr
  process.stderr.on('data', data => {
    processLogLine(data.toString());
  });
  
  Logger.log('Sistema de monitoreo activado', 'info');
}

// 3. Procesamiento inteligente de logs
async function processLogLine(line) {
  if (config.DEBUG) {
    Logger.log(`Línea recibida: ${line.trim()}`, 'debug');
  }
  
  if (line.includes('Intentando reconectar') && 
      new RegExp(`\\(Intento ${config.MAX_RETRIES}/10\\)`).test(line)) {
    
    const phoneMatch = line.match(/\(\+(\d{8,15})\)/);
    if (!phoneMatch) {
      Logger.log('No se encontró número de teléfono en el mensaje', 'warn');
      return;
    }
    
    const phone = phoneMatch[1];
    Logger.log(`⚠️ Detectado fallo crítico para: +${phone}`, 'warn');
    
    const folderPath = path.join(
      path.dirname(fileURLToPath(import.meta.url)), 
      `${config.SESSION_PREFIX}${phone}`
    );
    
    Logger.log(`Iniciando eliminación de: ${folderPath}`, 'info');
    
    // Verificar si la carpeta existe primero
    try {
      await fs.access(folderPath);
    } catch {
      Logger.log(`La carpeta ${folderPath} no existe`, 'warn');
      return;
    }
    
    // Eliminar con múltiples intentos
    for (let attempt = 1; attempt <= config.MAX_RETRY_ATTEMPTS; attempt++) {
      Logger.log(`Intento de eliminación ${attempt}/${config.MAX_RETRY_ATTEMPTS}`, 'info');
      
      if (await nuclearDelete(folderPath)) {
        return; // Éxito
      }
      
      if (attempt < config.MAX_RETRY_ATTEMPTS) {
        await new Promise(resolve => setTimeout(resolve, config.RETRY_DELAY));
      }
    }
    
    Logger.log(`❌ No se pudo eliminar después de ${config.MAX_RETRY_ATTEMPTS} intentos`, 'error');
  }
}

// 4. Sistema de autodiagnóstico
async function runDiagnostics() {
  Logger.log('=== INICIANDO DIAGNÓSTICO ===', 'info');
  
  // 1. Verificar permisos
  try {
    const testDir = path.join(path.dirname(fileURLToPath(import.meta.url)), 'test_dir');
    await fs.mkdir(testDir);
    await fs.writeFile(path.join(testDir, 'test.txt'), 'test');
    await nuclearDelete(testDir);
    Logger.log('✅ Prueba de permisos y eliminación exitosa', 'info');
  } catch (error) {
    Logger.log(`❌ Error en prueba de permisos: ${error.message}`, 'error');
  }
  
  // 2. Verificar sistema de archivos
  try {
    const freeSpace = execSync('df -h .').toString();
    Logger.log(`📊 Espacio en disco:\n${freeSpace}`, 'info');
  } catch {
    Logger.log('No se pudo verificar espacio en disco', 'warn');
  }
  
  Logger.log('=== DIAGNÓSTICO COMPLETADO ===', 'info');
}

// Inicialización
(async () => {
  await runDiagnostics();
  setupMonitoring();
  
  Logger.log('🛡️ Plugin de limpieza cargado y listo', 'info');
  
  // Simulación para pruebas (descomentar para probar)
  // setTimeout(() => {
  //   console.log(`Intentando reconectar (+593968467001) en 5 segundos... (Intento ${config.MAX_RETRIES}/10)`);
  // }, 3000);
})();
