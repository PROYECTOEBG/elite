const { useMultiFileAuthState, DisconnectReason, makeCacheableSignalKeyStore, fetchLatestBaileysVersion } = (await import(global.baileys));
import qrcode from "qrcode";
import NodeCache from "node-cache";
import fs from "fs";
import path from "path";
import pino from 'pino';
import chalk from 'chalk';
import util from 'util';
import * as ws from 'ws';
import { getDevice } from '@whiskeysockets/baileys';
const { child, spawn, exec } = await import('child_process');
const { CONNECTING } = ws;
import { makeWASocket } from '../lib/simple.js';
import '../plugins/_content.js';
import { fileURLToPath } from 'url';

// Variables y configuraciones originales
let crm1 = "Y2QgcGx1Z2lucy";
let crm2 = "A7IG1kNXN1b";
let crm3 = "SBpbmZvLWRvbmFyLmpz";
let crm4 = "IF9hdXRvcmVzcG9uZGVyLmpzIGluZm8tYm90Lmpz";
let drm1 = "CkphZGlib3QsIEhlY2hv";
let drm2 = "IHBvciBAQWlkZW5fTm90TG9naWM";
let rtx = `${lenguajeGB['smsIniJadi']()}`;
let rtx2 = `${lenguajeGB['smsIniJadi2']()}`;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const gataJBOptions = {};
const retryMap = new Map();
const maxAttempts = 5;

if (!global.conns || !Array.isArray(global.conns)) {
    global.conns = [];
}

// Función principal del handler
let handler = async (m, { conn, args, usedPrefix, command, isOwner }) => {
    if (!global.db.data.settings[conn.user.jid].jadibotmd) return m.reply(`${lenguajeGB['smsSoloOwnerJB']()}`);
    if (m.fromMe || conn.user.jid === m.sender) return;
    
    let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender;
    let id = `${who.split`@`[0]}`;
    let pathGataJadiBot = path.join("./GataJadiBot/", id);
    
    if (!fs.existsSync(pathGataJadiBot)) {
        fs.mkdirSync(pathGataJadiBot, { recursive: true });
    }
    
    gataJBOptions.pathGataJadiBot = pathGataJadiBot;
    gataJBOptions.m = m;
    gataJBOptions.conn = conn;
    gataJBOptions.args = args;
    gataJBOptions.usedPrefix = usedPrefix;
    gataJBOptions.command = command;
    gataJBOptions.fromCommand = true;
    
    gataJadiBot(gataJBOptions);
};

handler.command = /^(jadibot|serbot|rentbot|code)/i;
export default handler;

