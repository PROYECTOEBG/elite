const fs = require('fs');
const path = require('path');
const exec = require('child_process').exec;

// Ruta del directorio donde están los subbots
const subbotsPath = '/home/container/GataJadiBot';

// Función para verificar y activar subbots
function checkAndRestartSubbots() {
    console.log('Verificando subbots...');

    fs.readdir(subbotsPath, (err, subbots) => {
        if (err) {
            console.error('Error al leer el directorio:', err);
            return;
        }

        console.log(`Subbots encontrados: ${subbots.length > 0 ? subbots.join(', ') : 'ninguno'}`);

        subbots.forEach(subbot => {
            const subbotPath = path.join(subbotsPath, subbot);

            // Verificar si el subbot está activo
            exec(`pm2 list | grep ${subbot}`, (error, stdout, stderr) => {
                if (error || stderr) {
                    console.log(`Error al verificar ${subbot}: ${stderr || error.message}`);
                    return;
                }

                console.log(`Estado de ${subbot}:`, stdout);

                if (!stdout.includes('online')) {
                    console.log(`El subbot ${subbot} está desactivado. Reiniciando...`);
                    exec(`pm2 start ${subbotPath}`, (startError, startStdout, startStderr) => {
                        if (startError || startStderr) {
                            console.error(`Error al iniciar ${subbot}:`, startStderr || startError.message);
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

// Ejecutar la función cada minuto
setInterval(checkAndRestartSubbots, 60000);

console.log('Monitor de subbots iniciado. Verificando cada minuto...');
