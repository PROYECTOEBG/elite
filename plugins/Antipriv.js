const { Client } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

// Número de teléfono del bot principal
const mainBotNumber = '593986304370'; // Número de tu bot principal (en formato internacional, sin '+')

// Crear cliente de WhatsApp
const client = new Client();

// Generar el código QR para la autenticación en consola
client.on('qr', (qr) => {
    qrcode.generate(qr, { small: true });
});

// Cuando esté listo
client.on('ready', () => {
    console.log('Bot principal listo!');
});

// Escuchar mensajes
client.on('message', (message) => {
    // Si el mensaje es privado (no de un grupo)
    if (!message.isGroupMsg) {
        // Ignorar el mensaje completamente sin responder
        console.log(`Mensaje de ${message.from} ignorado: ${message.body}`);
        return;  // No hace nada, ignora cualquier mensaje privado
    }
});

// Iniciar cliente
client.initialize();