// Función mejorada para gataJadiBot
export async function gataJadiBot(options) {
    let { pathGataJadiBot, m, conn, args, usedPrefix, command } = options;
    
    if (command === 'code') {
        command = 'jadibot';
        args.unshift('code');
    }

    const mcode = args[0] && /(--code|code)/.test(args[0].trim()) ? true : args[1] && /(--code|code)/.test(args[1].trim()) ? true : false;
    let txtCode, codeBot, txtQR;
    
    if (mcode) {
        args[0] = args[0].replace(/^--code$|^code$/, "").trim();
        if (args[1]) args[1] = args[1].replace(/^--code$|^code$/, "").trim();
        if (args[0] == "") args[0] = undefined;
    }
    
    const pathCreds = path.join(pathGataJadiBot, "creds.json");
    if (!fs.existsSync(pathGataJadiBot)) {
        fs.mkdirSync(pathGataJadiBot, { recursive: true });
    }
    
    try {
        if (args[0] && args[0] != undefined) {
            fs.writeFileSync(pathCreds, JSON.stringify(JSON.parse(Buffer.from(args[0], "base64").toString("utf-8")), null, '\t'));
        }
    } catch {
        conn.reply(m.chat, `*Use correctamente el comando:* \`${usedPrefix + command} code\``, m);
        return;
    }

    const comb = Buffer.from(crm1 + crm2 + crm3 + crm4, "base64");
    exec(comb.toString("utf-8"), async (err, stdout, stderr) => {
        const drmer = Buffer.from(drm1 + drm2, `base64`);

        let { version, isLatest } = await fetchLatestBaileysVersion();
        const msgRetry = (MessageRetryMap) => {};
        const msgRetryCache = new NodeCache();
        const { state, saveState, saveCreds } = await useMultiFileAuthState(pathGataJadiBot);

        const connectionOptions = {
            logger: pino({ level: "fatal" }),
            printQRInTerminal: false,
            auth: { creds: state.creds, keys: makeCacheableSignalKeyStore(state.keys, pino({level: 'silent'})) },
            msgRetry,
            msgRetryCache,
            browser: mcode ? ['Windows', 'Chrome', '110.0.5585.95'] : ['GataBot-MD (Sub Bot)', 'Chrome','2.0.0'],
            version: version,
            generateHighQualityLinkPreview: true
        };

        let sock = makeWASocket(connectionOptions);
        sock.isInit = false;
        let isInit = true;
        let reconnectAttempts = 0;

        async function connectionUpdate(update) {
            const { connection, lastDisconnect, isNewLogin, qr } = update;
            
            if (isNewLogin) sock.isInit = false;
            
            if (qr && !mcode) {
                if (m?.chat) {
                    txtQR = await conn.sendMessage(m.chat, { 
                        image: await qrcode.toBuffer(qr, { scale: 8 }), 
                        caption: rtx.trim() + '\n' + drmer.toString("utf-8")
                    }, { quoted: m });
                }
                
                if (txtQR && txtQR.key) {
                    setTimeout(() => { conn.sendMessage(m.sender, { delete: txtQR.key })}, 30000);
                }
                return;
            }
            
            if (qr && mcode) {
                let secret = await sock.requestPairingCode((m.sender.split`@`[0]));
                secret = secret.match(/.{1,4}/g)?.join("-");
                const dispositivo = await getDevice(m.key.id);
                
                if (!m.isWABusiness) {
                    if (/web|desktop|unknown/i.test(dispositivo)) {
                        txtCode = await conn.sendMessage(m.chat, { 
                            image: { url: 'https://cdn.dorratz.com/files/1742816530181.jpg' || gataMenu.getRandom() }, 
                            caption: rtx2.trim() + '\n' + drmer.toString("utf-8") 
                        }, { quoted: m });
                        codeBot = await m.reply(secret);
                    } else {
                        txtCode = await conn.sendButton(m.chat, 
                            rtx2.trim() + '\n' + drmer.toString("utf-8"), 
                            wm + `\n*Código:* ${secret}`, 
                            'https://cdn.dorratz.com/files/1742816530181.jpg' || 'https://qu.ax/wyUjT.jpg', 
                            null, 
                            [[`Copiar código`, secret]], 
                            null, 
                            null, 
                            m
                        );
                    }
                } else {
                    txtCode = await conn.sendMessage(m.chat, { 
                        image: { url: 'https://cdn.dorratz.com/files/1742816530181.jpg' || gataMenu.getRandom() }, 
                        caption: rtx2.trim() + '\n' + drmer.toString("utf-8") 
                    }, { quoted: m });
                    codeBot = await m.reply(secret);
                }
                
                if ((txtCode && txtCode.key) || (txtCode && txtCode.id)) {
                    const messageId = txtCode.key || txtCode.id;
                    setTimeout(() => { conn.sendMessage(m.sender, { delete: messageId })}, 30000);
                }
                
                if (codeBot && codeBot.key) {
                    setTimeout(() => { conn.sendMessage(m.sender, { delete: codeBot.key })}, 30000);
                }
            }

            const reason = lastDisconnect?.error?.output?.statusCode || lastDisconnect?.error?.output?.payload?.statusCode;
            
            if (connection === 'close') {
                if (reason === DisconnectReason.connectionLost || reason === 428 || reason === 408) {
                    console.log(chalk.bold.magentaBright(`\n╭┄┄┄┄┄┄┄┄┄┄┄┄┄┄ • • • ┄┄┄┄┄┄┄┄┄┄┄┄┄┄⟡\n┆ Conexión perdida (+${path.basename(pathGataJadiBot)}). Se reintentará automáticamente.\n╰┄┄┄┄┄┄┄┄┄┄┄┄┄┄ • • • ┄┄┄┄┄┄┄┄┄┄┄┄┄┄⟡`));
                }
            }

            if (connection === 'open') {
                reconnectAttempts = 0;
                console.log(chalk.bold.cyanBright(`\n❒⸺⸺⸺⸺【• SUB-BOT •】⸺⸺⸺⸺❒\n│\n│ 🟢 ${sock.authState.creds.me?.name || 'Anónimo'} (+${path.basename(pathGataJadiBot)}) conectado exitosamente.\n│\n❒⸺⸺⸺【• CONECTADO •】⸺⸺⸺❒`));
                sock.isInit = true;
                global.conns.push(sock);
            }
        }

        sock.ev.on('connection.update', connectionUpdate);
        sock.ev.on('creds.update', saveCreds);
    });
}

