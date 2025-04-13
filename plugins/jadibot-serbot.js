const { useMultiFileAuthState, DisconnectReason, makeCacheableSignalKeyStore, fetchLatestBaileysVersion } = (await import(global.baileys));
import qrcode from "qrcode";
import NodeCache from "node-cache";
import fs from "fs";
import path from "path";
import pino from 'pino';
import chalk from 'chalk';
import * as ws from 'ws';
import { getDevice } from '@whiskeysockets/baileys';
const { exec } = await import('child_process');
import { makeWASocket } from '../lib/simple.js';
import { fileURLToPath } from 'url';

// Configuración inicial
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const retryMap = new Map();
const maxAttempts = 5;
if (!global.conns || !(global.conns instanceof Array)) global.conns = [];

// Comando handler
let handler = async (m, { conn, args, usedPrefix, command, isOwner }) => {
    if (!global.db.data.settings[conn.user.jid].jadibotmd) return m.reply(`${lenguajeGB['smsSoloOwnerJB']()}`);
    if (m.fromMe || conn.user.jid === m.sender) return;
    
    let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender;
    let id = `${who.split`@`[0]}`;
    let pathGataJadiBot = path.join("./GataJadiBot/", id);
    
    if (!fs.existsSync(pathGataJadiBot)) {
        fs.mkdirSync(pathGataJadiBot, { recursive: true });
    }
    
    await gataJadiBot({
        pathGataJadiBot,
        m,
        conn,
        args,
        usedPrefix,
        command,
        fromCommand: true
    });
};

handler.command = /^(jadibot|serbot|rentbot|code)/i;
export default handler;

// Función principal para manejar los bots
export async function gataJadiBot(options) {
    let { pathGataJadiBot, m, conn, args, usedPrefix, command } = options;
    
    // Manejo del comando code
    if (command === 'code') {
        command = 'jadibot';
        args.unshift('code');
    }

    const mcode = args[0] && /(--code|code)/.test(args[0].trim()) ? true : 
                 args[1] && /(--code|code)/.test(args[1].trim()) ? true : false;
    
    let txtCode, codeBot, txtQR;
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

    let { version } = await fetchLatestBaileysVersion();
    const { state, saveCreds } = await useMultiFileAuthState(pathGataJadiBot);

    const connectionOptions = {
        logger: pino({ level: "fatal" }),
        printQRInTerminal: false,
        auth: { 
            creds: state.creds, 
            keys: makeCacheableSignalKeyStore(state.keys, pino({level: 'silent'})) 
        },
        browser: mcode ? ['Windows', 'Chrome', '110.0.5585.95'] : ['GataBot-MD (Sub Bot)', 'Chrome', '2.0.0'],
        version: version,
        generateHighQualityLinkPreview: true
    };

    let sock = makeWASocket(connectionOptions);
    sock.isInit = false;
    let isInit = true;
    let reconnectAttempts = 0;

    // Función para configurar los handlers
    const configureHandlers = async () => {
        const handlerModule = await import('../handler.js');
        
        sock.welcome = lenguajeGB['smsWelcome']();
        sock.bye = lenguajeGB['smsBye']();
        sock.spromote = lenguajeGB['smsSpromote']();
        sock.sdemote = lenguajeGB['smsSdemote']();
        sock.sDesc = lenguajeGB['smsSdesc']();
        sock.sSubject = lenguajeGB['smsSsubject']();
        sock.sIcon = lenguajeGB['smsSicon']();
        sock.sRevoke = lenguajeGB['smsSrevoke']();

        sock.handler = handlerModule.handler.bind(sock);
        sock.participantsUpdate = handlerModule.participantsUpdate.bind(sock);
        sock.groupsUpdate = handlerModule.groupsUpdate.bind(sock);
        sock.onDelete = handlerModule.deleteUpdate.bind(sock);
        sock.onCall = handlerModule.callUpdate.bind(sock);
        
        sock.ev.on('messages.upsert', sock.handler);
        sock.ev.on('group-participants.update', sock.participantsUpdate);
        sock.ev.on('groups.update', sock.groupsUpdate);
        sock.ev.on('message.delete', sock.onDelete);
        sock.ev.on('call', sock.onCall);
    };

    // Configurar conexión inicial
    await configureHandlers();

    // Manejo de actualización de conexión
    sock.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect, isNewLogin, qr } = update;
        
        if (isNewLogin) sock.isInit = false;
        
        // Manejo de código QR
        if (qr && !mcode) {
            if (m?.chat) {
                txtQR = await conn.sendMessage(m.chat, { 
                    image: await qrcode.toBuffer(qr, { scale: 8 }), 
                    caption: `${lenguajeGB['smsIniJadi']()}\n\nEste código QR expirará en 30 segundos`
                }, { quoted: m });
                
                if (txtQR && txtQR.key) {
                    setTimeout(() => { 
                        conn.sendMessage(m.sender, { delete: txtQR.key }).catch(() => {});
                    }, 30000);
                }
            }
            return;
        }
        
        // Manejo de código de pairing
        if (qr && mcode) {
            try {
                const secret = await sock.requestPairingCode(m.sender.split`@`[0]);
                const formattedCode = secret.match(/.{1,4}/g)?.join("-") || secret;
                
                // Enviar código al chat (CORRECCIÓN DE LA PRIMERA FALLA)
                codeBot = await conn.sendMessage(m.chat, {
                    text: `*CÓDIGO DE CONEXIÓN:*\n\n${formattedCode}\n\nEste código expirará en 30 segundos`,
                    mentions: [m.sender]
                }, { quoted: m });
                
                console.log(`Código de pairing generado: ${formattedCode}`);
                
                if (codeBot && codeBot.key) {
                    setTimeout(() => {
                        conn.sendMessage(m.sender, { delete: codeBot.key }).catch(() => {});
                    }, 30000);
                }
            } catch (error) {
                console.error('Error al generar código de pairing:', error);
                conn.sendMessage(m.chat, { text: 'Ocurrió un error al generar el código de conexión' }, { quoted: m });
            }
            return;
        }

        // Manejo de reconexiones
        if (connection === 'close') {
            const reason = lastDisconnect?.error?.output?.statusCode || lastDisconnect?.error?.output?.payload?.statusCode;
            
            if (reason === DisconnectReason.connectionClosed || reason === DisconnectReason.connectionLost) {
                if (reconnectAttempts < maxAttempts) {
                    const delay = 1000 * Math.pow(2, reconnectAttempts);
                    console.log(chalk.bold.magentaBright(`Reconectando en ${delay / 1000} segundos... (Intento ${reconnectAttempts + 1}/${maxAttempts})`));
                    
                    await new Promise(resolve => setTimeout(resolve, delay));
                    reconnectAttempts++;
                    
                    try {
                        await configureHandlers();
                    } catch (e) {
                        console.error('Error al reconectar:', e);
                    }
                } else {
                    console.log(chalk.redBright('Se agotaron los intentos de reconexión'));
                }
            }
        }
        
        // Conexión exitosa
        if (connection === 'open') {
            reconnectAttempts = 0;
            sock.isInit = true;
            global.conns.push(sock);
            
            const userName = sock.authState.creds.me?.name || 'Anónimo';
            console.log(chalk.bold.cyanBright(`Sub-bot ${userName} conectado exitosamente`));
            
            if (m?.chat) {
                await conn.sendMessage(m.chat, { 
                    text: args[0] ? `${lenguajeGB['smsJBCargando'](usedPrefix)}` : `${lenguajeGB['smsJBConexionTrue2']()} ${usedPrefix + command}`
                }, { quoted: m });
            }
        }
    });

    // Verificación periódica de conexión
    setInterval(() => {
        if (!sock.user) {
            try {
                sock.ws.close();
                sock.ev.removeAllListeners();
                
                const index = global.conns.indexOf(sock);
                if (index >= 0) {
                    global.conns.splice(index, 1);
                }
            } catch (e) {
                console.error('Error al limpiar conexión:', e);
            }
        }
    }, 60000);
}

