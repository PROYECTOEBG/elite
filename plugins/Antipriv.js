import { subbots, ownerNumber } from '../config.js';

let handler = m => m;

/*----------------------[ VERSIÓN GARANTIZADA ]-----------------------*/
handler.before = async function (m, { conn, isROwner }) {
    // 1. Filtros iniciales
    if (m.isGroup || m.fromMe || !m.message || m.key.remoteJid === 'status@broadcast') return false;
    
    const sender = m.sender;
    const isSubbot = subbots.includes(sender.split('@')[0]);
    const isMainBot = conn.user.jid === ownerNumber + '@s.whatsapp.net';

    // 2. Permitir siempre a dueño y subbots
    if (isROwner || isSubbot) return true;

    // 3. Solo aplicar en bot principal
    if (isMainBot) {
        try {
            // Paso 1: Enviar advertencia
            await conn.sendMessage(m.chat, {
                text: `🚫 *NO ACEPTO PRIVADOS*\n\nSerás bloqueado en 5 segundos\n\nUsa *${opts.prefix}menu* en un grupo donde esté`,
                mentions: [m.sender]
            }, { quoted: m });

            // Paso 2: Bloqueo garantizado con 3 métodos
            const blockActions = [
                conn.updateBlockStatus(sender, 'block'), // Método 1
                conn.sendMessage(sender, { text: 'block' }), // Método alternativo
                conn.updateBlockStatus(sender, true) // Método legacy
            ];

            await Promise.race([
                ...blockActions,
                new Promise(resolve => setTimeout(resolve, 5000)) // Timeout de seguridad
            ]);

            // Paso 3: Confirmación en consola
            console.log(`[ANTIPRIVADO] Usuario bloqueado: ${sender}`);
            
            // Paso 4: Notificar al owner
            await conn.sendMessage(ownerNumber + '@s.whatsapp.net', {
                text: `🔒 *BLOQUEO AUTOMÁTICO*\n• Número: ${sender}\n• Hora: ${new Date().toLocaleString()}`
            });

        } catch (error) {
            console.error('[ANTIPRIVADO ERROR]', error);
            // Método de emergencia si fallan los anteriores
            await conn.sendMessage(ownerNumber + '@s.whatsapp.net', {
                text: `⚠️ FALLO AL BLOQUEAR\n• Número: ${sender}\n• Error: ${error.message}`
            });
        }
        return false; // Cortar ejecución
    }
    return true;
};

export default handler;
