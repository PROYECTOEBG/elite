/*----------------------[ MÓDULO PRINCIPAL ]-----------------------*/
import { isBotAdmin, subbots } from '../config.js'; // Ajusta la ruta

let handler = m => m;

/*----------------------[ AUTOREAD ]-----------------------*/
handler.all = async function (m) {
    // Autoread para comandos con prefijo
    let prefixRegex = new RegExp('^[' + (opts['prefix'] || '‎z/i!#$%+£¢€¥^°=¶∆×÷π√✓©®:;?&.,\\-').replace(/[|\\{}()[\]^$+*?.\-\^]/g, '\\$&') + ']');
    
    if (m.text && prefixRegex.test(m.text)) {
        await this.sendPresenceUpdate('composing', m.chat);
        await this.readMessages([m.key]);
    }
    
    return true;
};

/*----------------------[ ANTIPRIVADO MEJORADO ]-----------------------*/
const comandosPermitidos = /^(piedra|papel|tijera|estado|verificar|code|creadora|bottemporal|grupos|instalarbot|términos|bots|deletebot|eliminarsesion|serbot|verify|register|registrar|reg|reg1|nombre|name|nombre2|name2|edad|age|edad2|age2|genero|género|gender|identidad|pasatiempo|hobby|identify|finalizar|pas2|pas3|pas4|pas5|registroc|deletesesion|registror|jadibot)/i;

handler.before = async function (m, { conn, isOwner, isROwner }) {
    if (m.fromMe || m.isGroup) return false;
    if (!m.message) return true;

    // Verificar si es un comando permitido
    const isCommand = comandosPermitidos.test(m.text.toLowerCase().trim());
    
    // Permitir si es un comando válido, subbot, admin o el propio bot
    if (isCommand || subbots.includes(m.sender.split('@')[0]) || isOwner || isROwner || m.sender === conn.user.jid) {
        return true;
    }

    // Aplicar antiprivado
    const botSettings = global.db.data.settings[this.user.jid] || {};
    if (botSettings.antiPrivate) {
        try {
            // Enviar advertencia antes de bloquear
            await conn.reply(m.chat, mid.mAdvertencia + mid.smsprivado(m, cuentas), m, { mentions: [m.sender] });
            
            // Bloquear usuario
            await this.updateBlockStatus(m.sender, 'block');
            
            // Notificar al owner
            await conn.sendMessage(conn.user.jid, {
                text: `🚨 *Usuario bloqueado*\n• Número: ${m.sender}\n• Motivo: Mensaje privado no permitido`
            });
        } catch (error) {
            console.error('Error en antiprivado:', error);
        }
        return false;
    }
    
    return true;
};

export default handler;
