// limpiezaConsole.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Configuración DEBUG (activar para ver detalles)
const DEBUG = true; // Cambiar a `false` en producción

// Obtener __dirname en ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 1. Función mejorada para extraer el número (con validación estricta)
function extractPhoneNumber(message) {
    try {
        const regex = /\(\+(\d{5,15})\)/; // Solo números telefónicos válidos
        const match = message.match(regex);
        if (DEBUG) console.log('🔍 Regex match:', match);
        return match ? match[1] : null;
    } catch (error) {
        console.error('❌ Error en extractPhoneNumber:', error);
        return null;
    }
}

// 2. Función SUPER reforzada para eliminar la carpeta
async function deleteSessionFolder(phoneNumber) {
    if (!phoneNumber) {
        console.log('❌ Número de teléfono inválido');
        return false;
    }

    const folderPath = path.join(__dirname, `GataJadibot_${phoneNumber}`);
    if (DEBUG) console.log('📁 Ruta a eliminar:', folderPath);

    try {
        if (fs.existsSync(folderPath)) {
            await fs.promises.rm(folderPath, { recursive: true, force: true });
            console.log(`✅ Carpeta eliminada: ${folderPath}`);
            return true;
        } else {
            console.log('⚠️ La carpeta NO existe en:', folderPath);
            return false;
        }
    } catch (error) {
        console.error('❌ Error crítico al borrar:', error);
        return false;
    }
}

// 3. Interceptar TODAS las salidas de consola
function setupConsoleInterceptor() {
    const consoleMethods = ['log', 'warn', 'error'];
    
    consoleMethods.forEach(method => {
        const original = console[method];
        console[method] = (...args) => {
            original.apply(console, args);
            checkForErrors(args.join(' '));
        };
    });

    if (DEBUG) console.log('🛡️ Interceptando console.log/warn/error');
}

// 4. Detector de errores de conexión
async function checkForErrors(message) {
    if (DEBUG) console.log('📨 Mensaje recibido:', message);

    if (message.includes('Intentando reconectar') && 
        /\(Intento\s+\d+\/10\)/.test(message)) {
        
        const attempt = message.match(/Intento\s+(\d+)\/10/)[1];
        if (DEBUG) console.log('🔄 Intentos de reconexión:', attempt);

        if (parseInt(attempt) >= 10) {
            const phoneNumber = extractPhoneNumber(message);
            if (phoneNumber) {
                console.log(`🚨 Máximo de intentos alcanzado para: +${phoneNumber}`);
                await deleteSessionFolder(phoneNumber);
            }
        }
    }
}

// 5. Prueba automática (descomentar para simular)
// setTimeout(() => {
//     console.warn("Intentando reconectar (+593968467001) en 5 segundos... (Intento 10/10)");
// }, 2000);

// Iniciar
setupConsoleInterceptor();
console.log('🔌 Plugin de limpieza cargado correctamente');
