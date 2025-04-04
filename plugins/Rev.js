handler.before = async function (m, { conn, groupMetadata }) => {
  // 1. Validar si es un evento de creación de grupo
  if (!m.messageStubType || !m.isGroup || m.messageStubType !== 20) return;

  // 2. Obtener nombre del grupo
  let subject = groupMetadata.subject || "el grupo";
  
  // 3. Mensaje de bienvenida con botones (formato compatible)
  let welcomeMsg = {
    text: `✨ ¡Hola! Soy el bot de *${subject}*. ¡Bienvenidos!`,
    buttons: [
      { buttonId: '.comandos', buttonText: { displayText: '📜 Comandos' }, type: 1 },
      { buttonId: '.reglas', buttonText: { displayText: '📌 Reglas' }, type: 1 }
    ],
    headerType: 4 // ¡Obligatorio para botones!
  };

  // 4. Enviar mensaje (con verificación de errores)
  try {
    await conn.sendMessage(m.chat, welcomeMsg);
    console.log("✅ Mensaje enviado al chat:", m.chat);
  } catch (e) {
    console.error("❌ Error al enviar:", e);
    // Enviar mensaje de texto simple si fallan los botones
    await conn.sendMessage(m.chat, { text: "¡Bienvenidos al grupo! Usen .comandos" });
  }
};
