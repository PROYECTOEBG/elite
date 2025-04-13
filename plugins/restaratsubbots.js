import fs from 'fs'
import path from 'path'
import chalk from 'chalk'
import GataJadiBot from './GataJadiBot' // Asegúrate de que esta ruta sea correcta

const reiniciarSubBots = async () => {
    const subBotDir = path.resolve("./GataJadiBot")
    if (!fs.existsSync(subBotDir)) {
        console.log('❌ No se encontró la carpeta de sub-bots (GataJadiBot)')
        return
    }

    const subBotFolders = fs.readdirSync(subBotDir).filter(folder =>
        fs.statSync(path.join(subBotDir, folder)).isDirectory()
    )

    if (subBotFolders.length === 0) {
        console.log('ℹ️ No hay sub-bots activos para reiniciar')
        return
    }

    let successCount = 0
    let failCount = 0

    for (const folder of subBotFolders) {
        const pathGataJadiBot = path.join(subBotDir, folder)
        const credsPath = path.join(pathGataJadiBot, "creds.json")

        if (!fs.existsSync(credsPath)) {
            console.log(chalk.yellow(`[!] Sub-bot (+${folder}) sin credenciales. Omitiendo...`))
            failCount++
            continue
        }

        try {
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

            console.log(chalk.bold.cyan(`\n${chalk.green('$')} Bot: +${folder} ~${chalk.yellow('SUB BOT')} ${chalk.green('$')}[REINICIANDO]\n`))
            console.log(chalk.gray('- [-> SUB-BOT -] ---'))

            await gataJadiBot({
                pathGataJadiBot,
                m: null,
                conn: global.conn,
                args: [],
                usedPrefix: '#',
                command: 'jadibot',
                fromCommand: false
            })

            console.log(chalk.bold.green(`\n${chalk.green('$')} Bot: +${folder} ~${chalk.yellow('SUB BOT')} ${chalk.green('$')}[CONECTADO]\n`))
            console.log(chalk.gray('- [-> SUB-BOT -] ---'))

            successCount++

        } catch (error) {
            console.error(chalk.red(`[!] Error al reiniciar sub-bot (+${folder}):`), error)
            failCount++
        }
    }

    console.log(`♻️ Reinicio de sub-bots completado:\n✅ Éxitos: ${successCount}\n❌ Fallidos: ${failCount}`)
}

// Ejecutar cada 1 minuto
setInterval(reiniciarSubBots, 60 * 1000)
