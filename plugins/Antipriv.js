const { makeWASocket, useSingleFileAuthState, DisconnectReason } = require('@whiskeysockets/baileys');
const pino = require('pino');

// Configuración - ¡AJUSTA ESTOS VALORES!
const config = {
  authorizedNumber: '593993370003', // TU NÚMERO (con código de país, sin +)
  blockMessage: '🚫 *Este bot es privado*\\n\\nSolo el dueño puede usarlo.\\nHas sido bloqueado automáticamente.',
  sessionFile: './session.json'
};

// Inicialización
const { state, saveState } = useSingleFileAuthState(config.sessionFile);
const logger = pino({ level: 'silent' }); // Elimina esta línea si quieres ver logs detallados

async function startBot() {
  const sock = makeWASocket({
    auth: state,
    logger: logger,
    printQRInTerminal: true
  });

  // Manejar actualizaciones de conexión
  sock.ev.on('connection.update', (update) => {
    const { connection, lastDisconnect } = update;
    if (connection === 'close') {
      const shouldReconnect = lastDisconnect.error?.output?.statusCode !== DisconnectReason.loggedOut;
      if (shouldReconnect) {
        startBot();
      }
    } else if (connection === 'open') {
      console.log(`\n✅ *Bot conectado como:* ${sock.user.id.replace(/:.*@/, '@')}`);
      console.log(`🔒 *Modo antiprivado activado:* Solo el número ${config.authorizedNumber} puede interactuar\n`);
    }
  });

  // Guardar estado de la sesión
  sock.ev.on('creds.update', saveState);

  // Manejar mensajes
  sock.ev.on('messages.upsert', async ({ messages }) => {
    const msg = messages[0];
    if (!msg.message || msg.key.fromMe) return;

    const sender = msg.key.remoteJid;
    const isGroup = msg.key.remoteJid.includes('@g.us');
    const number = sender.replace(/@s\.whatsapp\.net/, '');

    // Verificar si es mensaje privado y no es el dueño
    if (!isGroup && number !== config.authorizedNumber) {
      try {
        // 1. Enviar mensaje de bloqueo
        await sock.sendMessage(sender, { 
          text: config.blockMessage 
        });

        // 2. Bloquear usuario
        await sock.updateBlockStatus(sender, 'block');

        // 3. Eliminar chat (opcional)
        await sock.chatModify({ 
          delete: true, 
          lastMessages: [{ key: msg.key, messageTimestamp: msg.messageTimestamp }] 
        }, sender);

        console.log(`🚫 *Número bloqueado:* ${number}`);

      } catch (error) {
        console.error('Error al bloquear:', error);
      }
    }
  });
}

// Iniciar el bot
startBot().catch(err => {
  console.error('Error al iniciar:', err);
  process.exit(1);
});
