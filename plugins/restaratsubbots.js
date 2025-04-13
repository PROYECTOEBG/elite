import fs from 'fs'
import path from 'path'
import chalk from 'chalk'

const restartSubBots = async (conn, notifyChat = null) => {
    const subBotDir = path.resolve("./GataJadiBot")
    if (!fs.existsSync(subBotDir)) {
        if (notifyChat) conn.sendMessage(notifyChat, { text: '❌ No se encontró la carpeta de sub-bots (GataJadiBot)' })
        return
    }

    const subBotFolders = fs.readdirSync(subBotDir).filter(folder =>
        fs.statSync(path.join(subBotDir, folder)).isDirectory()
    )

    if (subBotFolders.length === 0) {
        if (notifyChat) conn.sendMessage(notifyChat, { text: 'ℹ️ No hay sub-bots activos para reiniciar' })
        return
    }

    let key
    if (notifyChat) {
        const res = await conn.sendMessage(notifyChat, {
            text: `🔄 Preparando reinicio de ${subBotFolders.length} sub-bots...`
        })
        key = res.key
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

            if (notifyChat && key) {
                await conn.sendMessage(notifyChat, {
                    text: `🔄 Reiniciando sub-bots...\n✅ ${successCount} | ❌ ${failCount}`,
                    edit: key
                })
            }

        } catch (error) {
            console.error(chalk.red(`[!] Error al reiniciar sub-bot (+${folder}):`), error)
            failCount++
        }
    }

    if (notifyChat && key) {
        await conn.sendMessage(notifyChat, {
            text: `♻️ Reinicio de sub-bots completado:\n\n✅ Éxitos: ${successCount}\n❌ Fallidos: ${failCount}`,
            edit: key
        })
    }
}

// Comando manual
const handler = async (m, { conn, isROwner }) => {
    if (!isROwner) return m.reply('⚠️ Este comando solo puede ser usado por el owner del bot')
    await restartSubBots(conn, m.chat)
}

handler.help = ['restartsubbots']
handler.tags = ['owner']
handler.command = ['restartsubbots', 'reiniciarsubbots']
handler.owner = true

export default handler

// Ejecución automática cada minuto
setInterval(() => {
    // Asegúrate de que `global.conn` esté definido correctamente
    if (global.conn) {
        restartSubBots(global.conn)
    }
}, 60 * 1000)
