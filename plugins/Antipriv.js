const { Client } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

// ID del bot principal
const mainBotNumber = '593986304370'; // Reemplaza con el número de teléfono de tu bot principal (en formato internacional sin +)

const client = new Client();

client.on('qr', (qr) => {
    // Genera el código QR para la autenticación en consola
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('Bot principal listo!');
});

client.on('message', (message) => {
    // Si el mensaje es privado (no proviene de un grupo)
    if (message.isGroupMsg === false) {
        // Verifica si el mensaje es del bot principal
        if (message.from === mainBotNumber + '@c.us') {
            // Si es del bot principal, bloqueamos su mensaje y respondemos con el mensaje
            message.delete().then(() => {
                message.reply('Mi creador no permite mensajes a mi privado, tendré que bloquearte.');
            });
        } else {
            // Si es un mensaje de un usuario, bloqueamos a esa persona
            message.reply('Mi creador no permite mensajes a mi privado, tendré que bloquearte.')
                .then(() => {
                    client.getContactById(message.from).then(contact => {
                        contact.block();  // Bloquea al usuario que escribió
                    });
                });
        }
    }
});

// Inicia el cliente
client.initialize();
