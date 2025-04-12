/*const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
import fs from 'fs';
import path from 'path';

async function reiniciarSubBots() {
  try {
    const subBots = global.conns || [];

    if (!Array.isArray(subBots) || subBots.length === 0) {
      console.log('[AUTO] No hay subbots activos para reiniciar.');
      return;
    }

    for (let subbot of subBots) {
      if (subbot?.ws?.readyState === 1) {
        console.log(`[AUTO] Reiniciando subbot: ${subbot.user?.id || 'sin ID'}`);
        subbot.ws.close(); // esto forza la reconexión si tienes retry automático
      }
    }

    console.log('[AUTO] Reinicio de subbots completado.');
  } catch (e) {
    console.error('[AUTO] Error al reiniciar subbots:', e);
  }
}

// Ejecutar cada minuto
setInterval(() => {
  reiniciarSubBots().catch(console.error);
}, 60 * 1000);

export default function () {}
*/
