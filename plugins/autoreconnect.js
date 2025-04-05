const { delay } = require('@whiskeysockets/baileys');
const fs = require('fs');

module.exports = {
    name: 'autoreconnect',
    description: 'Reinicia sub-bots al detectar desconexión',
    isAdmin: true,
    async handle({ bot, socket, store }) {
        // 1. Capturar logs de la consola
        const originalConsoleLog = console.log;
        console.log = (...args) => {
            const message = args.join(' ');
            
            // 2. Detectar mensaje de desconexión
            if (message.includes('Conexión perdida en la sesión') && message.includes('Borrando datos')) {
                const sessionId = message.match(/\+(\d+)/)[0]; // Extrae el número
                autoreconnectBot(sessionId);
            }
            originalConsoleLog(...args); // Mantener log original
        };

        // 3. Función de reconexión
        async function autoreconnectBot(sessionId) {
            console.log(`🔄 Intentando reconectar sub-bot ${sessionId}...`);
            
            try {
                // Detener el sub-bot actual
                const subBot = store.subBots[sessionId];
                if (subBot) await subBot.socket.end();
                
                // Esperar 5 segundos
                await delay(5000);
                
                // Reiniciar (aquí usa tu lógica de creación de sub-bots)
                const newBot = await bot.startSubBot(sessionId);
                store.subBots[sessionId] = newBot;
                
                console.log(`✅ Sub-bot ${sessionId} reconectado!`);
            } catch (error) {
                console.error(`❌ Error al reconectar ${sessionId}:`, error.message);
            }
        }
    }
};
