import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { createInterface } from 'readline';

// Configuración
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SESSION_PREFIX = 'GataJadibot_';
const MAX_RETRIES = 10;

// Sistema de logs detallado
const log = {
    info: (...args) => console.log('[INFO]', ...args),
    error: (...args) => console.error('[ERROR]', ...args),
    debug: (...args) => process.env.DEBUG && console.debug('[DEBUG]', ...args)
};

// 1. Función mejorada de borrado con múltiples intentos
async function deleteWithRetry(folderPath, retries = 3) {
    try {
        await fs.access(folderPath);
        log.info(`Eliminando carpeta: ${folderPath}`);
        
        // Primero intentamos cambiar permisos si hay problemas
        await fs.chmod(folderPath, 0o777);
        
        // Eliminar recursivamente
        await fs.rm(folderPath, { recursive: true, force: true, maxRetries: retries });
        
        log.info(`✅ Carpeta eliminada correctamente`);
        return true;
    } catch (error) {
        if (error.code === 'ENOENT') {
            log.error(`⚠️ La carpeta no existe: ${folderPath}`);
        } else {
            log.error(`❌ Error al eliminar ${folderPath}:`, error.message);
            
            // Intento alternativo: comando del sistema
            if (retries > 0) {
                log.info(`Reintentando (${retries} intentos restantes)...`);
                await new Promise(resolve => setTimeout(resolve, 1000));
                return deleteWithRetry(folderPath, retries - 1);
            }
            
            // Último recurso: usar comandos del sistema
            try {
                log.info('Probando con comandos del sistema...');
                const command = process.platform === 'win32' 
                    ? `rmdir /s /q "${folderPath}"`
                    : `rm -rf "${folderPath}"`;
                
                const { execSync } = await import('child_process');
                execSync(command);
                log.info('✅ Eliminado con comandos del sistema');
                return true;
            } catch (cmdError) {
                log.error('❌ Fallo incluso con comandos del sistema:', cmdError.message);
            }
        }
        return false;
    }
}

// 2. Monitorización activa del proceso
function monitorProcess() {
    const rl = createInterface({
        input: process.stdin,
        output: process.stdout,
        terminal: false
    });

    rl.on('line', async (line) => {
        log.debug('Línea recibida:', line);
        
        if (line.includes('Intentando reconectar') && line.includes(`(Intento ${MAX_RETRIES}/10)`)) {
            const phoneMatch = line.match(/\(\+(\d+)\)/);
            if (phoneMatch) {
                const phone = phoneMatch[1];
                log.info(`🛑 Detectado fallo crítico para: +${phone}`);
                
                const folderPath = path.join(__dirname, `${SESSION_PREFIX}${phone}`);
                await deleteWithRetry(folderPath);
                
                // Forzar salida si es necesario
                if (process.env.EXIT_ON_DELETE === 'true') {
                    process.exit(1);
                }
            }
        }
    });

    // También monitoreamos stderr
    process.stderr.on('data', (data) => {
        const message = data.toString();
        log.debug('Error recibido:', message);
        if (message.includes('Intentando reconectar')) {
            rl.emit('line', message);
        }
    });
}

// 3. Sistema de verificación de salud
async function healthCheck() {
    log.info('Iniciando verificación de salud del plugin...');
    
    // Prueba de permisos
    try {
        await fs.access(__dirname, fs.constants.W_OK);
        log.info('✅ Permisos de escritura verificados');
    } catch {
        log.error('❌ No hay permisos de escritura en el directorio');
    }
    
    // Prueba de eliminación (crea y borra archivo temporal)
    try {
        const testFile = path.join(__dirname, 'plugin_test.tmp');
        await fs.writeFile(testFile, 'test');
        await fs.unlink(testFile);
        log.info('✅ Permisos de eliminación verificados');
    } catch (error) {
        log.error('❌ Error en prueba de eliminación:', error.message);
    }
}

// Iniciar todo
(async () => {
    await healthCheck();
    monitorProcess();
    log.info('🔌 Plugin de limpieza iniciado correctamente');
    
    // Ejemplo para pruebas (descomentar)
    // setTimeout(() => {
    //     console.log(`Intentando reconectar (+593968467001) en 5 segundos... (Intento ${MAX_RETRIES}/10)`);
    // }, 3000);
})();
