const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

// Lista de mensajes de recordatorio (puedes agregar o modificar)
const mensajes = [
    "Toma agua, es saludable!",
    "Estira tu cuerpo un poco!",
    "Relaja tus ojos, mira algo lejano!",
    "Respira profundo, calma tu mente!",
    "Párate y camina un momento si puedes!"
];

// Inicializa el cliente con autenticación local
const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: { headless: true }
});

// Genera el QR para el inicio de sesión
client.on('qr', (qr) => {
    qrcode.generate(qr, { small: true });
    console.log("Escanea el código QR para iniciar sesión.");
});

// Una vez listo, inicia el envío de recordatorios cada minuto
client.on('ready', async () => {
    console.log('Bot listo y conectado.');

    setInterval(async () => {
        try {
            // Obtiene todos los chats y filtra los grupos
            const chats = await client.getChats();
            const grupos = chats.filter(chat => chat.isGroup);

            // Envía un mensaje aleatorio a cada grupo
            for (const grupo of grupos) {
                const mensaje = mensajes[Math.floor(Math.random() * mensajes.length)];
                await client.sendMessage(grupo.id._serialized, mensaje);
            }

            console.log(`[recordatorio] Mensaje enviado a ${grupos.length} grupos.`);
        } catch (error) {
            console.error('[recordatorio] Error al enviar mensajes:', error);
        }
    }, 60 * 1000); // cada 60 segundos
});

// Inicializa el cliente
client.initialize();
