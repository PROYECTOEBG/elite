import fs from 'fs'
import path from 'path'
import chalk from 'chalk'

const handler = async (m, { conn, isROwner }) => {
    if (!isROwner) return m.reply('⚠️ Este comando solo puede ser usado por el owner del bot')
    
    const subBotDir = path.resolve("./GataJadiBot")
    if (!fs.existsSync(subBotDir)) {
        return m.reply('❌ No se encontró la carpeta de sub-bots (GataJadiBot)')
    }

    const subBotFolders = fs.readdirSync(subBotDir).filter(folder => 
        fs.statSync(path.join(subBotDir, folder)).isDirectory()
    )

    if (subBotFolders.length === 0) {
        return m.reply('ℹ️ No hay sub-bots activos para reiniciar')
    }

    // Notificación de inicio
    const { key } = await conn.sendMessage(m.chat, { 
        text: `🔄 Preparando reinicio de ${subBotFolders.length} sub-bots...` 
    }, { quoted: m })

    // Contador de sub-bots reiniciados
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
            // 1. Buscar y cerrar conexión existente
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

            // 3. Crear nueva conexión
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
            
            // Actualizar mensaje de progreso
            await conn.sendMessage(m.chat, { 
                text: `🔄 Reiniciando sub-bots...\n✅ ${successCount} | ❌ ${failCount}`, 
                edit: key 
            })

        } catch (error) {
            console.error(chalk.red(`[!] Error al reiniciar sub-bot (+${folder}):`), error)
            failCount++
        }
    }

    // Resultado final
    await conn.sendMessage(m.chat, { 
        text: `♻️ Reinicio de sub-bots completado:\n\n✅ Éxitos: ${successCount}\n❌ Fallidos: ${failCount}`,
        edit: key 
    })
}

handler.help = ['restartsubbots']
handler.tags = ['owner']
handler.command = ['restartsubbots', 'reiniciarsubbots'] 
handler.owner = true

export default handler

// Función de delay para las animaciones
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
