const { Client } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

// Número del bot principal
const mainBotNumber = '593986304370'; // Número de tu bot principal (en formato internacional, sin '+')

// Crear cliente de WhatsApp
const client = new Client();

// Generar el código QR para la autenticación en consola
client.on('qr', (qr) => {
    qrcode.generate(qr, { small: true });
});

// Al estar listo
client.on('ready', () => {
    console.log('Bot principal listo!');
});

// Escuchar mensajes
client.on('message', (message) => {
    // Verificar si el mensaje no proviene de un grupo (es privado)
    if (!message.isGroupMsg) {
        // Verificar si el mensaje proviene de un usuario (y no del bot)
        if (message.from !== mainBotNumber + '@c.us') {
            // Enviar mensaje de advertencia
            message.reply('Mi creador no permite mensajes a mi privado, tendré que bloquearte.');

            // Bloquear al usuario
            client.getContactById(message.from).then(contact => {
                contact.block()  // Bloquea al usuario
                    .then(() => {
                        console.log(`Usuario bloqueado: ${message.from}`);
                    })
                    .catch((err) => {
                        console.log('Error al bloquear al usuario:', err);
                    });
            }).catch(err => {
                console.log('Error al obtener el contacto:', err);
            });
        }
    }
});

// Iniciar cliente
client.initialize();
