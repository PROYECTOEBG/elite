const welcomeBotHandler = async (m, { conn, usedPrefix }) => {
    // 1. Verificar si el bot fue agregado al grupo
    const botId = conn.user.id.split(':')[0] + '@s.whatsapp.net'; // ID del bot
    const newMembers = m.participants || [];
    const wasBotAdded = newMembers.includes(botId);

    if (wasBotAdded) {
        const groupName = m.chat.name || "este grupo";

        // 2. Mensaje de bienvenida (como en tu código init)
        const welcomeText = `
¡Hola *${groupName}*! 👋

🤖 *Soy el bot del grupo*, acabo de llegar. 
Usen *${usedPrefix}menu* para ver mis comandos. 
¡Estoy aquí para ayudar! 🛠️
        `.trim();

        // 3. Botones (estructura idéntica a tu código init)
        const buttons = [
            {
                buttonId: `${usedPrefix}menu`,
                buttonText: { displayText: "📜 VER MENÚ" },
                type: 1
            },
            {
                buttonId: `${usedPrefix}owner`,
                buttonText: { displayText: "👑 CREADOR" },
                type: 1
            }
        ];

        // 4. Enviar mensaje (misma sintaxis que tu initHandler)
        await conn.sendMessage(
            m.chat,
            {
                text: welcomeText,
                buttons: buttons,
                footer: "¡Gracias por agregarme!",
                viewOnce: true // Opcional: como en tu código original
            },
            { quoted: m }
        );
    }
};

// 5. Configuración del evento (como necesitas)
welcomeBotHandler.event = 'group-participants-update';
welcomeBotHandler.action = 'add'; // Se activa al agregar miembros

export default welcomeBotHandler;
