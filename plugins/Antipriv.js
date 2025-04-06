const { makeWASocket, useSingleFileAuthState } = require('@whiskeysockets/baileys');

// CONFIGUuuRACIÓN
const config = {
  ownerNumber: '593993370003', // TU NÚMERO (con código de país, sin +)
  allowedGroups: ['120363043123456789@g.us'], // IDs de grupos permitidos (opcional)
  ignoreMessage: '⚠️ Los comandos solo funcionan en grupos oficiales',
  sessionFile: './session.json'
};

// INICIALIZACIÓN
const { state, saveState } = useSingleFileAuthState(config.sessionFile);
const sock = makeWASocket({
  auth: state,
  printQRInTerminal: true,
  logger: { level: 'warn' }
});

// MANEJO DE CONEXIÓN
sock.ev.on('connection.update', ({ connection }) => {
  if (connection === 'open') {
    console.log(`\n✅ Bot conectado | Dueño: ${config.ownerNumber}`);
    console.log(`🔇 Ignorando comandos en privado (sin bloquear usuarios)\n`);
  }
});

// GUARDAR SESIÓN
sock.ev.on('creds.update', saveState);

// MANEJO DE MENSAJES
sock.ev.on('messages.upsert', async ({ messages }) => {
  try {
    const msg = messages[0];
    if (!msg.message || msg.key.fromMe) return;

    const sender = msg.key.remoteJid;
    const isGroup = sender.includes('@g.us');
    const userNumber = sender.replace(/@s\.whatsapp\.net/, '');
    const isOwner = userNumber === config.ownerNumber;
    const isAllowedGroup = config.allowedGroups.includes(sende
