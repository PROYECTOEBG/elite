async function startBot() {
    const sock = makeWASocket({
        auth: state,
        printQRInTerminal: true,
    });

    sock.ev.on("creds.update", saveState);

    sock.ev.on("connection.update", (update) => {
        const { connection, lastDisconnect } = update;

        if (connection === "close") {
            const errorMsg = lastDisconnect?.error?.message || "";
            const statusCode = lastDisconnect?.error?.output?.statusCode;

            if (
                errorMsg.includes("Conexión perdida") ||
                errorMsg.includes("Conexión cerrada") ||
                statusCode === 428
            ) {
                console.log("Se detectó una desconexión crítica. Reiniciando subbot...");
                process.exit();
            } else {
                console.log("Reconectando...");
                startBot();
            }
        }

        if (connection === "open") {
            console.log("Conectado correctamente!");
        }
    });

    // SIMULAR ERROR DESPUÉS DE 5 SEGUNDOS
    setTimeout(() => {
        throw new Error("Simulando desconexión de WhatsApp");
    }, 5000);
}