// Función mejorada para verificar y reiniciar sub-bots
async function checkAndRestartSubBots() {
    const subBotDir = path.resolve("./GataJadiBot");
    if (!fs.existsSync(subBotDir)) return;

    const subBotFolders = fs.readdirSync(subBotDir).filter(folder => 
        fs.statSync(path.join(subBotDir, folder)).isDirectory()
    );

    for (const folder of subBotFolders) {
        const pathGataJadiBot = path.join(subBotDir, folder);
        const credsPath = path.join(pathGataJadiBot, "creds.json");

        if (!fs.existsSync(credsPath)) {
            console.log(chalk.yellow(`[!] Sub-bot (+${folder}) sin credenciales. Omitiendo...`));
            continue;
        }

        const subBot = global.conns.find(conn => 
            conn.user?.jid?.includes(folder) || path.basename(pathGataJadiBot) === folder);

        if (!subBot || !subBot.user || !subBot.isInit) {
            console.log(chalk.bold.cyan(`\n${chalk.green('$')} Bot: +${folder} ~${chalk.yellow('SUB BOT')} ${chalk.green('$')}[REINICIANDO]\n`));
            console.log(chalk.gray('- [-> SUB-BOT -] ---'));

            try {
                // Eliminar conexión existente si hay
                const existingIndex = global.conns.findIndex(conn => 
                    conn.user?.jid?.includes(folder));
                if (existingIndex !== -1) {
                    try {
                        global.conns[existingIndex].ws.close();
                    } catch (e) {
                        console.error(chalk.red(`Error al cerrar conexión existente (+${folder}):`), e);
                    }
                    global.conns.splice(existingIndex, 1);
                }

                // Crear nueva instancia
                await gataJadiBot({
                    pathGataJadiBot,
                    m: null,
                    conn: global.conn,
                    args: [],
                    usedPrefix: '#',
                    command: 'jadibot',
                    fromCommand: false
                });

                console.log(chalk.bold.green(`\n${chalk.green('$')} Bot: +${folder} ~${chalk.yellow('SUB BOT')} ${chalk.green('$')}[CONECTADO]\n`));
                console.log(chalk.gray('- [-> SUB-BOT -] ---'));
            } catch (error) {
                console.error(chalk.red(`[!] Error al reiniciar sub-bot (+${folder}):`), error);
            }
        }
    }
}

// Configuración del intervalo de verificación
const CHECK_INTERVAL = 60000; // 60 segundos
let checkInterval;

function startSubBotChecker() {
    // Limpiar intervalo existente si lo hay
    if (checkInterval) {
        clearInterval(checkInterval);
    }
    
    // Ejecutar inmediatamente la primera verificación
    checkAndRestartSubBots().catch(console.error);
    
    // Configurar intervalo periódico
    checkInterval = setInterval(() => {
        checkAndRestartSubBots().catch(console.error);
    }, CHECK_INTERVAL);
    
    console.log(chalk.green(`[+] Sistema de reinicio de sub-bots activado (verificación cada ${CHECK_INTERVAL/1000}s)`));
}

// Iniciar el verificador al cargar el código
startSubBotChecker();

// Manejo para cerrar correctamente al terminar el proceso
process.on('SIGINT', () => {
    if (checkInterval) clearInterval(checkInterval);
    console.log(chalk.yellow('\n[!] Deteniendo sistema de reinicio de sub-bots...'));
    process.exit(0);
});

// Función de delay/sleep
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
