import path from 'path';
import fs from 'fs';
import chalk from 'chalk';

// Configuración
const SUBBOTS_DIR = './GataJadiBot';
const LOG_FILE = './subbots_restart.log';
const INTERVAL_MS = 60000; // 1 minuto

// Función principal mejorada
async function restartSubBots() {
    console.log(chalk.yellow('\n🔃 Iniciando reinicio automático de sub-bots...'));

    try {
        if (!fs.existsSync(SUBBOTS_DIR)) {
            logError('⚠️ Directorio de sub-bots no encontrado');
            return;
        }

        const subBotFolders = fs.readdirSync(SUBBOTS_DIR)
            .filter(folder => fs.statSync(path.join(SUBBOTS_DIR, folder)).isDirectory());

        if (subBotFolders.length === 0) {
            console.log(chalk.blue('ℹ️ No hay sub-bots para reiniciar'));
            return;
        }

        for (const folder of subBotFolders) {
            await handleSubBotRestart(folder);
        }

        console.log(chalk.green('✅ Reinicio completado'));
        logActivity(`Reinicio exitoso a las ${new Date().toLocaleString()}`);

    } catch (error) {
        console.error(chalk.red('🔥 Error crítico:'), error);
        logError(`CRASH: ${error.stack}`);
    }
}

// Manejo individual de cada sub-bot
async function handleSubBotRestart(folderName) {
    const botPath = path.join(SUBBOTS_DIR, folderName);
    const credsPath = path.join(botPath, 'creds.json');

    try {
        if (!fs.existsSync(credsPath)) {
            console.log(chalk.yellow(`⚠️ ${folderName}: Credenciales no encontradas`));
            return;
        }

        const activeBot = global.conns.find(conn => 
            conn.user?.jid?.includes(folderName));

        // Paso 1: Desconectar si está activo
        if (activeBot?.ws) {
            console.log(chalk.blue(`♻️ Desconectando: ${folderName}`));
            await activeBot.ws.close();
            await delay(3000); // Espera de 3 segundos
        }

        // Paso 2: Reconexión
        console.log(chalk.green(`🔄 Reconectando: ${folderName}`));
        await gataJadiBot({
            pathGataJadiBot: botPath,
            m: null,
            conn: global.conn,
            args: [],
            usedPrefix: '#',
            command: 'jadibot',
            fromCommand: false
        });

        logActivity(`Sub-bot ${folderName} reiniciado correctamente`);

    } catch (error) {
        console.error(chalk.red(`❌ Error en ${folderName}:`), error);
        logError(`${folderName}: ${error.message}`);
    }
}

// Utilidades
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function logActivity(message) {
    fs.appendFileSync(LOG_FILE, `[ACTIVITY] ${new Date().toISOString()} - ${message}\n`);
}

function logError(message) {
    fs.appendFileSync(LOG_FILE, `[ERROR] ${new Date().toISOString()} - ${message}\n`);
}

// Sistema de intervalo seguro
let restartInterval;

function startRestartService() {
    // Detener servicio existente
    if (restartInterval) clearInterval(restartInterval);
    
    // Ejecución inmediata al iniciar
    restartSubBots();
    
    // Configurar intervalo de 1 minuto
    restartInterval = setInterval(restartSubBots, INTERVAL_MS);
    
    console.log(chalk.green(`\n🔄 Servicio de reinicio activado (cada ${INTERVAL_MS/1000} segundos)`));
}

// Iniciar servicio
startRestartService();

// Manejo de cierre limpio
process.on('SIGINT', () => {
    clearInterval(restartInterval);
    console.log(chalk.yellow('\n🛑 Servicio de reinicio detenido'));
    process.exit(0);
});
