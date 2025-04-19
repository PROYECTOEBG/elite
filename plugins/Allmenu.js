// plugins/listaff.js
import { MessageType } from '@whiskeysockets/baileys';

let handler = async (m, { conn, usedPrefix }) => {
    let fkontak = { "key": { "participants":"0@s.whatsapp.net", "remoteJid": "status@broadcast", "fromMe": false, "id": "Halo" }, "message": { "contactMessage": { "vcard": `BEGIN:VCARD\nVERSION:3.0\nN:Sy;Bot;;;\nFN:y\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD` }}, "participant": "0@s.whatsapp.net" }

    const buttons = [
        { buttonId: `${usedPrefix}listaff 1`, buttonText: { displayText: 'Escuadra 1' }, type: 1 },
        { buttonId: `${usedPrefix}listaff 2`, buttonText: { displayText: 'Escuadra 2' }, type: 1 }
    ];

    const escuadra1 = `╭─────────────╮
│ 𝗘𝗦𝗖𝗨𝗔𝗗𝗥𝗔 1
│👑 ➤ ${global.db.data.users[m.sender]?.escuadra1 || 'Vacante'}
│🥷🏻 ➤ ${global.db.data.users[m.sender]?.escuadra2 || 'Vacante'}
│🥷🏻 ➤ ${global.db.data.users[m.sender]?.escuadra3 || 'Vacante'}
│🥷🏻 ➤ ${global.db.data.users[m.sender]?.escuadra4 || 'Vacante'}
╰─────────────╯`;

    const escuadra2 = `╭─────────────╮
│ 𝗘𝗦𝗖𝗨𝗔𝗗𝗥𝗔 2
│👑 ➤ ${global.db.data.users[m.sender]?.escuadra5 || 'Vacante'}
│🥷🏻 ➤ ${global.db.data.users[m.sender]?.escuadra6 || 'Vacante'}
│🥷🏻 ➤ ${global.db.data.users[m.sender]?.escuadra7 || 'Vacante'}
│🥷🏻 ➤ ${global.db.data.users[m.sender]?.escuadra8 || 'Vacante'}
╰─────────────╯`;

    const buttonMessage = {
        contentText: `${escuadra1}\n\n${escuadra2}`,
        footerText: 'Presiona el botón para unirte a una escuadra',
        buttons: buttons,
        headerType: 1
    };

    await conn.sendMessage(m.chat, buttonMessage, MessageType.buttonsMessage, { quoted: fkontak });
}

// En handler.js (en la función before)
export async function before(m, { conn, usedPrefix, text, participants }) {
    if (m.messageButtonResponse) {
        const buttonId = m.messageButtonResponse.selectedButtonId;
        if (buttonId.startsWith(`${usedPrefix}listaff`)) {
            const escuadra = buttonId.split(' ')[1];
            const user = m.sender;
            const userName = conn.getName(user);
            
            if (escuadra === '1') {
                global.db.data.users[user] = {
                    escuadra1: userName,
                    escuadra2: 'Vacante',
                    escuadra3: 'Vacante',
                    escuadra4: 'Vacante'
                };
            } else {
                global.db.data.users[user] = {
                    escuadra5: userName,
                    escuadra6: 'Vacante',
                    escuadra7: 'Vacante',
                    escuadra8: 'Vacante'
                };
            }

            const escuadra1 = `╭─────────────╮
│ 𝗘𝗦𝗖𝗨𝗔𝗗𝗥𝗔 1
│👑 ➤ ${global.db.data.users[user]?.escuadra1 || 'Vacante'}
│🥷🏻 ➤ ${global.db.data.users[user]?.escuadra2 || 'Vacante'}
│🥷🏻 ➤ ${global.db.data.users[user]?.escuadra3 || 'Vacante'}
│🥷🏻 ➤ ${global.db.data.users[user]?.escuadra4 || 'Vacante'}
╰─────────────╯`;

            const escuadra2 = `╭─────────────╮
│ 𝗘𝗦𝗖𝗨𝗔𝗗𝗥𝗔 2
│👑 ➤ ${global.db.data.users[user]?.escuadra5 || 'Vacante'}
│🥷🏻 ➤ ${global.db.data.users[user]?.escuadra6 || 'Vacante'}
│🥷🏻 ➤ ${global.db.data.users[user]?.escuadra7 || 'Vacante'}
│🥷🏻 ➤ ${global.db.data.users[user]?.escuadra8 || 'Vacante'}
╰─────────────╯`;

            const buttonMessage = {
                contentText: `${escuadra1}\n\n${escuadra2}`,
                footerText: 'Presiona el botón para unirte a una escuadra',
                buttons: buttons,
                headerType: 1
            };

            await conn.sendMessage(m.chat, buttonMessage, MessageType.buttonsMessage);
            return true;
        }
    }
    return true;
}

handler.command = ['listaff']
handler.group = true
handler.botAdmin = true
handler.admin = true

export default handler
