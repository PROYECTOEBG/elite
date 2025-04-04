const { Client, Buttons } = require('whatsapp-web.js');

const client = new Client();

client.on('group_join', async (notification) => {
    const chat = await notification.getChat();

    let mensaje = `✨ ¡Hola, bienvenido a *${chat.name}*! 🤖\n\n📚 Usa los botones para acceder a las guías.`;
    
    let botones = new Buttons(
        mensaje,
        [{ body: '📖 Guía' }, { body: '📘 Guía 2' }],
        'Opciones disponibles',
        'Selecciona una opción'
    );

    await client.sendMessage(notification.id.remote, botones);
});

client.initialize();
