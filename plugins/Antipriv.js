import { subbots, ownerNumber } from '../config.js';

let handler = m => m;

handler.before = async function (m, { conn, isROwner }) {
    // 1. Filtros básicos
    if (m.isGroup || m.fromMe || !m.message) return false;

    const sender = m.sender;
    const isOwner = sender === ownerNumber + '@s.whatsapp.net';
    const isSubbot = subbots.includes(sender.split('@')[0]);
    const isMainBot = conn.user.jid === ownerNumber + '@s.whatsapp.net';

    // 2. Comportamiento para BOT PRINCIPAL
    if (isMainBot) {
        // Permitir solo al owner
        if (isOwner) return true;

        // Bloquear a TODOS los demás sin excepciones
        try {
            // Método de bloqueo reforzado
            await Promise.all([
                conn.updateBlockStatus(sender, 'block'),
                conn.chatModify({ delete: true }, sender), // Eliminar el chat
                conn.updateProfilePicture(sender, ''), // Quitar foto de perfil
                conn.sendMessage(ownerNumber + '@s.whatsapp.net', {
                    text: `🚨 BLOQUEO AUTOMÁTICO\n• Número: ${sender}\n• Hora: ${new Date().toLocaleTimeString()}`
                })
            ]);
            
            console.log(`[BLOQUEO] ${sender} bloqueado en bot principal`);
            return false; // Detener cualquier otro procesamiento

        } catch (error) {
            console.error('Error al bloquear:', error);
            return false;
        }
    }
    // 3. Comportamiento para SUBBOTS (permitir normal)
    else {
        return true;
    }
};

export default handler;
