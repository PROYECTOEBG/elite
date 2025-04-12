async function restartAndReconnectSubBots() {
    const subBotDir = path.resolve("./GataJadiBot");
    if (!fs.existsSync(subBotDir)) return;
    const subBotFolders = fs.readdirSync(subBotDir).filter(folder => 
        fs.statSync(path.join(subBotDir, folder)).isDirectory()
    );

    for (const folder of subBotFolders) {
        const pathGataJadiBot = path.join(subBotDir, folder);
        const credsPath = path.join(pathGataJadiBot, "creds.json");
        const subBot = global.conns.find(conn => 
            conn.user?.jid?.includes(folder) || path.basename(pathGataJadiBot) === folder);

        if (!fs.existsSync(credsPath)) {
            console.log(chalk.bold.yellowBright(`\n╭┄┄┄┄┄┄┄┄┄┄┄┄┄┄ • • • ┄┄┄┄┄┄┄┄┄┄┄┄┄┄⟡\n┆ Sub-bot (+${folder}) no tiene creds.json. Omitiendo...\n╰┄┄┄┄┄┄┄┄┄┄┄┄┄┄ • • • ┄┄┄┄┄┄┄┄┄┄┄┄┄┄⟡`));
            continue;
        }

        // Si el sub-bot está conectado, lo desconectamos y luego lo reconectamos
        if (subBot && subBot.close) {
            try {
                await subBot.close();  // Cierra la conexión
                console.log(chalk.bold.yellowBright(`Reiniciando y reconectando el sub-bot (+${folder})...`));
                
                // Vuelve a conectar el sub-bot
                await gataJadiBot({
                    pathGataJadiBot,
                    m: null,
                    conn: global.conn,
                    args: [],
                    usedPrefix: '#',
                    command: 'jadibot',
                    fromCommand: false
                });
            } catch (e) {
                console.error(chalk.redBright(`Error al reiniciar y reconectar el sub-bot (+${folder}):`), e);
            }
        } else {
            console.log(chalk.bold.yellowBright(`Sub-bot (+${folder}) no está conectado, intentando conectar...`));
            try {
                // Si el sub-bot no está conectado, lo intentamos activar
                await gataJadiBot({
                    pathGataJadiBot,
                    m: null,
                    conn: global.conn,
                    args: [],
                    usedPrefix: '#',
                    command: 'jadibot',
                    fromCommand: false
                });
            } catch (e) {
                console.error(chalk.redBright(`Error al activar el sub-bot (+${folder}):`), e);
            }
        }
    }
}

// Establecer el intervalo para reiniciar y reconectar cada 1 minuto
setInterval(restartAndReconnectSubBots, 60000); // 1 minuto
