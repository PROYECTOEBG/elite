const fs = require('fs').promises;
const path = require('path');
const { exec } = require('child_process');

// Configuración
const BOTS_DIR = '/home/container/Gata.JadIBot'; // Ruta de tus bots (como en tu imagen)
const CHECK_INTERVAL = 60000; // 60,000 ms = 1 minuto
const LOG_FILE = 'subbot_monitor.log'; // Opcional: guardar logs en un archivo

// Función para escribir logs en consola y archivo (opcional)
async function logMessage(message) {
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] ${message}\n`;
    
    console.log(logEntry.trim()); // Mostrar en consola
    
    try {
        await fs.appendFile(LOG_FILE, logEntry); // Guardar en archivo (opcional)
    } catch (err) {
        console.error('Error al escribir en el log:', err.message);
    }
}

// Verifica si un bot está activo
async function isBotActive(botDir) {
    try {
        // Método 1: Verificar si existe un archivo de estado (ej. "bot.lock")
        const lockFile = path.join(botDir, 'bot.lock');
        await fs.access(lockFile);
        return true; // Si existe, el bot está activo
    } catch (err) {
        // Método 2: Verificar procesos en ejecución (requiere más configuración)
        // Si no hay archivo de estado, asumimos que está inactivo
        return false;
    }
}

// Reinicia un bot inactivo
async function restartBot(botDir) {
    const botName = path.basename(botDir);
    
    try {
        // Comando para iniciar el bot (¡AJUSTA ESTO SEGÚN TU BOT!)
        let startCommand;
        
        if (fs.existsSync(path.join(botDir, 'package.json'))) {
            startCommand = 'npm start'; // Si es un bot Node.js
        } else if (fs.existsSync(path.join(botDir, 'index.js'))) {
            startCommand = 'node index.js'; // Si usa index.js
        } else {
            startCommand = `node ${path.join(botDir, 'main.js')}`; // Ejemplo genérico
        }

        logMessage(`⚡ Reiniciando ${botName}... (Comando: ${startCommand})`);

        // Ejecutar el comando en el directorio del bot
        exec(startCommand, { cwd: botDir }, (error, stdout, stderr) => {
            if (error) {
                logMessage(`❌ Error al reiniciar ${botName}: ${error.message}`);
                return;
            }
            logMessage(`✅ ${botName} reiniciado correctamente`);
        });
    } catch (err) {
        logMessage(`❌ Error crítico en ${botName}: ${err.message}`);
    }
}

// Escanea todos los bots y reactiva los inactivos
async function checkAllBots() {
    try {
        logMessage('\n=== Escaneando SubBots ===');
        
        const botEntries = await fs.readdir(BOTS_DIR, { withFileTypes: true });
        const subBots = botEntries.filter(entry => entry.isDirectory());
        
        if (subBots.length === 0) {
            logMessage('No se encontraron SubBots en el directorio.');
            return;
        }

        logMessage(`SubBots encontrados: ${subBots.length}`);
        
        for (const botDir of subBots) {
            const botPath = path.join(BOTS_DIR, botDir.name);
            const isActive = await isBotActive(botPath);
            
            if (!isActive) {
                logMessage(`🔴 ${botDir.name} está INACTIVO`);
                await restartBot(botPath);
            } else {
                logMessage(`🟢 ${botDir.name} está ACTIVO`);
            }
        }
    } catch (err) {
        logMessage(`❌ Error al escanear bots: ${err.message}`);
    }
}

// --- INICIO DEL MONITOR ---
(async () => {
    logMessage('🚀 Iniciando Monitor de SubBots...');
    logMessage(`📂 Ruta de bots: ${BOTS_DIR}`);
    logMessage(`⏱ Intervalo de verificación: ${CHECK_INTERVAL / 1000} segundos`);

    // Ejecutar la primera verificación inmediatamente
    await checkAllBots();

    // Programar verificaciones periódicas
    setInterval(checkAllBots, CHECK_INTERVAL);
})();
