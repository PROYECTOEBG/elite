// plugin-auto-reconnect.js

// Esta función verifica el estado de los subBots y reconecta si están caídos
global.checkSubBots = async () => {
  if (!global.subBots || typeof global.subBots !== 'object') return
  console.log('[SubBots] Verificando conexiones...')
  for (const jid in global.subBots) {
    try {
      const bot = global.subBots[jid]
      if (bot?.ws?.readyState !== 1) {
        console.log(`[SubBot ${jid}] Desconectado. Intentando reconectar...`)
        await bot.ev.emit('connection.update', { connection: 'close', lastDisconnect: {}, isReconnecting: true })
      }
    } catch (e) {
      console.error(`[SubBot ${jid}] Error al reconectar:`, e)
    }
  }
}

// Ejecuta checkSubBots automáticamente cada minuto desde la consola
setInterval(checkSubBots, 60000) // 60,000 ms = 1 minuto
console.log('[SubBots] Monitor de conexión iniciado: verificación cada 1 minuto.')
