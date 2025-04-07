import { delay } from '@whiskeysockets/baileys';
import makeWASocket from '@whiskeysockets/baileys';

const sock = makeWASocket({ /* Configuración aquí */ });
const mensaje = 'Probando sistema elite ...';

async function enviarMensajesAutomaticos(sock) {
  while (true) {
    try {
      const chats = await sock.groupFetchAllParticipating();
      console.log("Chats:", chats); // Depuración
      const grupoIds = Object.keys(chats);

      if (grupoIds.length === 0) {
        console.log("No hay grupos disponibles.");
        await delay(60000);
        continue;
      }

      for (const id of grupoIds) {
        try {
          await sock.sendMessage(id, { text: mensaje });
          console.log(`✅ Mensaje enviado a ${id}`);
        } catch (error) {
          console.error(`❌ Error en ${id}:`, error.message);
        }
        await delay(3000); // Espera 3 segundos entre mensajes.
      }

      console.log("Esperando 1 minuto...");
      await delay(60000);
    } catch (error) {
      console.error("Error general:", error);
      await delay(30000);
    }
  }
}

enviarMensajesAutomaticos(sock);
