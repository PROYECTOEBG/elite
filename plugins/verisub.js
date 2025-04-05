const fs = require('fs'); const path = require('path'); const exec = require('child_process').exec;

// Ruta del directorio donde están los subbots const subbotsPath = '/home/container/GataJadiBot';

// Función para verificar y activar subbots function checkAndRestartSubbots() { fs.readdir(subbotsPath, (err, subbots) => { if (err) { console.error('Error al leer el directorio:', err); return; }

subbots.forEach(subbot => {
        const subbotPath = path.join(subbotsPath, subbot);
        
        // Verificar si el subbot está activo
        exec(`pm2 list | grep ${subbot}`, (error, stdout) => {
            if (!stdout.includes('online')) {
                console.log(`El subbot ${subbot} está desactivado. Reiniciando...`);
                exec(`pm2 start ${subbotPath}`, (startError) => {
                    if (startError) {
                        console.error(`Error al iniciar ${subbot}:`, startError);
                    } else {
                        console.log(`${subbot} ha sido activado correctamente.`);
                    }
                });
            } else {
                console.log(`${subbot} está activo.`);
            }
        });
    });
});

}

// Ejecutar la función cada minuto setInterval(checkAndRestartSubbots, 60000);

console.log('Monitor de subbots iniciado. Verificando cada minuto...');

