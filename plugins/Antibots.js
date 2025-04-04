export async function before(m) {
  // Verificar que exista global.prefix y sea una RegExp
  if (!global.prefix || typeof global.prefix.test !== 'function') {
    console.error('Error: global.prefix no está definido o no es una expresión regular');
    return;
  }

  if (!m.text || !global.prefix.test(m.text)) {
    return;
  }

  const prefixMatch = global.prefix.exec(m.text);
  if (!prefixMatch) return;
  
  const usedPrefix = prefixMatch[0];
  const command = m.text.slice(usedPrefix.length).trim().split(' ')[0].toLowerCase();

  const validCommand = (command, plugins) => {
    for (let plugin of Object.values(plugins)) {
      if (plugin.command && 
          (Array.isArray(plugin.command) ? 
           plugin.command.includes(command) : 
           plugin.command === command)) {
        return true;
      }
    }
    return false;
  };

  if (!command) return;

  if (command === "bot") {
    return;
  }
  
  if (!global.plugins) {
    console.error('Error: global.plugins no está definido');
    return;
  }

  if (validCommand(command, global.plugins)) {
    if (!global.db.data?.chats || !global.db.data?.users) {
      console.error('Error: Estructura de db.data incompleta');
      return;
    }
    
    let chat = global.db.data.chats[m.chat];
    let user = global.db.data.users[m.sender];
    
    if (chat?.isBanned) {
      const botname = "SkyUltraPlus"; // Asegúrate de definir botname
      const avisoDesactivado = `《✦》El bot *${botname}* está desactivado en este grupo.\n\n> ✦ Un *administrador* puede activarlo con el comando:\n> » *${usedPrefix}bot on*`;
      await m.reply(avisoDesactivado);
      return;
    }
    
    if (!user.commands) {
      user.commands = 0;
    }
    user.commands += 1;
  } else {
    const comando = m.text.trim().split(' ')[0];
    await m.reply(`《✦》El comando *${comando}* no existe.\nPara ver la lista de comandos usa:\n» *#help*`);
  }
}
