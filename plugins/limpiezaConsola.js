const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuración
const SESSION_PREFIX = 'GataJadibot_'; // Prefijo de la carpeta de sesión
const MAX_RETRIES = 10; // Máximo de intentos antes de borrar

// Función para extraer el número del mensaje de error
function extractPhoneNumber(errorMessage) {
    const regex = /\(\+(\d+)\)/;
    const match = errorMessage.match(regex);
    return match ? match[1] : null;
}

// Función para eliminar la carpeta de sesión
function deleteSessionFolder(phoneNumber) {
    const folderPath = path.join(__dirname, `${SESSION_PREFIX}${phoneNumber}`);
    
    if (fs.existsSync(folderPath)) {
        try {
            fs.rmSync(folderPath, { recursive: true, force: true });
            console.log(`✅ Sesión eliminada: ${folderPath}`);
        } catch (error) {
            console.error(`❌ Error al borrar: ${error}`);
        }
    } else {
        console.log(`⚠️ No se encontró la carpeta: ${folderPath}`);
    }
}

// ----- Integración con Baileys (Ejemplo) -----
const makeWASocket = require('@whiskeysockets/baileys').default;

async function startBot() {
    const socket = makeWASocket({
        printQRInTerminal: true,
        logger: {
            // Interceptamos los logs de reconexión
            warn: (message) => {
                if (message.includes('Intentando reconectar') && message.includes(`(Intento ${MAX_RETRIES}/10)`)) {
                    const phoneNumber = extractPhoneNumber(message);
                    if (phoneNumber) deleteSessionFolder(phoneNumber);
                }
                console.warn(message); // Log original
            }
        }
    });

    // Resto de la lógica del bot...
}

startBot().catch(console.error);
