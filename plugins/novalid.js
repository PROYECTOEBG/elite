// By: @kevv

// Asegurar que el prefijo esté definido y sea una expresión regular válida
if (!global.prefix) global.prefix = /^#|\./i;

export async function before(m) {
  if (!m.text || !global.prefix.test(m.text)) {
    return;
  }

  const usedPrefix = global.prefix.exec(m.text)[0];
  const command = m.text.slice(usedPrefix.length).trim().split(' ')[0].toLowerCase();

  const validCommand = (command, plugins) => {
    for (let plugin of Object.values(plugins)) {
      if (
        plugin.command &&
        (Array.isArray(plugin.command) ? plugin.command : [plugin.command]).includes(command)
      ) {
        return true;
      }
    }
    return false;
  };

  if (validCommand(command, global.plugins)) {
    let chat = global.db.data.chats[m.chat];
    let user = global.db.data.users[m.sender];
    if (chat.isBanned) return;
    if (!user.commands) {
      user.commands = 0;
    }
    user.commands += 1;
    await conn.sendPresenceUpdate('composing', m.chat);
  } else {
    const comando = m.text.trim().split(' ')[0];
    await m.reply(`︎✦ ¡Hey! 
El comando ${comando} no es válido, verifica si está bien escrito e intenta de nuevo.

©EliteBotGlobal 2023`);

    /*
    let txt = `👤 User: ${m.pushName || 'Anónimo'}\n🌍 Pais: ${global.userNationality}\n🐢 Bot: ${packname}\n🌻 Comando: ${comando}`.trim();

    await conn.sendMessage(global.channelid, {
      text: txt,
      contextInfo: {
        externalAdReply: {
          title: "🔔 Notificación General 🔔",
          body: '🐢 Un usuario ha usado el comando ' + comando,
          thumbnailUrl: fotoperfil,
          sourceUrl: redes,
          mediaType: 1,
          showAdAttribution: false,
          renderLargerThumbnail: false
        }
      }
    }, { quoted: null });
    */
  }
}
