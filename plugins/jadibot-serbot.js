/*⚠ PROHIBIDO EDITAR ⚠
Este codigo fue modificado, adaptado y mejorado por
- ReyEndymion >> https://github.com/ReyEndymion
El codigo de este archivo esta inspirado en el codigo original de:
- Aiden_NotLogic >> https://github.com/ferhacks
*El archivo original del MysticBot-MD fue liberado en mayo del 2024 aceptando su liberacion*
El codigo de este archivo fue parchado en su momento por:
- BrunoSobrino >> https://github.com/BrunoSobrino
Contenido adaptado para GataBot-MD por:
- GataNina-Li >> https://github.com/GataNina-Li
- elrebelde21 >> https://github.com/elrebelde21
*/

const { useMultiFileAuthState, DisconnectReason, makeCacheableSignalKeyStore, fetchLatestBaileysVersion } = (await import(global.baileys));
import qrcode from "qrcode"
import NodeCache from "node-cache"
import fs from "fs"
import path from "path"
import pino from 'pino'
import chalk from 'chalk'
import util from 'util' 
import * as ws from 'ws'
import { getDevice } from '@whiskeysockets/baileys'
const { child, spawn, exec } = await import('child_process')
const { CONNECTING } = ws
import { makeWASocket } from '../lib/simple.js'
import '../plugins/_content.js'
import { fileURLToPath } from 'url'
let crm1 = "Y2QgcGx1Z2lucy"
let crm2 = "A7IG1kNXN1b"
let crm3 = "SBpbmZvLWRvbmFyLmpz"
let crm4 = "IF9hdXRvcmVzcG9uZGVyLmpzIGluZm8tYm90Lmpz"
let drm1 = "CkphZGlib3QsIEhlY2hv"
let drm2 = "IHBvciBAQWlkZW5fTm90TG9naWM"
let rtx = `${lenguajeGB['smsIniJadi']()}`
let rtx2 = `${lenguajeGB['smsIniJadi2']()}`

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const gataJBOptions = {}
const retryMap = new Map(); 
const maxAttempts = 5;
if (global.conns instanceof Array) console.log()
else global.conns = []

// Interceptamos console.error para detectar el mensaje específico
const originalConsoleError = console.error;
console.error = (...args) => {
    const message = args.join(' ').trim();
    
    // Detectamos el mensaje exacto de desconexión
    if (message.includes('Conexión perdida en la sesión') && message.includes('Borrando datos')) {
        const sessionIdMatch = message.match(/\(\+(\d+)\)/);
        if (sessionIdMatch && sessionIdMatch[1]) {
            const sessionId = sessionIdMatch[1];
            console.log(chalk.bold.red(`⚠️ Detectada desconexión en sub-bot ${sessionId}. Intentando reconectar...`));
            
            // Llamamos a la función de reconexión
            reconnectSubBot(sessionId).catch(e => {
                console.error(chalk.bold.yellow(`❌ Error al reconectar ${sessionId}:`), e);
            });
        }
    }
    
    originalConsoleError(...args);
};

async function reconnectSubBot(sessionId) {
    const pathGataJadiBot = path.join("./GataJadiBot/", sessionId);
    
    try {
        // Buscamos el sub-bot en las conexiones activas
        const subBotIndex = global.conns.findIndex(c => c.user?.jid?.includes(sessionId));
        
        // Si existe, lo limpiamos correctamente
        if (subBotIndex > -1) {
            const subBot = global.conns[subBotIndex];
            try {
                if (subBot.ws && subBot.ws.readyState !== ws.CLOSED) {
                    await subBot.ws.close();
                }
            } catch (e) {
                console.error(chalk.yellow(`⚠️ Error al cerrar conexión WS de ${sessionId}:`), e);
            }
            
            subBot.ev.removeAllListeners();
            global.conns.splice(subBotIndex, 1);
        }

        // Esperamos 5 segundos antes de reconectar
        await new Promise(resolve => setTimeout(resolve, 5000));

        // Reconectamos usando tu función gataJadiBot existente
        await gataJadiBot({
            pathGataJadiBot,
            m: null,
            conn: global.conn,
            args: [],
            usedPrefix: '#',
            command: 'jadibot',
            fromCommand: false
        });

        console.log(chalk.bold.green(`✅ Sub-bot ${sessionId} reconectado exitosamente`));
    } catch (error) {
        console.error(chalk.bold.red(`❌ Error crítico al reconectar ${sessionId}:`), error);
        throw error;
    }
}

let handler = async (m, { conn, args, usedPrefix, command, isOwner }) => {
    // ... [resto de tu código handler original permanece igual]
}

handler.command = /^(jadibot|serbot|rentbot|code)/i
export default handler 

export async function gataJadiBot(options) {
    // ... [resto de tu código gataJadiBot original permanece igual, 
    // incluyendo toda la lógica de conexión y manejo de eventos]
}

// ... [resto de tus funciones auxiliares originales permanecen igual]

async function checkSubBots() {
    // ... [tu código checkSubBots original permanece igual]
}

setInterval(checkSubBots, 1800000); // 30min
