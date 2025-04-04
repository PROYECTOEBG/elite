let handler = async (m, { conn, groupMetadata, command }) => {
  // Verifica que este chat sea de subbot
  let chat = global.db.data.chats[m.chat];
  if (!chat.subbot) return m.reply("Este comando es solo para subbots.");

  // Verifica que se mencione al usuario (quien recibe la bienvenida o despedida)
  if (!m.mentionedJid || m.mentionedJid.length === 0)
    return m.reply("Menciona al usuario, por ejemplo: !welcome @usuario");

  let userId = m.mentionedJid[0];
  let subject = groupMetadata && groupMetadata.subject ? groupMetadata.subject : "Grupo sin nombre";
  let desc = groupMetadata && groupMetadata.desc ? groupMetadata.desc : "Sin descripción";

  if (/^(welcome|bienvenida)$/i.test(command)) {
    // Formato de bienvenida (con imagen en la descripción, si lo deseas)
    let welcomeMsg = 
`*╔══════════════*
*╟🏆𝐵𝐼𝐸𝑁𝑉𝐸𝑁𝐼𝐷𝑂/𝐴*
*╠══════════════*
*╟*🛡️Pruebas ProyectoX -
*╟👤@${userId.split('@')[0]}* 
*╟📄𝐼𝑁𝐹𝑂𝑅𝑀𝐴𝐶𝐼𝑂́𝑁:*
${desc}

*╟* ¡🇼‌🇪‌🇱‌🇨‌🇴‌🇲‌🇪!
*╚══════════════*`;
    await conn.sendMessage(m.chat, { text: welcomeMsg, mentions: [userId] });
  } else if (/^(bye|despedida|adios)$/i.test(command)) {
    // Formato de despedida
    let byeMsg = 
`*╔══════════════*
*╟👋𝐴𝐷𝐼𝙊𝙎/𝐴*
*╠══════════════*
*╟* ¡Adiós @${userId.split('@')[0]}!
*╟* Te extrañaremos en *${subject}*.
*╚══════════════*`;
    await conn.sendMessage(m.chat, { text: byeMsg, mentions: [userId] });
  }
};

handler.help = ['welcome <@user>', 'bye <@user>'];
handler.tags = ['group'];
handler.command = /^(welcome|bienvenida|bye|despedida|adios)$/i;
handler.group = true;
handler.subbot = true; // Indicamos que es para subbots

export default handler;
