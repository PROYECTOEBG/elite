const { makeWASocket, useSingleFileAuthState } = require('@whiskeysockets/baileys');
const fs = require('fs');

// CONFIGURACIÓN (¡OBLIGATORIO AJUSTAR!)
const config = {
  ownerNumber: '593993370003', // TU NÚMERO con código de país (sin +)
  botName: 'MiBotAntiPrivado', // Nombre que aparecerá en los logs
  blockMessage: '⚠️ *ACCESO DENEGADO*\n\nEste bot es de uso exclusivo para su dueño.\nHas sido *bloqueado* automáticamente.',
  sessionFile: './session.json'
};

// Inicialización mejorada
const { state, saveState } = useSingleFileAuthState(config.sessionFile);
const sock = makeWASocket({
  auth: state,
  printQRInTerminal: true,
  logger: { level: 'warn' } // Solo muestra advertencias y errores
});

// Manejo de conexión
sock.ev.on('connection.update', ({ connection }) => {
  if (connection === 'open') {
    console.log(`\n✅ ${config.botName} CONECTADO`);
    console.log(`🔒 MODO ANTIPRIVADO ACTIVO\n🔐 Número autorizado: ${config.ownerNumber}\n`);
  }
});

// Guardar sesión automáticamente
sock.ev.on('creds.update', saveState);

// Manejo de mensajes MEJORADO
sock.ev.on('messages.upsert', async ({ messages }) => {
  try {
    const msg = messages[0];
    if (!msg.message || msg.key.fromMe) return;

    const sender = msg.key.remoteJid;
    const isGroup = sender.includes('@g.us');
    const userNumber = sender.replace(/@s\.whatsapp\.net/, '');

    // Verificación MEJORADA
    if (!isGroup && userNumber !== config.ownerNumber) {
      console.log(`\n🚨 Intento de acceso de: ${userNumber}`);

      // 1. Enviar advertencia
      await sock.sendMessage(sender, { text: config.blockMessage });

      // 2. Bloqueo MEJORADO (método garantizado)
      await sock.updateBlockStatus(sender, 'block');
      console.log(`🔒 Número bloqueado: ${userNumber}`);

      // 3. Eliminar chat (opcional pero recomendado)
      await sock.sendMessage(sender, { text: '🔴 Eliminando chat...' });
      await sock.chatModify({ delete: true }, sender);
      
      // 4. Notificar al dueño (opcional)
      await sock.sendMessage(
        `${config.ownerNumber}@s.whatsapp.net`, 
        { text: `🚨 Bloqueado: ${userNumber}` }
      );
    }
  } catch (error) {
    console.error('⚠️ Error en antiprivado:', error);
  }
});

// Manejo de errores global
process.on('uncaughtException', (err) => {
  console.error('Error crítico:', err);
});
