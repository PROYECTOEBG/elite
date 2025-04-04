import axios from 'axios';

const handler = async (m, { conn }) => {
  const who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender;
  
  // Obtener la URL de la imagen de perfil del usuario mencionado (o del que manda el mensaje)
  let avatarUrl = await conn.profilePictureUrl(who, 'image').catch((_) => 'https://telegra.ph/file/24fa902ead26340f3df2c.png');
  
  try {
    // Hacer la llamada a la API para generar la imagen
    const response = await axios.get(`https://some-random-api.com/canvas/gay?avatar=${avatarUrl}`, { responseType: 'arraybuffer' });
    
    // Convertir la imagen a un buffer para enviarla
    const imageBuffer = Buffer.from(response.data, 'binary');
    
    // Enviar la imagen generada
    await conn.sendFile(m.chat, imageBuffer, 'error.png', '*🏳️‍🌈 𝙼𝙸𝚁𝙴𝙽 𝙰 𝙴𝚂𝚃𝙴 𝙶𝙰𝚈 🏳️‍🌈*', m);
  } catch (error) {
    console.error('Error al obtener la imagen:', error);
    await conn.sendMessage(m.chat, 'Hubo un error al generar la imagen, por favor intenta de nuevo más tarde.', { quoted: m });
  }
};

handler.help = ['gay'];
handler.tags = ['maker'];
handler.command = /^(gay)$/i;

export default handler;
