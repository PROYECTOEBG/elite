// ... existing code ...
async function joinChannels(conn) {
    if (!global.ch || Object.keys(global.ch).length === 0) return;
    
    console.log(chalk.bold.cyanBright('\n╭┄┄┄┄┄┄┄┄┄┄┄┄┄┄ • • • ┄┄┄┄┄┄┄┄┄┄┄┄┄┄⟡'));
    console.log(chalk.bold.cyanBright('┆ 📢 Intentando unirse a los canales...'));
    console.log(chalk.bold.cyanBright('╰┄┄┄┄┄┄┄┄┄┄┄┄┄┄ • • • ┄┄┄┄┄┄┄┄┄┄┄┄┄┄⟡'));

    for (const channelId of Object.values(global.ch)) {
        try {
            await Promise.race([
                conn.newsletterFollow(channelId),
                new Promise((_, reject) => 
                    setTimeout(() => reject(new Error('Timeout')), 10000)
                )
            ]).catch(error => {
                if (error.message === 'Timeout') {
                    console.log(chalk.yellow(`└─ Timeout al unirse al canal ${channelId}`));
                } else {
                    console.error(chalk.red(`└─ Error al unirse al canal ${channelId}:`), error);
                }
            });
            await sleep(2000); // Esperar 2 segundos entre cada intento
        } catch (e) {
            console.error(chalk.red(`└─ Error en joinChannels:`), e);
        }
    }
}
// ... existing code ...
