const subbots = {};

// Función para registrar un subbot con nombre genérico (bot 1, bot 2, etc.)
function registrarSubbot(numero) {
    const nombre = `bot ${numero}`;
    subbots[nombre] = {
        activo: true, // El subbot se activa al registrarse
    };
    console.log(`Subbot '${nombre}' registrado y activo.`);
}

// Función para cambiar el estado (activo/inactivo) de un subbot
function cambiarEstadoSubbot(numero, estado) {
    const nombre = `bot ${numero}`;
    if (subbots[nombre]) {
        subbots[nombre].activo = estado;
        console.log(`Subbot '${nombre}' ahora está ${estado ? "activo" : "inactivo"}.`);
    } else {
        console.log(`Subbot '${nombre}' no encontrado.`);
    }
}

// Función para ejecutar un subbot
function ejecutarSubbot(numero) {
    const nombre = `bot ${numero}`;
    const subbot = subbots[nombre];
    if (subbot && subbot.activo) {
        console.log(`Ejecutando ${nombre}...`);
        return `${nombre} está activo.`;
    } else {
        return `El ${nombre} está inactivo.`;
    }
}

// Crear subbots (bot 1, bot 2, bot 3...)
registrarSubbot(1);
registrarSubbot(2);
registrarSubbot(3);

// Función para detectar si los subbots están activos
function verificarSubbots() {
    let todoActivo = true;
    
    // Verificamos el estado de cada subbot
    for (const nombre in subbots) {
        const subbot = subbots[nombre];
        if (!subbot.activo) {
            console.log(`${nombre} está inactivo. Reiniciando...`);
            todoActivo = false;
            break;
        }
    }
    
    // Si algún subbot está inactivo, reiniciar el bot
    if (!todoActivo) {
        reiniciarBot();
    } else {
        console.log("Todos los subbots están activos.");
    }
}

// Función para reiniciar el bot (se reinician los subbots)
function reiniciarBot() {
    console.log("Reiniciando el bot...");

    // Reactivar todos los subbots
    for (const nombre in subbots) {
        subbots[nombre].activo = true;
        console.log(`${nombre} reactivado.`);
    }

    // Puedes agregar aquí un código para reiniciar el bot completamente si es necesario
    // En este caso, solo estamos reactivando los subbots.
}

// Verificar el estado de los subbots cada 1 segundo
setInterval(verificarSubbots, 1000); // Ejecuta cada 1 segundo

// Simular que un subbot se vuelve inactivo
setTimeout(() => {
    cambiarEstadoSubbot(1, false); // Desactivamos el bot 1 para probar
}, 5000); // Después de 5 segundos

// Simulamos que el bot sigue funcionando
setInterval(() => {
    console.log(ejecutarSubbot(1));
    console.log(ejecutarSubbot(2));
    console.log(ejecutarSubbot(3));
}, 2000); // Ejecuta cada 2 segundos
