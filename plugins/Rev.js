import { Buttons } from 'whatsapp-web.js';

let handler = m => m;

handler.before = async function (m, { conn, groupMetadata }) {
  if (!m.messageStubType || !m.isGroup) return;
  if (m.messageStubType !== 20) return; // 20 = Creación de grupo

  let subject = groupMetadata.subject || "el grupo";
  let welcomeText = `✨ ¡Hola a todos! Soy su nuevo bot en *${subject}*! 🤖\n\n👮 Recuerden seguir las reglas del grupo.\n💡 ¿Necesitan ayuda? Elijan una opción:`;

  let botones = new Buttons(
    welcomeText,
    [
      { body: '📖 Guía' },
      { body: '📘 Guía 2' }
    ],
    'Menú de Ayuda',
    'Selecciona una opción'
  );

  await this.sendMessage(m.chat, botones, { quoted: m });
};

export default handler;
