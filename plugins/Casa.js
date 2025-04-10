const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

const client = new Client({
    authStrategy: new LocalAuth()
});

const frases = [
    '¡Hola! ¿Cómo están todos?',
    'Recuerden tomar un descanso.',
    '¿Sabían que la programación es divertida?',
    '¡Sigan aprendiendo algo nuevo hoy!',
    'La perseverancia es clave para el éxito.'
];

let index = 0;

client.on('qr', (qr) => {
    qrcode.generate(qr, { small: true });
});

client.on('ready', async () => {
    console.log('¡Cliente listo!');

    setInterval(async () => {
        try {
            const message = frases[index];
            const chats = await client.getChats();
            const grupos = chats.filter(chat => chat.isGroup);

            for (const grupo of grupos) {
                await client.sendMessage(grupo.id._serialized, message);
                console.log(`Mensaje enviado al grupo: ${grupo.name}`);
            }

            index = (index + 1) % frases.length;
        } catch (err) {
            console.error('Error al enviar mensajes a grupos:', err);
        }
    }, 60000); // Cada 60 segundos
});

client.initialize();
