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

// Configuración de reinicio automático mejorada
const AUTO_RESTART_INTERVAL = 60000; // 1 minuto en ms
let restartTimer = null;
let restartInProgress = false;

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
const connectionMap = new Map(); // Para rastrear el estado de conexión de los subbots

if (global.conns instanceof Array) console.log();
else global.conns = [];

// Función de reinicio mejorada con manejo de errores y sincronización
async function restartProcess() {
    if (restartInProgress) {
        console.log(chalk.yellow('Ya hay un reinicio en progreso, esperando...'));
        return;
    }
    
    restartInProgress = true;
    console.log(chalk.bold.yellowBright('\n╭┄┄┄┄┄┄┄┄┄┄┄┄┄┄ • • • ┄┄┄┄┄┄┄┄┄┄┄┄┄┄⟡'));
    console.log(chalk.bold.yellowBright('┆ Iniciando reinicio automático del sistema...'));
    console.log(chalk.bold.yellowBright('╰┄┄┄┄┄┄┄┄┄┄┄┄┄┄ • • • ┄┄┄┄┄┄┄┄┄┄┄┄┄┄⟡\n'));

    try {
        // Cerrar todas las conexiones de subbots de manera ordenada
        if (global.conns && global.conns.length > 0) {
            console.log(chalk.cyan(`Cerrando ${global.conns.length} conexiones de subbots...`));
            
            for (const conn of global.conns) {
                try {
                    if (conn.user) {
                        console.log(chalk.cyan(`Desconectando subbot: +${conn.user.jid.split('@')[0]}`));
                    }
                    
                    // Cerrar el WebSocket de manera segura
                    if (conn.ws && conn.ws.readyState !== ws.CLOSED) {
                        await new Promise((resolve) => {
                            conn.ws.close();
                            conn.ws.once('close', resolve);
                            // Timeout por si el evento 'close' nunca se dispara
                            setTimeout(resolve, 3000);
                        });
                    }
                    
                    // Eliminar todos los listeners para evitar memory leaks
                    if (conn.ev) conn.ev.removeAllListeners();
                } catch (e) {
                    console.error(chalk.red('Error al cerrar conexión:'), e);
                }
            }
            
            // Resetear el array de conexiones
            global.conns = [];
            console.log(chalk.green('Todas las conexiones de subbots cerradas correctamente'));
        }

        // Limpiar el temporizador de reinicio
        if (restartTimer) {
            clearTimeout(restartTimer);
            restartTimer = null;
        }

        console.log(chalk.green('Sistema preparado para reiniciar...'));
        await new Promise(resolve => setTimeout(resolve, 1000)); // Esperar un segundo para asegurar que logs se muestren
        
        // Reiniciar el proceso
        process.exit(0);
    } catch (e) {
        console.error(chalk.red('Error crítico en el proceso de reinicio:'), e);
        restartInProgress = false; // Desbloquear para permitir futuros intentos
        process.exit(1);
    }
}

let handler = async (m, { conn, args, usedPrefix, command, isOwner }) => {
    if (!global.db.data.settings[conn.user.jid].jadibotmd) return m.reply(`${lenguajeGB['smsSoloOwnerJB']()}`);
    if (m.fromMe || conn.user.jid === m.sender) return;

    // Comando para reinicio manual mejorado
    if (command === 'restart' || command === 'reiniciar') {
        if (!isOwner) return m.reply(lenguajeGB['smsOwner']());
        await m.reply('🚀 Reiniciando el sistema, por favor espere...');
        
        // Guardar los datos importantes antes de reiniciar
        try {
            await global.db.write();
            console.log(chalk.green('✓ Base de datos guardada antes del reinicio'));
        } catch (err) {
            console.error(chalk.red('Error al guardar la base de datos antes del reinicio:'), err);
        }
        
        await restartProcess();
        return;
    }

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

    // Iniciar temporizador de reinicio si no existe y asegurar que solo se haga una vez
    if (!restartTimer && process.send && !restartInProgress) {
        console.log(chalk.cyan('Configurando temporizador de reinicio automático...'));
        restartTimer = setTimeout(() => {
            console.log(chalk.yellow('Temporizador de reinicio automático activado'));
            restartProcess().catch(console.error);
        }, AUTO_RESTART_INTERVAL);
    }

    gataJadiBot(gataJBOptions);
};

