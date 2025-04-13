import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import chalk from 'chalk'
import { exec } from 'child_process'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

async function reiniciarSubBots(m = null, responder = null) {
  let carpetas = fs.readdirSync('./GataJadiBot')
  if (!carpetas.length) {
    if (responder) responder('*[❗] No hay sub-bots activos para reiniciar.*')
    return
  }

  for (let carpeta of carpetas) {
    try {
      let rutaCreds = `./GataJadiBot/${carpeta}/creds.json`
      if (!fs.existsSync(rutaCreds)) {
        console.log(chalk.yellowBright(`Sub-bot (+${carpeta}) no tiene creds.json. Omitiendo...`))
        continue
      }

      let ruta = path.resolve(`./GataJadiBot/${carpeta}`)
      let comando = `node . --jadibot ${ruta}`
      let proceso = exec(comando)

      proceso.stdout.on('data', (data) => console.log(`[+] ${data}`))
      proceso.stderr.on('data', (data) => console.error(`[-] ${data}`))

      console.log(chalk.green(`$ Bot: +${carpeta} ~SUB BOT ${chalk.blueBright('[REINICIANDO]')}`))
    } catch (e) {
      console.log(`\n[!] Error al reiniciar sub-bot (+${carpeta}):`, e)
    }
  }

  if (responder) responder('*✅ Todos los sub-bots activos han sido reiniciados.*')
}

// Repetir cada 1 minuto (60000 ms)
setInterval(() => {
  console.log(chalk.cyan('[AUTO] Reiniciando sub-bots cada 1 minuto...'))
  reiniciarSubBots()
}, 60 * 1000)

export default reiniciarSubBots
