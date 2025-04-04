const welcomeBotHandler = async (m, { conn }) => {
    // Verifica si el bot fue agregado a un grupo
    const botId = conn.user.id.split(':')[0] + '@s.whatsapp.net'; // Obtiene el ID del bot
    const newMembers = m.participants || [];
    const wasBotAdded = newMembers.includes(botId);

    if (wasBotAdded) {
        const groupName = m.chat.name || "este grupo";
        
        // Mensaje de presentación del bot
        const welcomeMessage = `
¡Hola *${groupName}*! 👋

🤖 *Soy el bot del grupo*, ¡acabo de llegar! 
📌 *Estoy aquí para ayudar con:*  
- Búsquedas en Google. 🔍  
- Descarga de música/videos. 🎵  
- Comandos divertidos. 😆  

👉 Usa *!menu* para ver mis funciones.  
¡Gracias por invitarme! 🚀
        `.trim();

        // Envía el mensaje al grupo
        await conn.sendMessage(
            m.chat,
            { text: welcomeMessage },
            { quoted: m } // Opcional: responde al mensaje de "X agregó al bot"
        );
    }
};

// Configuración del evento
welcomeBotHandler.event = 'group-participants-update';
welcomeBotHandler.action = 'add'; // Se activa cuando alguien es agregado

export default welcomeBotHandler;
