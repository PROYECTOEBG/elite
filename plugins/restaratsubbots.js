import fs from 'fs'
import path from 'path'
import chalk from 'chalk'
import { makeWASocket } from '../lib/simple.js'
import { useMultiFileAuthState, fetchLatestBaileysVersion, makeCacheableSignalKeyStore } from (await import(global.baileys))

// Configuración
const SUBBOTS_DIR = "./GataJadiBot"
const CHECK_INTERVAL = 60000 // 1 minuto
let checkInterval = null

// Función mejorada para reiniciar sub-bots
async function restartAllSubBots() {
    if (!fs.existsSync(SUBBOTS_DIR)) {
        console.log(chalk.yellow('[!] No se encontró la carpeta de sub-bots (GataJadiBot)'))
        return
    }

    const subBotFolders = fs.readdirSync(SUBBOTS_DIR).filter(folder => 
        fs.statSync(path.join(SUBBOTS_DIR, folder)).isDirectory()
    )

    if (subBotFolders.length === 0) {
        console.log(chalk.yellow('[ℹ] No hay sub-bots activos para reiniciar'))
        return
    }

    console.log(chalk.blue(`\n[⚡] Iniciando reinicio automático de ${subBotFolders.length} sub-bots...`))

    for (const folder of subBotFolders) {
        const pathGataJadiBot = path.join(SUBBOTS_DIR, folder)
        const credsPath = path.join(pathGataJadiBot, "creds.json")

        if (!fs.existsSync(credsPath)) {
            console.log(chalk.yellow(`[!] Sub-bot (+${folder}) sin credenciales. Omitiendo...`))
            continue
        }

        try {
            // 1. Cerrar conexión existente
            const existingIndex = global.conns.findIndex(conn => 
                conn.user?.jid?.includes(folder))
            
            if (existingIndex !== -1) {
                try {
                    global.conns[existingIndex].ws.close()
                } catch (e) {
                    console.error(chalk.red(`Error al cerrar conexión (+${folder}):`), e)
                }
                global.conns.splice(existingIndex, 1)
            }

            // 2. Mostrar en consola
            console.log(chalk.bold.cyan(`\n${chalk.green('$')} Bot: +${folder} ~${chalk.yellow('SUB BOT')} ${chalk.green('$')}[REINICIANDO]\n`))
            console.log(chalk.gray('- [-> SUB-BOT -] ---'))

            // 3. Crear nueva conexión (usando la misma lógica que tu comando original)
            const { version } = await fetchLatestBaileysVersion()
            const { state, saveCreds } = await useMultiFileAuthState(pathGataJadiBot)

            const sock = makeWASocket({
                logger: pino({ level: "silent" }),
                printQRInTerminal: false,
                auth: {
                    creds: state.creds,
                    keys: makeCacheableSignalKeyStore(state.keys, pino({ level: 'silent' }))
                },
                browser: ['GataBot-MD (Sub Bot)', 'Chrome', '2.0.0'],
                version: version,
                generateHighQualityLinkPreview: true
            })

            sock.ev.on('creds.update', saveCreds)
            global.conns.push(sock)

            console.log(chalk.bold.green(`\n${chalk.green('$')} Bot: +${folder} ~${chalk.yellow('SUB BOT')} ${chalk.green('$')}[CONECTADO]\n`))
            console.log(chalk.gray('- [-> SUB-BOT -] ---'))

        } catch (error) {
            console.error(chalk.red(`[!] Error al reiniciar sub-bot (+${folder}):`), error)
        }
    }
}

// Iniciar el reinicio automático
function startAutoRestart() {
    // Detener intervalo existente si hay
    if (checkInterval) {
        clearInterval(checkInterval)
    }
    
    // Ejecutar inmediatamente el primer reinicio
    restartAllSubBots().catch(console.error)
    
    // Configurar intervalo periódico
    checkInterval = setInterval(() => {
        console.log(chalk.magenta('\n[⏰] Ejecutando reinicio automático de sub-bots...'))
        restartAllSubBots().catch(console.error)
    }, CHECK_INTERVAL)
    
    console.log(chalk.green(`\n[✅] Sistema de reinicio automático activado (cada ${CHECK_INTERVAL/1000} segundos)`))
}

// Detener el reinicio automático (opcional)
function stopAutoRestart() {
    if (checkInterval) {
        clearInterval(checkInterval)
        checkInterval = null
        console.log(chalk.yellow('\n[⚠] Sistema de reinicio automático detenido'))
    }
}

// Iniciar automáticamente al cargar el archivo
startAutoRestart()

// Manejar cierre del proceso
process.on('SIGINT', () => {
    stopAutoRestart()
    process.exit(0)
})

// Exportar funciones para control manual si es necesario
export default {
    startAutoRestart,
    stopAutoRestart,
    restartAllSubBots
}
