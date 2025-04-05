const { WAConnection, MessageType } = require('@adiwajshing/baileys');
const fs = require('fs');

// CONFIGURACIÓN - ¡AJUSTA ESTOS VALORES!
const config = {
  authorizedNumber: '593993370003', // TU NÚMERO (con código de país, sin +)
  botNumber: '593986304370', // NÚMERO DE TU BOT (con código de país)
  blockMessage: '🚫 Lo siento, este bot es de uso exclusivo para su dueño. Has sido bloqueado.',
  sessionFile: './session.json'
};

// Iniciar el bot
async function startAntiPrivateBot() {
  const conn = new WAConnection();
  
  // Manejar eventos de conexión
  conn.on('open', () => {
    console.log(`✅ Bot conectado como: ${conn.user.jid}`);
    console.log(`🔒 Solo el número ${config.authorizedNumber} puede enviar mensajes`);
  });

  // Cargar sesión si existe
  if (fs.existsSync(config.sessionFile)) {
    conn.loadAuthInfo(config.sessionFile);
  }

  // Guardar sesión al conectarse
  conn.on('credentials-updated', () => {
    fs.writeFileSync(config.sessionFile, JSON.stringify(conn.base64EncodedAuthInfo(), null, 2));
  });

  // Manejar mensajes entrantes
  conn.on('chat-update', async (chat) => {
    if (!chat.hasNewMessage || chat.messages.key.fromMe) return;
    
    const msg = chat.messages.all()[0];
    const sender = msg.key.remoteJid.replace(/@s.whatsapp.net/, '');
    
    // Verificar si el mensaje es privado (no grupo) y no es del dueño
    if (!msg.key.remoteJid.includes('@g.us') && sender !== config.authorizedNumber) {
      try {
        // Enviar mensaje de bloqueo
        await conn.sendMessage(msg.key.remoteJid, config.blockMessage, MessageType.text);
        
        // Bloquear al usuario
        await conn.blockUser(msg.key.remoteJid, 'add');
        
        console.log(`🚫 Bloqueado: ${sender} - Motivo: Mensaje privado`);
        
        // Opcional: Eliminar el chat
        await conn.deleteChat(msg.key.remoteJid);
        
      } catch (error) {
        console.error('Error al bloquear usuario:', error);
      }
    }
  });

  // Conectar al WhatsApp
  try {
    await conn.connect();
  } catch (error) {
    console.error('Error de conexión:', error);
    process.exit(1);
  }
}

// Iniciar el bot
startAntiPrivateBot();
