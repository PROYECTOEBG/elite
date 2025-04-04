module.exports = {
  name: 'bienvenida',
  description: 'Comando de bienvenida',
  async execute(message, args) {
    const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    if (!member) {
      return message.reply('¡Por favor menciona a un miembro del servidor!');
    }

    // Crear el mensaje de bienvenida
    const bienvenida = `
*╔══════════════*
*╟🏆𝐵𝐼𝐸𝑁𝑉𝐸𝑁𝐼𝐷𝑂/𝐴*
*╠══════════════*
*╟*🛡️Pruebas ProyectoX -
*╟👤${member.user.tag}*
*╟📄𝐼𝑁𝐹𝑂𝑅𝑀𝐴𝐶𝐼𝑂́𝑁:*

𝑆𝐼𝑁 𝐷𝐸𝑆𝐶𝐿𝑅𝐼𝑃𝐶𝐼𝑂́𝑁

*╟* ¡🇼‌🇪‌🇱‌🇨‌🇴‌🇲‌🇪!
*╚══════════════*
`;

    // Enviar el mensaje de bienvenida en el canal adecuado
    message.channel.send(bienvenida);
  }
};
