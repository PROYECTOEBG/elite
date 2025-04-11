// limpiezaConsole.js (ES Module)
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Configuración
const SESSION_PREFIX = 'GataJadibot_';
const MAX_RETRIES = 10;

// Obtener __dirname en ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Función para extraer el número
function extractPhoneNumber(message) {
    const regex = /\(\+(\d+)\)/g;
    const matches = [...message.matchAll(regex)];
    return matches.length ? matches[0][1] : null;
}

// Función para eliminar la carpeta
function deleteSessionFolder(phoneNumber) {
    if (!phoneNumber) return;
    
    const folderPath = path.join(__dirname, `${SESSION_PREFIX}${phoneNumber}`);
    
    if (fs.existsSync(folderPath)) {
        try {
            fs.rmSync(folderPath, { recursive: true, force: true });
            console.log(`✅ Sesión eliminada: ${folderPath}`);
        } catch (error) {
            console.error(`❌ Error al borrar: ${error}`);
        }
    } else {
        console.log(`⚠️ Carpeta no encontrada: ${folderPath}`);
    }
}

// Interceptar console.log
const originalConsole = {
    log: console.log,
    warn: console.warn,
    error: console.error
};

function interceptConsole() {
    console.log = (...args) => {
        originalConsole.log(...args);
        checkLogs(args.join(' '));
    };
    
    console.warn = (...args) => {
        originalConsole.warn(...args);
        checkLogs(args.join(' '));
    };
    
    console.error = (...args) => {
        originalConsole.error(...args);
        checkLogs(args.join(' '));
    };
}

function checkLogs(message) {
    if (message.includes('Intentando reconectar') && 
        message.includes(`(Intento ${MAX_RETRIES}/10)`)) {
        const phoneNumber = extractPhoneNumber(message);
        deleteSessionFolder(phoneNumber);
    }
}

// Activar
interceptConsole();

// Opcional: Exportar funciones si necesitas usarlas en otros módulos
export { deleteSessionFolder, interceptConsole };
