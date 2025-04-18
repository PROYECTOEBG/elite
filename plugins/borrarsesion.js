let handler = async (m, { args }) => {
  m.reply(`¡Hola! El comando se ejecutó correctamente. Número ingresado: ${args[0] || 'ninguno'}`);
};

handler.command = /^borrar$/i;
handler.owner = true;

module.exports = handler;