// Función para verificar y reiniciar subbots (CORRECCIÓN DE LA SEGUNDA FALLA)
async function checkAndRestartSubBots() {
    const subBotDir = path.resolve("./GataJadiBot");
    if (!fs.existsSync(subBotDir)) return;
    
    const subBotFolders = fs.readdirSync(subBotDir).filter(folder => 
        fs.statSync(path.join(subBotDir, folder)).isDirectory());
    
    for (const folder of subBotFolders) {
        const pathGataJadiBot = path.join(subBotDir, folder);
        const credsPath = path.join(pathGataJadiBot, "creds.json");
        
        if (!fs.existsSync(credsPath)) continue;
        
        const subBot = global.conns.find(conn => 
            conn.user?.jid?.includes(folder) || path.basename(pathGataJadiBot) === folder);
        
        if (subBot && subBot.user) {
            // Reiniciar conexión existente
            try {
                console.log(chalk.bold.blueBright(`Reiniciando sub-bot ${folder}...`));
                
                // Cerrar conexión anterior
                try {
                    if (subBot.ws) subBot.ws.close();
                    subBot.ev.removeAllListeners();
                    
                    const index = global.conns.indexOf(subBot);
                    if (index >= 0) global.conns.splice(index, 1);
                } catch (e) {
                    console.error('Error al cerrar conexión anterior:', e);
                }
                
                // Crear nueva conexión
                const { state } = await useMultiFileAuthState(pathGataJadiBot);
                const { version } = await fetchLatestBaileysVersion();
                
                const newSock = makeWASocket({
                    logger: pino({ level: "fatal" }),
                    auth: { 
                        creds: state.creds, 
                        keys: makeCacheableSignalKeyStore(state.keys, pino({level: 'silent'})) 
                    },
                    version: version
                });
                
                // Configurar handlers
                const handlerModule = await import('../handler.js');
                newSock.handler = handlerModule.handler.bind(newSock);
                newSock.ev.on('messages.upsert', newSock.handler);
                
                global.conns.push(newSock);
                console.log(chalk.bold.green(`Sub-bot ${folder} reiniciado correctamente`));
                
            } catch (error) {
                console.error(chalk.red(`Error al reiniciar sub-bot ${folder}:`), error);
            }
        } else {
            // Conectar subbots desconectados
            try {
                console.log(chalk.bold.yellow(`Intentando conectar sub-bot ${folder}...`));
                await gataJadiBot({
                    pathGataJadiBot,
                    m: null,
                    conn: global.conn,
                    args: [],
                    usedPrefix: '#',
                    command: 'jadibot',
                    fromCommand: false
                });
            } catch (e) {
                console.error(chalk.red(`Error al conectar sub-bot ${folder}:`), e);
            }
        }
    }
}

// Verificar y reiniciar subbots cada 30 segundos
setInterval(checkAndRestartSubBots, 60000);

// Función de utilidad
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
