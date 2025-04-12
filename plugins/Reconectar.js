const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const handler = async () => {
  console.log('[AUTO] Reinicio automático de subbots en 1 minuto...');

  await delay(1000 * 60); // Esperar 1 minuto

  try {
    const subBots = global.GataJadibot || [];

    if (!Array.isArray(subBots) || subBots.length === 0) {
      console.log('[AUTO] No hay subbots activos para reiniciar.');
      return;
    }

    for (let subbot of subBots) {
      if (subbot?.ws?.close) {
        subbot.ws.close();
        console.log(`[AUTO] Subbot reiniciado: ${subbot.user?.id || 'sin ID'}`);
      }
    }

    console.log('[AUTO] Reinicio de subbots completado.');
  } catch (e) {
    console.error('[AUTO] Error al reiniciar subbots:', e);
  }
};

// Ejecutar automáticamente al cargar el plugin
handler();

export default function () {}
