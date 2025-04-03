import { subbots, ownerNumber } from '../config.js'; // Importa configuración

let handler = m => m;

/*----------------------[ AUTOREAD PARA COMANDOS ]-----------------------*/
handler.all = async function (m) {
    let prefixRegex = new RegExp('^[' + (opts['prefix'] || '‎xzXZ/i!#$%+£¢€¥^°=¶∆×÷π√✓©®:;?&.,\\-').replace(/[|\\{}()[\]^$+*?.\-\^]/g, '\\$&') + ']');
    
    if (m.text && prefixRegex.test(m.text)) {
        await this.sendPresenceUpdate('composing', m.chat);
        await this.readMessages([m.key]);
    }
    return true;
};

/*----------------------[ ANTIPRIVADO INTELIGENTE ]-----------------------*/
const allowedCommands = /^(menu|ayuda|comandos|ping|estado|verificar|code|creadora|grupos)/i;

handler.before = async function (m, { conn, isROwner }) {
    // Ignorar si es grupo, mensaje propio o sin mensaje
    if (m.isGroup || m.fromMe || !m.message) return false;

    const sender = m.sender;
    const isSubbot = subbots.includes(sender.split('@')[0]);
    const isMainBot = conn.user.jid === ownerNumber + '@s.whatsapp.net';

    // Permitir siempre a dueño y subbots
    if (isROwner || isSubbot) return true;

    // Si es comando permitido, dejar pasar
    if (m.text && allowedCommands.test(m.text.trim())) {
        return true;
    }

    // Solo aplicar antiprivado en el bot principal
    if (isMainBot) {
        try {
            // Mensaje de advertencia
            await conn.reply(m.chat, 
                `⚠️ *No acepto mensajes privados*\n\n` +
                `Si necesitas algo, escribe *${opts.prefix}menu* para ver mis comandos.\n` +
                `Serás bloqueado automáticamente.`, 
                m, { mentions: [m.sender] });
            
            // Bloqueo después de 2 segundos
            setTimeout(async () => {
                await conn.updateBlockStatus(sender, 'block');
                console.log(`Usuario bloqueado: ${sender}`);
                
                // Notificar al owner
                await conn.sendMessage(ownerNumber + '@s.whatsapp.net', {
                    text: `🚨 *Antiprivado Activado*\n▢ *Usuario:* ${sender}\n▢ *Acción:* Bloqueado`
                });
            }, 2000);
            
        } catch (error) {
            console.error('Error en antiprivado:', error);
        }
        return false;
    }
    
    return true;
};

export default handler;
