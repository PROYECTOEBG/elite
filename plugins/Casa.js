const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

// Crea una instancia del cliente de WhatsApp
const client = new Client({
    authStrategy: new LocalAuth()
});

// Array de frases para enviar
const frases = [
    '¡Hola! ¿Cómo estás?',
    'Recuerda tomar un descanso.',
    '¿Sabías que la programación es divertida?',
    '¡Sigue aprendiendo algo nuevo hoy!',
    'La perseverancia es clave para el éxito.'
];

let index = 0;

// Generar QR para la autenticación
client.on('qr', (qr) => {
    // Genera y muestra el código QR en la terminal
    qrcode.generate(qr, { small: true });
});

// Cuando el cliente está listo
client.on('ready', () => {
    console.log('¡Cliente listo!');

    // Enviar mensajes cada minuto
    setInterval(() => {
        const message = frases[index];
        const numeroDestino = 'número_de_destino@c.us'; // Reemplaza con el número real
        client.sendMessage(numeroDestino, message)
            .then(response => {
                console.log(`Mensaje enviado: ${message}`);
            })
            .catch(err => {
                console.error('Error al enviar el mensaje:', err);
            });
        index = (index + 1) % frases.length; // Cicla a través de las frases
    }, 60000); // 60000 ms = 1 minuto
});

// Inicializar el cliente
client.initialize();
