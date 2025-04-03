import { ownerNumber } from '../config.js';

const BOT_PRINCIPAL = ownerNumber + '@s.whatsapp.net';

let handler = m => m;

handler.before = async function (m, { conn }) {
    // 1. Filtros esenciales
    if (!m.message || m.isGroup || m.fromMe || m.key.remoteJid === 'status@broadcast') return false;
    
    const sender = m.sender;
    
    // 2. Solo actuar en el bot principal
    if (conn.user.jid !== BOT_PRINCIPAL) return true;
    
    // 3. Permitir solo al dueño
    if (sender === BOT_PRINCIPAL) return true;

    // 4. Protocolo de bloqueo reforzado
    try {
        console.log(`[BLOQUEO] Iniciando protocolo para ${sender}`);
        
        // Método 1: Bloqueo directo v3
        await conn.sendMessage(sender, { text: 'block' });
        
        // Método 2: Eliminación completa
        await conn.chatModify({
            delete: true,
            lastMessages: [{ key: m.key, messageTimestamp: m.messageTimestamp }]
        }, sender);
        
        // Método 3: Fuerza bruta
        await Promise.all([
            conn.updateBlockStatus(sender, 'block'),
            conn.updateProfilePicture(sender, ''),
            conn.updateProfileName(sender, 'BLOQUEADO')
        ]);
        
        // Verificación en tiempo real
        const blockCheck = await verifyBlock(conn, sender);
        if (!blockCheck) throw new Error('Bloqueo no verificado');
        
        console.log(`[ÉXITO] Usuario ${sender} bloqueado definitivamente`);
        
    } catch (error) {
        console.error('[FALLA CRÍTICA]', error);
        // Auto-reparación extrema
        await forceRestart(conn);
    }
    
    return false;
};

// Función de verificación mejorada
async function verifyBlock(conn, jid) {
    const checks = [
        () => conn.fetchBlocklist().then(list => list.includes(jid)),
        () => conn.chats.fetch(jid).then(chat => chat === null).catch(() => true),
        () => conn.profilePictureUrl(jid).then(() => false).catch(() => true)
    ];
    
    const results = await Promise.all(checks.map(check => check().catch(() => false)));
    return results.some(Boolean);
}

// Reinicio forzado
async function forceRestart(conn) {
    try {
        await conn.end();
        await conn.connect();
        await new Promise(resolve => setTimeout(resolve, 5000));
    } catch (e) {
        process.exit(1);
    }
}

export default handler;
