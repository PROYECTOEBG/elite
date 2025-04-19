// plugins/listaff.js
import fetch from 'node-fetch';
import { MessageType } from '@whiskeysockets/baileys';

let handler = async (m, { conn, usedPrefix, text, groupMetadata, participants }) => {
    let fkontak = { "key": { "participants":"0@s.whatsapp.net", "remoteJid": "status@broadcast", "fromMe": false, "id": "Halo" }, "message": { "contactMessage": { "vcard": `BEGIN:VCARD\nVERSION:3.0\nN:Sy;Bot;;;\nFN:y\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD` }}, "participant": "0@s.whatsapp.net" }
    
    const buttons = [
        { buttonId: `${usedPrefix}listaff 1`, buttonText: { displayText: 'Escuadra 1' }, type: 1 },
        { buttonId: `${usedPrefix}listaff 2`, buttonText: { displayText: 'Escuadra 2' }, type: 1 }
    ];

    const escuadra1 = `╭─────────────╮
│ 𝗘𝗦𝗖𝗨𝗔𝗗𝗥𝗔 1
│👑 ➤ ${text === '1' ? conn.getName(m.sender) : 'Vacante'}
│🥷🏻 ➤ ${text === '1' ? conn.getName(m.sender) : 'Vacante'}
│🥷🏻 ➤ ${text === '1' ? conn.getName(m.sender) : 'Vacante'}
│🥷🏻 ➤ ${text === '1' ? conn.getName(m.sender) : 'Vacante'}
╰─────────────╯`;

    const escuadra2 = `╭─────────────╮
│ 𝗘𝗦𝗖𝗨𝗔𝗗𝗥𝗔 2
│👑 ➤ ${text === '2' ? conn.getName(m.sender) : 'Vacante'}
│🥷🏻 ➤ ${text === '2' ? conn.getName(m.sender) : 'Vacante'}
│🥷🏻 ➤ ${text === '2' ? conn.getName(m.sender) : 'Vacante'}
│🥷🏻 ➤ ${text === '2' ? conn.getName(m.sender) : 'Vacante'}
╰─────────────╯`;

    const buttonMessage = {
        text: `${escuadra1}\n\n${escuadra2}`,
        footer: 'Presiona el botón para unirte a una escuadra',
        buttons: buttons,
        headerType: 1
    };

    await conn.sendMessage(m.chat, buttonMessage, MessageType.buttonsMessage, { quoted: fkontak });
}

handler.command = ['listaff']
handler.group = true
handler.botAdmin = true
handler.admin = true

export default handler
