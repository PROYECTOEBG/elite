export async function before(m, { conn, participants, groupMetadata }) {
  // Verifica que sea un mensaje de grupo y que se active un evento de bienvenida/despedida
  if (!m.messageStubType || !m.isGroup) return;
  
  // Verifica que el chat esté configurado para subbots
  let chat = global.db.data.chats[m.chat];
  if (!chat.subbot) return; // Solo se ejecuta si es un subbot

  // Extrae el nombre del grupo (con valor por defecto)
  const subject = groupMetadata && groupMetadata.subject ? groupMetadata.subject : "Grupo sin nombre";

  // Evento de bienvenida (por ejemplo, messageStubType 27 para nuevos miembros)
  if (m.messageStubType === 27 && m.messageStubParameters.length > 0) {
    // El primer parámetro suele ser el ID del usuario agregado
    let newUser = m.messageStubParameters[0];
    let welcomeMsg = `¡Bienvenido(a) @${newUser.split('@')[0]} al grupo *${subject}*!\nEsperamos que disfrutes tu estadía.`;
    await conn.sendMessage(m.chat, { text: welcomeMsg, mentions: [newUser] });
  }

  // Evento de despedida (por ejemplo, messageStubType 28 o 32 para salida de miembros)
  if ((m.messageStubType === 28 || m.messageStubType === 32) && m.messageStubParameters.length > 0) {
    let leftUser = m.messageStubParameters[0];
    let farewellMsg = `Adiós @${leftUser.split('@')[0]}, te extrañaremos en *${subject}*. ¡Hasta pronto!`;
    await conn.sendMessage(m.chat, { text: farewellMsg, mentions: [leftUser] });
  }
}
