const makeWASocket = require('@whiskeysockets/baileys').default;
const { useSingleFileAuthState } = require('@whiskeysockets/baileys');
const { Boom } = require('@hapi/boom');
const fs = require('fs');

// Ruta del archivo de sesión (puedes cambiar esto)
const { state, saveState } = useSingleFileAuthState('./auth_info.json');

async function startBot() {
    const sock = makeWASocket({
        auth: state,
        printQRInTerminal: true,
    });

    // Guardar cambios en el estado
    sock.ev.on('creds.update', saveState);

    // Detectar errores y reconexiones
    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect } = update;

        if (connection === 'close') {
            const statusCode = lastDisconnect?.error?.output?.statusCode;
            const errorMsg = lastDisconnect?.error?.message || '';

            console.log(`Conexión cerrada. Código: ${statusCode}, Mensaje: ${errorMsg}`);

            // Detectar si fue una desconexión crítica
            if (
                errorMsg.includes('Conexión perdida') ||
                errorMsg.includes('Conexión cerrada') ||
                statusCode === 428
            ) {
                console.log('Se detectó una desconexión crítica. Reiniciando subbot...');
                process.exit(); // Esto hará que Pterodactyl reinicie automáticamente
            } else {
                console.log('Reconectando...');
                startBot(); // reconecta automáticamente si no fue un cierre crítico
            }
        } else if (connection === 'open') {
            console.log('Conectado correctamente!');
        }
    });
}

startBot();
