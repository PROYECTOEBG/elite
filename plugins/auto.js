import { delay } from '@whiskeysockets/baileys'; // Usa import en lugar de require

// Mensaje que quieres enviar
const mensaje = 'Probando sistema elite ...';

// Función que manda mensajes a todos los grupos
async function enviarMensajesAutomaticos(sock) {
    while (true) {
        try {
            const chats = await sock.groupFetchAllParticipating();
            const grupoIds = Object.keys(chats);

            for (const id of grupoIds) {
                await sock.sendMessage(id, { text: mensaje });
                await delay(1000); // espera 1 segundo entre cada grupo para evitar spam
            }

            console.log(`Mensaje enviado a todos los grupos. Esperando 1 minuto...`);
            await delay(60 * 1000); // espera 1 minuto
        } catch (error) {
            console.error('Error al enviar mensaje automático:', error);
            await delay(30 * 1000); // espera 30 segundos si hay error
        }
    }
}
