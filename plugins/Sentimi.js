// Estructura para gestionar los subbots
const subbots = {};

// Registrar un subbot
function registrarSubbot(nombre, funcion) {
    subbots[nombre] = {
        activo: true,
        ejecutar: funcion
    };
    console.log(`Subbot '${nombre}' registrado y activo.`);
}

// Cambiar el estado (activo/inactivo) de un subbot
function cambiarEstadoSubbot(nombre, estado) {
    if (subbots[nombre]) {
        subbots[nombre].activo = estado;
        console.log(`Subbot '${nombre}' ahora está ${estado ? "activo" : "inactivo"}.`);
    } else {
        console.log(`Subbot '${nombre}' no encontrado.`);
    }
}

// Ejecutar un subbot específico si está activo
function ejecutarSubbot(nombre) {
    const subbot = subbots[nombre];
    if (subbot && subbot.activo) {
        return subbot.ejecutar();
    } else {
        return `El subbot '${nombre}' está inactivo o no existe.`;
    }
}

// Subbot de motivación
registrarSubbot("motivacion", () => {
    const frases = [
        "¡Sigue adelante, lo estás haciendo genial!",
        "Cada día es una nueva oportunidad.",
        "No te rindas, el esfuerzo vale la pena.",
        "Eres más fuerte de lo que crees."
    ];
    return frases[Math.floor(Math.random() * frases.length)];
});

// Subbot de chistes
registrarSubbot("chistes", () => {
    const chistes = [
        "¿Por qué los programadores confunden Halloween con Navidad? Porque OCT 31 = DEC 25.",
        "¿Cómo se llama un oso sin dientes? ¡Oso gomoso!",
        "¿Qué le dijo el 0 al 8? ¡Bonito cinturón!"
    ];
    return chistes[Math.floor(Math.random() * chistes.length)];
});

// Mantener subbots activos en intervalos
setInterval(() => {
    if (subbots["motivacion"]?.activo) {
        console.log("Subbot motivación dice: " + ejecutarSubbot("motivacion"));
    }
}, 10000); // Cada 10 segundos para motivación

setInterval(() => {
    if (subbots["chistes"]?.activo) {
        console.log("Subbot chistes dice: " + ejecutarSubbot("chistes"));
    }
}, 15000); // Cada 15 segundos para chistes

// Desactivación de un subbot después de cierto tiempo (por ejemplo, 50 segundos)
setTimeout(() => {
    cambiarEstadoSubbot("motivacion", false);  // Desactivar motivación después de 50 segundos
}, 50000);

// Puedes añadir más subbots aquí de forma sencilla, sólo registra más subbots con "registrarSubbot".
