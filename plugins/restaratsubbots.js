import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';

const handler = async (m, { conn, isROwner, text }) => {
    const datas = global;

    if (!process.send) throw 'Dont: node main.js\nDo: node index.js';

    const { key } = await conn.sendMessage(m.chat, { text: `🚀🚀` }, { quoted: m });
    await delay(1000 * 1);
    await conn.sendMessage(m.chat, { text: `🚀🚀🚀🚀`, edit: key });
    await delay(1000 * 1);
    await conn.sendMessage(m.chat, { text: `🚀🚀🚀🚀🚀🚀`, edit: key });
    await conn.sendMessage(m.chat, { text: `𝙍𝙚𝙞𝙣𝙞𝙘𝙞𝙖𝙧 | 𝙍𝙚𝙨𝙩𝙖𝙧𝙩`, edit: key });

    // Llamamos a la función para reiniciar los subbots
    restartSubbots();

    // Función para reiniciar los subbots
    const restartSubbots = () => {
        const subbotsDir = path.join(__dirname, 'GataJadiBot');  // Ruta de la carpeta de subbots
        fs.readdir(subbotsDir, (err, files) => {
            if (err) {
                console.error('Error leyendo la carpeta de subbots:', err);
                return;
            }

            // Filtrar solo las carpetas (si los subbots están organizados como carpetas)
            const subbots = files.filter(file => fs.statSync(path.join(subbotsDir, file)).isDirectory());

            // Reiniciar cada subbot encontrado
            subbots.forEach(subbot => {
                exec(`pm2 restart ${subbot}`, (error, stdout, stderr) => {
                    if (error) {
                        console.error(`Error reiniciando ${subbot}: ${error.message}`);
                        return;
                    }
                    if (stderr) {
                        console.error(`stderr: ${stderr}`);
                        return;
                    }
                    console.log(`stdout de ${subbot}: ${stdout}`);
                });
            });
        });
    };
};

// Función de espera
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

handler.help = ['restart'];
handler.tags = ['owner'];
handler.command = ['restartt', 'reiniciar'];
handler.owner = true;

export default handler;
