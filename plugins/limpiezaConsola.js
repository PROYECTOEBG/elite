const fs = require('fs');
const path = require('path');

// Configuración
const SESSION_PREFIX = 'GataJadibot_';
const MAX_RETRIES = 10;

// Función mejorada para extraer el número
function extractPhoneNumber(message) {
    const regex = /\(\+(\d+)\)/g;
    const matches = [...message.matchAll(regex)];
    return matches.length ? matches[0][1] : null;
}

// Función reforzada para eliminar la carpeta
function deleteSessionFolder(phoneNumber) {
    if (!phoneNumber) {
        console.log('❌ No se pudo extraer el número del mensaje');
        return;
    }

    const folderPath = path.join(__dirname, `${SESSION_PREFIX}${phoneNumber}`);
    
    console.log(`🔍 Buscando carpeta en: ${folderPath}`); // Debug
    
    if (fs.existsSync(folderPath)) {
        try {
            fs.rmSync(folderPath, { recursive: true, force: true });
            console.log(`✅ Sesión eliminada: ${folderPath}`);
            return true;
        } catch (error) {
            console.error(`❌ Error crítico al borrar: ${error}`);
            return false;
        }
    } else {
        console.log(`⚠️ La carpeta no existe: ${folderPath}`);
        return false;
    }
}

// Interceptar TODOS los logs (solución más robusta)
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
        if (phoneNumber) {
            console.log(`🛑 Detectado fallo crítico en: +${phoneNumber}`);
            deleteSessionFolder(phoneNumber);
        }
    }
}

// Activar interceptación
interceptConsole();

// Simulación de mensaje de error (para pruebas)
// setTimeout(() => {
//     console.warn("Intentando reconectar (+593968467001) en 5 segundos... (Intento 10/10)");
// }, 3000);
