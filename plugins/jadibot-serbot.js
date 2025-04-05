/*⚠ PROHIBIDO EDITAR ⚠
Este código fue modificado, adaptado y mejorado por
- ReyEndymion >> https://github.com/ReyEndymion
El código de este archivo esta inspirado en el código original de:
- Aiden_NotLogic >> https://github.com/ferhacks
*El archivo original del MysticBot-MD fue liberado en mayo del 2024 aceptando su liberacion*
El código de este archivo fue parchado en su momento por:
- BrunoSobrino >> https://github.com/BrunoSobrino
Contenido adaptado para GataBot-MD por:
- GataNina-Li >> https://github.com/GataNina-Li
- elrebelde21 >> https://github.com/elrebelde21
*/

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

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuración mejorada de reconexión
const MAX_RECONNECT_ATTEMPTS = 5;
const RECONNECT_DELAY = 5000; // 5 segundos
const retryMap = new Map();

// Interceptar console.error para detectar desconexiones
const originalConsoleError = console.error;
console.error = (...args) => {
    const message = args.join(' ').trim();
    
    // Detectar mensaje específico de desconexión
    if (message.includes('Conexión perdida en la sesión') && message.includes('Borrando datos')) {
        const sessionIdMatch = message.match(/\(\+(\d+)\)/);
        if (sessionIdMatch && sessionIdMatch[1]) {
            const sessionId = sessionIdMatch[1];
            console.log(chalk.bold.red(`⚠️ Detectada desconexión crítica en sub-bot ${sessionId}`));
            handleSubBotDisconnection(sessionId).catch(e => {
                console.error(chalk.bold.yellow(`❌ Error al manejar desconexión de ${sessionId}:`), e);
            });
        }
    }
    
    originalConsoleError(...args);
};

async function handleSubBotDisconnection(sessionId) {
    const pathGataJadiBot = path.join("./GataJadiBot/", sessionId);
    const subBotIndex = global.conns.findIndex(c => c.user?.jid?.includes(sessionId));
    
    try {
        // Limpiar conexión anterior si existe
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

        // Esperar antes de reconectar
        console.log(chalk.bold.blue(`⌛ Esperando ${RECONNECT_DELAY/1000} segundos para reconectar ${sessionId}...`));
        await delay(RECONNECT_DELAY);

        // Reconectar usando tu lógica existente
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

// Función de delay mejorada
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// ... [El resto de tu código original permanece igual, incluyendo las funciones gataJadiBot, checkSubBots, etc.]

// Solo cambia la exportación para incluir el nuevo handler
export { gataJadiBot, handleSubBotDisconnection, checkSubBots };
