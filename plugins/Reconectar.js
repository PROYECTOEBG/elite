// Plugin para reiniciar automáticamente la conexión de los subbots cada minuto

setInterval(async () => {
  if (!global.subBots) return
  console.log('[SubBot AutoRestart] Reiniciando subbots...')

  for (const jid in global.subBots) {
    const bot = global.subBots[jid]
    if (!bot?.ws) continue

    try {
      bot.ws.close() // Cierra la conexión WebSocket
      console.log(`[SubBot AutoRestart] Subbot ${jid} desconectado. Esperando reconexión automática...`)
    } catch (e) {
      console.error(`[SubBot AutoRestart] Error al reiniciar ${jid}:`, e)
    }
  }
}, 60000) // cada 1 minuto
