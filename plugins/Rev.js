let handler = m => m;

handler.before = async function (m, { conn, groupMetadata }) {
  // Verifica si el mensaje indica que el bot ha sido agregado al grupo
  if (!m.messageStubType || !m.isGroup) return;
  
  if (m.messageStubType === 27 && m.messageStubParameters.includes(conn.user.jid)) {
    let subject = groupMetadata.subject;
    let descs = groupMetadata.desc || "😻 𝗦𝘂𝗽𝗲𝗿 𝗚𝗮𝘁𝗮𝗕𝗼𝘁 😻";
    
    let welcomeBotMessage = `*Hola a todos!* 🤖✨\n\nSoy *Super GataBot-MD* y estoy aquí para ayudar en *${subject}*.\n\n📌 Escribe *!menu* para ver mis comandos.\n📄 No olvides leer la descripción del grupo.\n\n¡Gracias por agregarme! 😺💖\n\n${descs}`;
    
    await conn.sendMessage(m.chat, { text: welcomeBotMessage }, { quoted: m });
  }
};

export default handler;
