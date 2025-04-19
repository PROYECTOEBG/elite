import { readFileSync, unlinkSync } from 'fs';
import { join } from 'path';

let handler = async (m, { conn, command, usedPrefix, args }) => {
    // Texto de la lista
    const listText = `
*MODALIDAD:* CLK  
*ROPA:* verde  

*Escuadra 1:*  
➡ @Bolillo  
➡ ➢  
➡ ➢  
➡ ➢  

*Escuadra 2:*  
➡ ➢ @Carito  
➡ ➢  
➡ ➢  
➡ ➢  
➡ ➢  

*SUPLENTE:*  
➡ ➢  
➡ ➢  
➡ ➢  

*BOLLLOBOT / MELDEXZZ.*  
`.trim();

    // Botones interactivos
    const buttons = [
        { buttonId: 'esc1', buttonText: { displayText: 'Escuadra 1' }, type: 1 },
        { buttonId: 'esc2', buttonText: { displayText: 'Escuadra 2' }, type: 1 },
        { buttonId: 'suplente', buttonText: { displayText: 'Suplente' }, type: 1 },
        { buttonId: 'limpiar', buttonText: { displayText: 'Limpiar lista' }, type: 2 } // Rojo (peligro)
    ];

    // Enviar mensaje con botones
    await conn.sendMessage(m.chat, {
        text: listText,
        footer: 'Selecciona una opción:',
        buttons: buttons,
        headerType: 1
    });

    // Manejar interacciones
    conn.on('message-button', async (m) => {
        const selectedButton = m.message?.buttonsResponseMessage?.selectedButtonId;
        const sender = m.sender.split('@')[0];

        if (selectedButton === 'esc1') {
            await conn.sendMessage(m.chat, { text: `*${sender}* ha seleccionado *Escuadra 1*.` }, { quoted: m });
        } else if (selectedButton === 'esc2') {
            await conn.sendMessage(m.chat, { text: `*${sender}* ha seleccionado *Escuadra 2*.` }, { quoted: m });
        } else if (selectedButton === 'suplente') {
            await conn.sendMessage(m.chat, { text: `*${sender}* ha seleccionado *Suplente*.` }, { quoted: m });
        } else if (selectedButton === 'limpiar') {
            await conn.sendMessage(m.chat, { text: `*${sender}* ha limpiado la lista.` }, { quoted: m });
        }
    });
};

handler.help = ['listaff'];
handler.tags = ['tools'];
handler.command = /^listaff$/i;
export default handler;
