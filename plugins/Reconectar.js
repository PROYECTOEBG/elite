// Añadir importación del módulo path al inicio del archivo
import path from 'path'
import chalk from 'chalk' // Asegurar que chalk está instalado e importado

async function restartAndReconnectSubBots() {
    const subBotDir = path.resolve("./GataJadiBot");
    if (!fs.existsSync(subBotDir)) return;

    const subBotFolders = fs.readdirSync(subBotDir).filter(folder => 
        fs.statSync(path.join(subBotDir, folder)).isDirectory()
    );

    for (const folder of subBotFolders) {
        const pathGataJadiBot = path.join(subBotDir, folder);
        const credsPath = path.join(pathGataJadiBot, "creds.json");
        
        // Corregir referencia a path.basename
        const folderName = path.basename(pathGataJadiBot); 
        
        const subBot = global.conns.find(conn => 
            conn.user?.jid?.includes(folderName) || folderName === folder);

        if (!fs.existsSync(credsPath)) {
            console.log(chalk.bold.yellowBright(`\n╭┄┄┄┄┄┄┄┄┄┄┄┄┄┄ • • • ┄┄┄┄┄┄┄┄┄┄┄┄┄┄⟡\n┆ Sub-bot (+${folderName}) sin creds.json\n╰┄┄┄┄┄┄┄┄┄┄┄┄┄┄ • • • ┄┄┄┄┄┄┄┄┄┄┄┄┄┄⟡`));
            continue;
        }

        try {
            if (subBot?.ws && !subBot.ws.closed) {
                await subBot.ws.close();
                console.log(chalk.bold.yellow(`♻️ Reiniciando: +${folderName}`));
                
                // Añadir delay antes de reconexión
                await new Promise(resolve => setTimeout(resolve, 5000));
                
                await gataJadiBot({
                    pathGataJadiBot,
                    m: null,
                    conn: global.conn,
                    args: [],
                    usedPrefix: '#',
                    command: 'jadibot',
                    fromCommand: false
                });
            } else {
                console.log(chalk.bold.cyan(`🔌 Conectando: +${folderName}`));
                await gataJadiBot({ 
                    pathGataJadiBot,
                    m: null,
                    conn: global.conn,
                    args: [],
                    usedPrefix: '#',
                    command: 'jadibot',
                    fromCommand: false
                });
            }
        } catch (e) {
            console.error(chalk.red(`❌ Error en +${folderName}:`), e);
            // Registrar error en archivo
            fs.appendFileSync('./subbot_errors.log', `[${new Date().toISOString()}] ${folderName}: ${e.stack}\n\n`);
        }
    }
}

// Intervalo más seguro (5 minutos)
setInterval(restartAndReconnectSubBots, 60000); 
