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
        // Si el mensaje es privado (de un usuario), no respondemos a nada
        console.log(`Mensaje ignorado de ${message.from}: ${message.body}`);
        return;  // No hacer nada, ignorar el mensaje
    }
});

// Iniciar cliente
client.initialize();
