let handler = async (m, { conn, command }) => {
    // Obtener el usuario que envió el comando
    const usuario = m.sender.split('@')[0];
    const tag = m.sender;

    // Referencia a las listas del plugin listaff
    let listas;
    try {
        const listaff = global.plugins.find(p => p.name === 'listaff');
        if (listaff) {
            listas = listaff.listas;
        }
    } catch (e) {
        console.error(e);
    }

    if (!listas) {
        listas = {
            escuadra1: ['➢', '➢', '➢', '➢'],
            escuadra2: ['➢', '➢', '➢', '➢'],
            suplente: ['✔', '✔', '✔']
        };
    }

    // Determinar qué escuadra basado en el comando
    let squadType, squadName;
    if (command === 'escuadra1') {
        squadType = 'escuadra1';
        squadName = 'Escuadra 1';
    } else if (command === 'escuadra2') {
        squadType = 'escuadra2';
        squadName = 'Escuadra 2';
    } else if (command === 'suplente') {
        squadType = 'suplente';
        squadName = 'Suplente';
    } else if (command === 'limpiarlista') {
        // Reiniciar todas las listas
        listas = {
            escuadra1: ['➢', '➢', '➢', '➢'],
            escuadra2: ['➢', '➢', '➢', '➢'],
            suplente: ['✔', '✔', '✔']
        };
        await conn.sendMessage(m.chat, {
            text: `♻️ Listas reiniciadas por @${usuario}`,
            mentions: [tag]
        });
        return;
    }

    // Buscar espacio libre en la escuadra
    const libre = listas[squadType].findIndex(p => p === '➢' || p === '✔');
    
    if (libre !== -1) {
        // Agregar usuario a la escuadra
        listas[squadType][libre] = `@${usuario}`;
        
        // Enviar mensaje de confirmación
        await conn.sendMessage(m.chat, {
            text: `✅ @${usuario} agregado a ${squadName}`,
            mentions: [tag]
        });

        // Mostrar lista actualizada
        const texto = `EliteBot
MODALIDAD: CLK
ROPA: verde

Escuadra 1:
${listas.escuadra1.map(p => `👤 ➢ ${p}`).join('\n')}

Escuadra 2:
${listas.escuadra2.map(p => `👤 ➢ ${p}`).join('\n')}

SUPLENTE:
${listas.suplente.map(p => `👤 ${p}`).join('\n')}

BOLLLOBOT / MELDEXZZ.`;

        await conn.sendMessage(m.chat, { text: texto });
    } else {
        // Enviar mensaje si la escuadra está llena
        await conn.sendMessage(m.chat, {
            text: `⚠️ ${squadName} está llena`,
            mentions: [tag]
        });
    }
}

handler.help = ['escuadra1', 'escuadra2', 'suplente', 'limpiarlista']
handler.tags = ['main']
handler.command = /^(escuadra1|escuadra2|suplente|limpiarlista)$/i

export default handler 
