import { watchFile, unwatchFile } from 'fs'

// Función para reiniciar los SubBots (GataJadiBot)
const restartSubBots = async () => {
  try {
    console.log('🔄 *Reiniciando SubBots (GataJadiBot)...*');
    
    // Aquí va la lógica para reiniciar los SubBots
    // Si usas PM2, puedes descomentar esto:
    // const { exec } = require('child_process');
    // exec('pm2 restart GataJadiBot', (error) => {
    //   if (error) console.error('❌ Error al reiniciar:', error);
    //   else console.log('✅ SubBots reiniciados correctamente');
    // });

    // Si no usas PM2, simplemente cierra el proceso (simulación)
    process.exit(0); // Esto reiniciará el proceso actual (ajusta según tu sistema)
    
  } catch (error) {
    console.error('❌ Error en el reinicio automático:', error);
  }
};

// Configurar el intervalo de reinicio (60 segundos = 1 minuto)
let restartInterval = setInterval(restartSubBots, 60 * 1000);

// Opcional: Detener el reinicio si se edita el archivo (para desarrollo)
watchFile(import.meta.url, () => {
  unwatchFile(import.meta.url);
  clearInterval(restartInterval);
  console.log('✋ Reinicio automático detenido (archivo modificado)');
});

// Mensaje de inicio
console.log('⚡ *Plugin de Reinicio Automático Activado* ⚡\nSe reiniciarán los SubBots cada 1 minuto.');
