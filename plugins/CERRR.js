import { watchFile, unwatchFile } from 'fs'
import chalk from 'chalk'

let handler = async (m, { conn, args, usedPrefix, command }) => {
    conn.sesionCerrada = async (jid) => {
        try {
            await conn.sendMessage(m.chat, { 
                text: `*⚠️ SESIÓN CERRADA*\n\n*_🗑️ Borrando datos, espera 30 segundos e intenta de nuevo con:_*\n\n*/jadibot*\n*/serbot*\n*/rentbot*`
            });
        } catch (error) {
            console.log('Error al enviar mensaje de sesión cerrada:', error);
        }
    }
}

handler.help = ['jadibot-close']
handler.tags = ['jadibot']
handler.command = /^(jadibot-close)$/i

export default handler

// Observar cambios en el archivo
watchFile(import.meta.url, () => {
    unwatchFile(import.meta.url)
    console.log(chalk.bold.greenBright('Se ha actualizado jadibot-close.js'))
    import(`${import.meta.url}?update=${Date.now()}`)
}) 
