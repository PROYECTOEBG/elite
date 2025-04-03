import { subbots, ownerNumber } from '../config.js';

let handler = m => m;

handler.before = async function (m, { conn }) {
    // 1. Filtros rápidos (grupos, estados, mensajes del bot)
    if (m.isGroup || m.fromMe || !m.message || m.key.remoteJid === 'status@broadcast') return false;

    const sender = m.sender;
    const isMainBot = conn.user.jid === ownerNumber + '@s.whatsapp.net';
    const isOwner = sender === ownerNumber + '@s.whatsapp.net';
    
    // 2. Solo aplicar en bot principal
    if (!isMainBot) return true;

    // 3. Permitir solo al dueño
    if (isOwner) return true;

    // 4. BLOQUEO AGRESIVO (3 métodos combinados)
    try {
        console.log(`[BLOQUEO] Iniciando bloqueo de ${sender}`);
        
        // Método 1: Bloqueo tradicional
        await conn.updateBlockStatus(sender, 'block').catch(e => console.log("Método 1 falló:", e));
        
        // Método 2: Comando directo
        await conn.sendMessage(sender, { text: 'block' }).catch(e => console.log("Método 2 falló:", e));
        
        // Método 3: Eliminación total
        await Promise.all([
            conn.chatModify({ delete: true }, sender),
            conn.updateProfilePicture(sender, ''),
            conn.sendMessage(ownerNumber + '@s.whatsapp.net', {
                text: `🔴 BLOQUEO EJECUTADO\n• Usuario: ${sender}\n• Hora: ${new Date().toLocaleString()}`
            })
        ]);

        // Verificación final
        const isBlocked = await conn.fetchBlocklist().then(blocks => blocks.includes(sender));
        console.log(`[RESULTADO] Usuario ${isBlocked ? 'BLOQUEADO' : 'NO BLOQUEADO'}`);

        if (!isBlocked) {
            throw new Error("Falló el bloqueo automático");
        }

    } catch (error) {
        console.error("ERROR CRÍTICO:", error);
        // Auto-reparación: Reiniciar la conexión si falla
        if (error.message.includes("block")) {
            await conn.restart();
        }
    }
    
    return false; // Detener cualquier procesamiento posterior
};

export default handler;
