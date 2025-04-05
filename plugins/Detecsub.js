const { exec } = require("child_process");
const fs = require("fs");

// Ruta donde están los subbots
const rutaSubbots = "/home/container/GataJadiBot";

// Objeto para rastrear el estado de los subbots
let subbots = {};

// Función para escanear y detectar subbots automáticamente
function detectarSubbots() {
    fs.readdir(rutaSubbots, (err, archivos) => {
        if (err) {
            console.error("Error al leer la carpeta de subbots:", err);
            return;
        }

        archivos.forEach(archivo => {
            if (!subbots[archivo]) {
                subbots[archivo] = { activo: true, ruta: `${rutaSubbots}/${archivo}` };
                console.log(`Subbot detectado: ${archivo}`);
            }
        });
    });
}

// Función para verificar si los subbots están activos
function verificarSubbots() {
    for (const nombre in subbots) {
        if (!subbots[nombre].activo) {
            console.log(`${nombre} está inactivo. Intentando reconectar...`);
            reconectarSubbot(nombre);
        }
    }
}

// Función para reconectar un subbot
function reconectarSubbot(nombre) {
    const ruta = subbots[nombre].ruta;
    console.log(`Ejecutando script para reiniciar ${nombre} en ${ruta}...`);

    exec(`cd ${ruta} && pm2 restart bot.js`, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error al reiniciar ${nombre}:`, error);
            return;
        }
        console.log(`${nombre} reiniciado exitosamente.`);
        subbots[nombre].activo = true; // Lo marcamos como activo
    });
}

// Escanear la carpeta cada 10 segundos para detectar nuevos subbots
setInterval(detectarSubbots, 10000);

// Verificar cada 1 segundo si algún subbot está inactivo
setInterval(verificarSubbots, 1000);