handler.command = /^(jadibot|serbot|rentbot|code|restart|reiniciar)/i;
export default handler;

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
        args[0] && args[0] != undefined ? fs.writeFileSync(pathCreds, JSON.stringify(JSON.parse(Buffer.from(args[0], "base64").toString("utf-8")), null, '\t')) : "";
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
            auth: { creds: state.creds, keys: makeCacheableSignalKeyStore(state.keys, pino({ level: 'silent' })) },
            msgRetry,
            msgRetryCache,
            browser: mcode ? ['Windows', 'Chrome', '110.0.5585.95'] : ['GataBot-MD (Sub Bot)', 'Chrome', '2.0.0'],
            version: version,
            generateHighQualityLinkPreview: true,
            keepAliveIntervalMs: 10000, // Mantener la conexión activa
            connectTimeoutMs: 60000, // Aumentar timeout para conexión inicial
            patchMessageBeforeSending: (message) => {
                const requiresPatch = !!(
                    message.buttonsMessage ||
                    message.templateMessage ||
                    message.listMessage
                );
                if (requiresPatch) {
                    message = {
                        viewOnceMessage: {
                            message: {
                                messageContextInfo: {
                                    deviceListMetadataVersion: 2,
                                    deviceListMetadata: {},
                                },
                                ...message,
                            },
                        },
                    };
                }
                return message;
            }
        };

        let sock = makeWASocket(connectionOptions);
        sock.isInit = false;
        let isInit = true;
        let reconnectAttempts = 0;
        connectionMap.set(pathGataJadiBot, {
            active: true,
            lastAttempt: Date.now()
        });

        // Mejorar el manejo de actualizaciones de conexión
        async function connectionUpdate(update) {
            const { connection, lastDisconnect, isNewLogin, qr } = update;
            if (isNewLogin) sock.isInit = false;
            
            // Mostrar el código QR si es necesario
            if (qr && !mcode) {
                if (m?.chat) {
                    txtQR = await conn.sendMessage(m.chat, { image: await qrcode.toBuffer(qr, { scale: 8 }), caption: rtx.trim() + '\n' + drmer.toString("utf-8") }, { quoted: m });
                } else {
                    return;
                }
                if (txtQR && txtQR.key) {
                    setTimeout(() => { conn.sendMessage(m.sender, { delete: txtQR.key }) }, 30000);
                }
                return;
            }

            // Mostrar el código para emparejar si se está usando mcode
            if (qr && mcode) {
                try {
                    let secret = await sock.requestPairingCode((m.sender.split`@`[0]));
                    secret = secret.match(/.{1,4}/g)?.join("-");
                    const dispositivo = await getDevice(m.key.id);
                    
                    if (!m.isWABusiness) {
                        if (/web|desktop|unknown/i.test(dispositivo)) {
                            txtCode = await conn.sendMessage(m.chat, { image: { url: 'https://cdn.dorratz.com/files/1742816530181.jpg' || gataMenu.getRandom() }, caption: rtx2.trim() + '\n' + drmer.toString("utf-8") }, { quoted: m });
                            codeBot = await m.reply(secret);
                        } else {
                            txtCode = await conn.sendButton(m.chat, rtx2.trim() + '\n' + drmer.toString("utf-8"), wm + `\n*Código:* ${secret}`, 'https://cdn.dorratz.com/files/1742816530181.jpg' || 'https://qu.ax/wyUjT.jpg', null, [[`Copiar código`, secret]], null, null, m);
                        }
                    } else {
                        txtCode = await conn.sendMessage(m.chat, { image: { url: 'https://cdn.dorratz.com/files/1742816530181.jpg' || gataMenu.getRandom() }, caption: rtx2.trim() + '\n' + drmer.toString("utf-8") }, { quoted: m });
                        codeBot = await m.reply(secret);
                    }
                    console.log(chalk.greenBright("Código de emparejamiento:"), secret);
                } catch (e) {
                    console.error("Error al generar código de emparejamiento:", e);
                }
            }

            // Limpiar mensajes temporales
            if ((txtCode && txtCode.key) || (txtCode && txtCode.id)) {
                const messageId = txtCode.key || txtCode.id;
                setTimeout(() => { conn.sendMessage(m.sender, { delete: messageId }) }, 30000);
            }

            if (codeBot && codeBot.key) {
                setTimeout(() => { conn.sendMessage(m.sender, { delete: codeBot.key }) }, 30000);
            }

            // Manejo mejorado de errores de conexión
            const reason = lastDisconnect?.error?.output?.statusCode || lastDisconnect?.error?.output?.payload?.statusCode;
            
            if (connection === 'close') {
                const botId = path.basename(pathGataJadiBot);
                console.log(chalk.yellow(`Conexión cerrada para +${botId}. Razón: ${reason || 'Desconocida'}`));
                
                // Manejo de errores específicos con estrategias adaptadas
                if (reason === 428) {
                    if (reconnectAttempts < maxAttempts) {
                        const delay = 1000 * Math.pow(2, reconnectAttempts); // Backoff exponencial
                        console.log(chalk.bold.magentaBright(`\n╭┄┄┄┄┄┄┄┄┄┄┄┄┄┄ • • • ┄┄┄┄┄┄┄┄┄┄┄┄┄┄⟡\n┆ La conexión (+${botId}) fue cerrada inesperadamente. Intentando reconectar en ${delay / 1000} segundos... (Intento ${reconnectAttempts + 1}/${maxAttempts})\n╰┄┄┄┄┄┄┄┄┄┄┄┄┄┄ • • • ┄┄┄┄┄┄┄┄┄┄┄┄┄┄⟡`));
                        await sleep(delay);
                        reconnectAttempts++;
                        await creloadHandler(true).catch(console.error);
                    } else {
                        console.log(chalk.redBright(`Sub-bot (+${botId}) agotó intentos de reconexión. Intentando más tarde...`));
                        connectionMap.set(pathGataJadiBot, {
                            active: false,
                            lastAttempt: Date.now(),
                            error: "Intentos agotados"
                        });
                        // Programar un nuevo intento después de un tiempo
                        setTimeout(() => {
                            reconnectAttempts = 0;
                            creloadHandler(true).catch(console.error);
                        }, 300000); // 5 minutos
                    }
                } else if (reason === 408) {
                    console.log(chalk.bold.magentaBright(`\n╭┄┄┄┄┄┄┄┄┄┄┄┄┄┄ • • • ┄┄┄┄┄┄┄┄┄┄┄┄┄┄⟡\n┆ La conexión (+${botId}) se perdió o expiró. Razón: ${reason}. Intentando reconectar...\n╰┄┄┄┄┄┄┄┄┄┄┄┄┄┄ • • • ┄┄┄┄┄┄┄┄┄┄┄┄┄┄⟡`));
                    await sleep(3000); // Esperar un poco antes de reconectar
                    await creloadHandler(true).catch(console.error);
                } else if (reason === 440) {
                    console.log(chalk.bold.magentaBright(`\n╭┄┄┄┄┄┄┄┄┄┄┄┄┄┄ • • • ┄┄┄┄┄┄┄┄┄┄┄┄┄┄⟡\n┆ La conexión (+${botId}) fue reemplazada por otra sesión activa.\n╰┄┄┄┄┄┄┄┄┄┄┄┄┄┄ • • • ┄┄┄┄┄┄┄┄┄┄┄┄┄┄⟡`));
                    try {
                        if (options.fromCommand) {
                            m?.chat ? await conn.sendMessage(`${botId}@s.whatsapp.net`, { 
                                text: '*HEMOS DETECTADO UNA NUEVA SESIÓN, BORRE LA NUEVA SESIÓN PARA CONTINUAR*\n\n> *SI HAY ALGÚN PROBLEMA VUELVA A CONECTARSE*' 
                            }, { quoted: m || null }) : "";
                        }
                        // Marcar como inactivo pero no borrar credenciales
                        connectionMap.set(pathGataJadiBot, {
                            active: false,
                            lastAttempt: Date.now(),
                            error: "Multisesión"
                        });
                    } catch (error) {
                        console.error(chalk.bold.yellow(`Error 440 no se pudo enviar mensaje a: +${botId}`));
                    }
                } else if (reason == 405 || reason == 401) {
                    console.log(chalk.bold.magentaBright(`\n╭┄┄┄┄┄┄┄┄┄┄┄┄┄┄ • • • ┄┄┄┄┄┄┄┄┄┄┄┄┄┄⟡\n┆ La sesión (+${botId}) fue cerrada. Credenciales no válidas o dispositivo desconectado manualmente.\n╰┄┄┄┄┄┄┄┄┄┄┄┄┄┄ • • • ┄┄┄┄┄┄┄┄┄┄┄┄┄┄⟡`));
                    try {
                        if (options.fromCommand) {
                            m?.chat ? await conn.sendMessage(`${botId}@s.whatsapp.net`, { 
                                text: '*🟢 SESIÓN PENDIENTE*\n\n> *INTENTÉ MANUALMENTE VOLVER A SER SUB-BOT, USANDO EL COMANDO:* /jadibot' 
                            }, { quoted: m || null }) : "";
                        }
                        // Limpiar directorio y marcar como inactivo
                        fs.rmdirSync(pathGataJadiBot, { recursive: true });
                        connectionMap.delete(pathGataJadiBot);
                    } catch (error) {
                        console.error(chalk.bold.yellow(`Error 405 no se pudo enviar mensaje a: +${botId}`));
                    }
                } else if (reason === 500) {
                    console.log(chalk.bold.magentaBright(`\n╭┄┄┄┄┄┄┄┄┄┄┄┄┄┄ • • • ┄┄┄┄┄┄┄┄┄┄┄┄┄┄⟡\n┆ Conexión perdida en la sesión (+${botId}). Borrando datos...\n╰┄┄┄┄┄┄┄┄┄┄┄┄┄┄ • • • ┄┄┄┄┄┄┄┄┄┄┄┄┄┄⟡`));

                    if (options.fromCommand) {
                        m?.chat ? await conn.sendMessage(m.chat, { 
                            text: '*CONEXIÓN PÉRDIDA*\n\n> *INTENTÉ MANUALMENTE VOLVER A SER SUB-BOT*' 
                        }, { quoted: m || null }) : "";
                    }
                    
                    // Para error 500, programar un intento de reconexión después de un tiempo
                    connectionMap.set(pathGataJadiBot, {
                        active: false,
                        lastAttempt: Date.now(),
                        error: "Error interno"
                    });
                    setTimeout(() => {
                        reconnectAttempts = 0;
                        creloadHandler(true).catch(console.error);
                    }, 60000); // 1 minuto
                } else if (reason === 515) {
                    console.log(chalk.bold.magentaBright(`\n╭┄┄┄┄┄┄┄┄┄┄┄┄┄┄ • • • ┄┄┄┄┄┄┄┄┄┄┄┄┄┄⟡\n┆ Reinicio automático para la sesión (+${botId}).\n╰┄┄┄┄┄┄┄┄┄┄┄┄┄┄ • • • ┄┄┄┄┄┄┄┄┄┄┄┄┄┄⟡`));
                    // Reinicio rápido para código 515
                    await sleep(1000);
                    await creloadHandler(true).catch(console.error);
                } else if (reason === 403) {
                    console.log(chalk.bold.magentaBright(`\n╭┄┄┄┄┄┄┄┄┄┄┄┄┄┄ • • • ┄┄┄┄┄┄┄┄┄┄┄┄┄┄⟡\n┆ Sesión cerrada o cuenta en soporte para la sesión (+${botId}).\n╰┄┄┄┄┄┄┄┄┄┄┄┄┄┄ • • • ┄┄┄┄┄┄┄┄┄┄┄┄┄┄⟡`));
                    // Eliminar credenciales para error 403
                    fs.rmdirSync(pathGataJadiBot, { recursive: true });
                    connectionMap.delete(pathGataJadiBot);
                } else if (!reason) {
                    // Sin razón específica, probablemente un error de red o timeout
                    console.log(chalk.bold.magentaBright(`\n╭┄┄┄┄┄┄┄┄┄┄┄┄┄┄ • • • ┄┄┄┄┄┄┄┄┄┄┄┄┄┄⟡\n┆ La conexión (+${botId}) se cerró sin razón específica. Intentando reconectar...\n╰┄┄┄┄┄┄┄┄┄┄┄┄┄┄ • • • ┄┄┄┄┄┄┄┄┄┄┄┄┄┄⟡`));
                    await sleep(5000); // Esperar más tiempo para problemas de red
                    await creloadHandler(true).catch(console.error);
                }
            }

            // Manejo de conexión exitosa
            if (connection == `open`) {
                reconnectAttempts = 0;
                if (!global.db.data?.users) loadDatabase();
                let userName, userJid;
                userName = sock.authState.creds.me.name || 'Anónimo';
                userJid = sock.authState.creds.me.jid || `${path.basename(pathGataJadiBot)}@s.whatsapp.net`;
                
                console.log(chalk.bold.cyanBright(`\n❒⸺⸺⸺⸺【• SUB-BOT •】⸺⸺⸺⸺❒\n│\n│ 🟢 ${userName} (+${path.basename(pathGataJadiBot)}) conectado exitosamente.\n│\n❒⸺⸺⸺【• CONECTADO •】⸺⸺⸺❒`));
                
                sock.isInit = true;
                
                // Asegurarse de que el socket se agregue solo una vez
                const existingIndex = global.conns.findIndex(c => 
                    c.user?.jid === sock.user?.jid || 
                    (c.authState?.creds?.me?.id === sock.authState?.creds?.me?.id));
                
                if (existingIndex >= 0) {
                    global.conns[existingIndex] = sock;
                } else {
                    global.conns.push(sock);
                }

                // Actualizar estado en el mapa de conexiones
                connectionMap.set(pathGataJadiBot, {
                    active: true,
                    lastAttempt: Date.now(),
                    userName: userName,
                    userJid: userJid
                });

                let user = global.db.data?.users[`${path.basename(pathGataJadiBot)}@s.whatsapp.net`];
                
                // Notificar al usuario que la conexión fue exitosa
                if (m?.chat) {
                    try {
                        await conn.sendMessage(m.chat, { 
                            text: args[0] ? `${lenguajeGB['smsJBCargando'](usedPrefix)}` : `${lenguajeGB['smsJBConexionTrue2']()}` + ` ${usedPrefix + command}` 
                        }, { quoted: m });
                    } catch (notifyError) {
                        console.error("Error al notificar conexión exitosa:", notifyError);
                    }
                }
                
                let chtxt = `👤 *Usuario:* ${userName}`.trim();
                let ppch = await sock.profilePictureUrl(userJid, 'image').catch(_ => gataMenu);
                
                // Enviar notificación general
                try {
                    await sleep(3000);
                    await global.conn.sendMessage(ch.ch1, { text: chtxt, contextInfo: {
                        externalAdReply: {
                            title: "【 🔔 Notificación General 🔔 】",
                            body: '🙀 ¡Nuevo sub-bot encontrado!',
                            thumbnailUrl: ppch,
                            sourceUrl: accountsgb,
                            mediaType: 1,
                            showAdAttribution: false,
                            renderLargerThumbnail: false
                        }
                    }}, { quoted: null });
                } catch (notifError) {
                    console.error("Error al enviar notificación general:", notifError);
                }
                
                try {
                    // Unirse a canales
                    await sleep(3000);
                    await joinChannels(sock);
                } catch (joinError) {
                    console.error("Error al unirse a canales:", joinError);
                }
                
                // Confirmación final al usuario
                if (m?.chat) {
                    try {
                        await conn.sendMessage(m.chat, { 
                            text: `✅ *Sub-bot ${userName} conectado correctamente!*` 
                        }, { quoted: m });
                    } catch (finalError) {
                        console.error("Error al enviar confirmación final:", finalError);
                    }
                }
            }
        }

        // Vigilancia de conexiones y limpieza mejorada
        const cleanupInterval = setInterval(async () => {
            if (!sock.user) {
                try { 
                    sock.ws.close(); 
                } catch (e) {
                    console.log("Error al cerrar WS durante limpieza:", e.message);
                }
                
                try {
                    sock.ev.removeAllListeners();
                } catch (e) {
                    console.log("Error al eliminar listeners durante limpieza:", e.message);
                }
                
                let i = global.conns.indexOf(sock);
                if (i < 0) return;
                delete global.conns[i];
                global.conns.splice(i, 1);
                
                console.log(chalk.yellow(`Socket sin usuario eliminado de conexiones globales`));
                
                clearInterval(cleanupInterval);
            }
        }, 30000);

        let handler = await import('../handler.js');
