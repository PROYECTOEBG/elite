const welcomeHandler = async (m, { conn, groupMetadata }) => {
    // Verifica que el mensaje sea por la creación del grupo
    if (!m.messageStubType || !m.isGroup) return;
    if (m.messageStubType !== 20) return; // 20 = Creación de grupo

    let subject = groupMetadata.subject || "el grupo";
    let welcomeText = `✨ ¡Hola a todos! Soy su nuevo bot en *${subject}*! 🤖\n\n` +
                      `👮 Recuerden seguir las reglas del grupo.\n` +
                      `💡 ¿Necesitan ayuda? Seleccionen una opción:`;

    // Botones de opciones
    const buttons = [
        {
            buttonId: `guia1`,
            buttonText: { displayText: "📖 Guía" },
            type: 1,
        },
        {
            buttonId: `guia2`,
            buttonText: { displayText: "📘 Guía 2" },
            type: 1,
        },
    ];

    await conn.sendMessage(
        m.chat,
        {
            text: welcomeText,
            buttons: buttons,
            footer: "Powered by tu-bot",
            headerType: 1,
            viewOnce: true,
        },
        { quoted: m }
    );
};

// No necesita un comando, se activa solo cuando el bot es agregado
export default welcomeHandler;
