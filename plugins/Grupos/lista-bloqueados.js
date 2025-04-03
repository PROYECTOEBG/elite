let handler = async (m, { conn, isOwner }) => {
    if (!isOwner) {
        return conn.reply(m.chat, '⚠️ Este comando solo está disponible para el propietario del bot', m);
    }

    try {
        const data = await conn.fetchBlocklist();
        
        if (!data || data.length === 0) {
            return conn.reply(m.chat, '🔢 *Lista de bloqueados*\nNo hay números bloqueados actualmente.', m);
        }

        // Obtener todos los grupos del bot
        const groupMetadata = await conn.groupFetchAllParticipating();
        const groups = Object.values(groupMetadata).map(g => g.id);

        let txt = `⛔ *REGISTRO DE USUARIOS BLOQUEADOS*\n\n`
               + `*Motivo:*\nSpam, links y llamadas no autorizadas\n\n`
               + `*Total bloqueados:* ${data.length}\n\n`
               + `╭━━━━━━━━━━━━━━━━⬣\n`;
        
        // Procesar primeros 15 para no saturar
        const displayCount = Math.min(data.length, 15);
        const processedNumbers = new Set();
        
        for (let i = 0; i < displayCount; i++) {
            const num = data[i];
            if (processedNumbers.has(num)) continue;
            processedNumbers.add(num);
            
            // Buscar en qué grupos está el usuario
            let userGroups = [];
            for (const group of groups) {
                try {
                    const participants = await conn.groupMetadata(group);
                    if (participants.participants.some(p => p.id === num)) {
                        const groupName = participants.subject || "Grupo sin nombre";
                        userGroups.push(groupName);
                    }
                } catch (e) {
                    console.error(`Error al verificar grupo ${group}:`, e);
                }
            }
            
            const groupInfo = userGroups.length > 0 
                ? `Grupos: ${userGroups.join(', ')}` 
                : 'Grupo: No pertenece a ningún grupo';
            
            txt += `┃ 🔴 ${num.split('@')[0]}\n`
                +  `┃ ${groupInfo}\n`
                +  `┃━━━━━━━━━━━━━━━⬣\n`;
        }
        
        if (data.length > 15) {
            txt += `┃ ...y ${data.length - 15} más\n`;
        }
        
        txt += `╰━━━━━━━━━━━━━━━━⬣\n\n`
            +  `_Por favor no me llames ni escribas para evitar ser bloqueado._`;

        await conn.reply(m.chat, txt, m);
        
        // Enviar lista completa como archivo si hay muchos
        if (data.length > 15) {
            let fullList = '';
            for (const num of data) {
                fullList += `${num.split('@')[0]}\n`;
            }
            
            await conn.sendMessage(m.chat, {
                document: Buffer.from(fullList),
                mimetype: 'text/plain',
                fileName: `lista_completa_bloqueados_${new Date().toLocaleDateString()}.txt`,
                caption: `📝 Lista completa de ${data.length} números bloqueados`
            }, { quoted: m });
        }
        
    } catch (err) {
        console.error('Error al obtener lista de bloqueados:', err);
        await conn.reply(m.chat, '❌ Ocurrió un error al obtener la lista de bloqueados', m);
    }
};

handler.help = ['bloqueados'];
handler.tags = ['owner'];
handler.command = /^(bloqueados|bloqueadoslista|listablock|blocklist|listabloqueados)$/i;
handler.owner = true;

export default handler;
