const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: { headless: true }
});

// Grupos muteados (cache)
const mutedGroups = new Set();

client.on('qr', qr => {
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('Bot listo!');
});

client.on('message', async msg => {
    // Verificar si es un comando y proviene de un grupo
    if ((msg.body === '.silencio' || msg.body === '.unsilencio') && msg.from.endsWith('@g.us')) {
        const chat = await msg.getChat();
        const sender = await msg.getContact();
        const participant = await chat.getParticipant(sender.id);
        
        // Solo administradores pueden usar estos comandos
        if (!participant.isAdmin) {
            return msg.reply('❌ Solo los administradores pueden usar este comando.');
        }
        
        // El bot debe ser admin para realizar acciones
        if (!chat.isGroupAdmin) {
            return msg.reply('❌ Necesito ser administrador para realizar esta acción.');
        }
        
        // Procesar comando
        if (msg.body === '.silencio') {
            mutedGroups.add(chat.id._serialized);
            await msg.reply('🔇 Grupo muteado. Solo administradores pueden enviar mensajes.');
            console.log(`Grupo ${chat.name} muteado por comando`);
        } else if (msg.body === '.unsilencio') {
            mutedGroups.delete(chat.id._serialized);
            await msg.reply('🔊 Grupo desmuteado. Todos pueden enviar mensajes.');
            console.log(`Grupo ${chat.name} desmuteado por comando`);
        }
    }
    
    // Verificar mensajes en grupos muteados
    if (msg.from.endsWith('@g.us') && mutedGroups.has(msg.from)) {
        const chat = await msg.getChat();
        const sender = await msg.getContact();
        const participant = await chat.getParticipant(sender.id);
        
        // Permitir solo a administradores
        if (!participant.isAdmin) {
            await msg.delete(true);
            // Opcional: enviar advertencia
            // await client.sendMessage(msg.from, `@${sender.number} El grupo está en modo silencio. Solo admins pueden escribir.`, {
            //     mentions: [sender]
            // });
        }
    }
});

client.initialize();
