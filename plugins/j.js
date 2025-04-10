import fs from 'fs';
import path from 'path';
import chalk from 'chalk';

const codes = new Map();

function generateCode() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let result = '';
    for (let i = 0; i < 8; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

async function sendCode(m, conn) {
    const code = generateCode();
    codes.set(m.sender, code);
    await conn.sendMessage(m.chat, { text: `Tu código de vinculación es: ${code}` }, { quoted: m });
}

async function verifyCode(m, conn, args) {
    const userCode = args[0];
    const storedCode = codes.get(m.sender);

    if (userCode === storedCode) {
        await conn.sendMessage(m.chat, { text: 'Código verificado correctamente.' }, { quoted: m });
        codes.delete(m.sender);
    } else {
        await conn.sendMessage(m.chat, { text: 'Código incorrecto. Intenta de nuevo.' }, { quoted: m });
    }
}

let handler = async (m, { conn, args, command }) => {
    if (command === 'generatecode') {
        await sendCode(m, conn);
    } else if (command === 'verifycode') {
        await verifyCode(m, conn, args);
    }
};

handler.command = /^(generatecode|verifycode)$/i;
export default handler;
