const fs = require('fs');
const { exec } = require('child_process');

// Configuración
const BASE_PATH = '/home/container/Gata.JadiBot';
const CHECK_INTERVAL = 60000; // 1 minuto

console.log('═'.repeat(40));
console.log('  MONITOR DE SUBBOTS (JavaScript)');
console.log('═'.repeat(40));

function checkSubBots() {
  console.log('\n[+] Escaneando directorio:', BASE_PATH);

  fs.readdir(BASE_PATH, { withFileTypes: true }, (err, files) => {
    if (err) {
      console.error('[ERROR] No se pudo leer el directorio:', err.message);
      return;
    }

    const subBots = files.filter(dirent => dirent.isDirectory());
    if (subBots.length === 0) {
      console.log('[INFO] No se encontraron SubBots.');
      return;
    }

    console.log(`SubBots encontrados (${subBots.length}):`, subBots.map(d => d.name));
    subBots.forEach(dirent => verifyBotStatus(dirent.name));
  });
}

function verifyBotStatus(botName) {
  const botPath = `${BASE_PATH}/${botName}`;
  console.log(`\nVerificando: ${botName}`);

  // Método de verificación (¡adaptar según tus necesidades!)
  const statusFile = `${botPath}/status.txt`;
  fs.access(statusFile, fs.constants.F_OK, (err) => {
    const isActive = !err; // Si el archivo existe, asumimos que está activo

    if (!isActive) {
      console.log(`[!] ${botName} INACTIVO → Reiniciando...`);
      restartBot(botPath, botName);
    } else {
      console.log(`[✓] ${botName} ACTIVO`);
    }
  });
}

function restartBot(botPath, botName) {
  // Comando para reiniciar (¡cambiar según tu implementación!)
  const command = `node ${botPath}/main.js`; // Ejemplo para un bot en Node.js

  exec(command, { cwd: botPath }, (error, stdout, stderr) => {
    if (error) {
      console.error(`[ERROR] Al reactivar ${botName}:`, error.message);
      return;
    }
    console.log(`[OK] ${botName} reiniciado correctamente`);
  });
}

// Ejecución inicial + programación periódica
checkSubBots();
setInterval(checkSubBots, CHECK_INTERVAL);
