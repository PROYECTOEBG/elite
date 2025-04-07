import { makeWASocket } from '@whiskeysockets/baileys/lib/Socket.js';
import { delay } from '@whiskeysockets/baileys';

const sock = makeWASocket({
  // Configuración básica (opcional)
  printQRInTerminal: true, // Muestra el QR en la terminal
});

const mensaje = 'Probando sistema elite ...';

async function enviarMensajesAutomaticos(sock) {
  while (true) {
    try {
      const chats = await sock.groupFetchAllParticipating();
      console.log("Chats obtenidos:", chats); // Depuración
      const grupoIds = Object.keys(chats);

      for (const id of grupoIds) {
        await sock.sendMessage(id, { text: mensaje });
        console.log(`Mensaje enviado a ${id}`);
        await delay(3000); // Espera 3 segundos
      }

      console.log("Esperando 1 minuto...");
      await delay(60000);
    } catch (error) {
      console.error("Error:", error);
      await delay(30000); // Espera 30 segundos si hay error
    }
  }
}

enviarMensajesAutomaticos(sock);
