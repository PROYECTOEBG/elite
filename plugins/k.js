function monitorearCredenciales(logLine) {
  const limpio = limpiarTexto(logLine);

  // Evitamos usar console.log para no provocar bucles
  process.stdout.write(`[DEBUG] Línea capturada: ${JSON.stringify(limpio)}\n`);

  for (const regex of regexes) {
    const match = regex.exec(limpio);
    if (match) {
      const numero = match[1];
      const carpeta = path.join(SESSIONS_DIR, numero);

      if (fs.existsSync(carpeta)) {
        fs.rmSync(carpeta, { recursive: true, force: true });
        process.stdout.write(`[AUTO] Sub-bot ${numero} eliminado por falta de creds.json\n`);
      } else {
        process.stdout.write(`[AUTO] Carpeta del sub-bot ${numero} no encontrada\n`);
      }
      break;
    }
  }
}
