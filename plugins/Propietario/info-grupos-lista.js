import fs from 'fs'
import PhoneNumber from 'awesome-phonenumber'

const archivoGrupos = './datos_grupos.json'
let datosGrupos = {}
if (fs.existsSync(archivoGrupos)) {
  datosGrupos = JSON.parse(fs.readFileSync(archivoGrupos))
}

let handler = async (m, { conn, isOwner }) => {
  console.log("Comando ejecutado: Listar grupos");  // Para depurar

  const groups = Object.values(await conn.groupFetchAllParticipating())
  let txt = `*LISTA DE GRUPOS*\nTotal: ${groups.length}\n\n`

  for (let grupo of groups) {
    const datos = datosGrupos[grupo.id] || {}
    const fecha = datos.fechaIngreso ? new Date(datos.fechaIngreso).toLocaleDateString() : 'Desconocida'
    const agregadoPor = datos.agregadoPor ? PhoneNumber(datos.agregadoPor.replace('@s.whatsapp.net', '')).getNumber('international') : 'Desconocido'

    txt += `*Nombre:* ${grupo.subject}
*ID:* ${grupo.id}
${isOwner ? `*Participantes:* ${grupo.participants.length}` : ''}
*Fecha de ingreso:* ${fecha}
*Agregado por:* ${agregadoPor}\n\n`
  }

  m.reply(txt.trim())
}

// Evento que maneja cuando el bot es añadido a un grupo
conn.on('group-participants-update', async (update) => {
  if (update.action === 'add' && update.participants.includes(conn.user.jid)) {
    const groupId = update.id
    const fechaIngreso = new Date().toISOString()  // Fecha de ingreso en formato ISO
    const agregadoPor = update.addedBy  // ID de la persona que agregó al bot

    // Registrar la fecha de ingreso y quién agregó al bot
    datosGrupos[groupId] = {
      fechaIngreso: fechaIngreso,
      agregadoPor: agregadoPor
    }

    // Guardar los datos actualizados en el archivo JSON
    fs.writeFileSync(archivoGrupos, JSON.stringify(datosGrupos, null, 2))
    console.log(`Bot agregado a ${groupId} por ${agregadoPor} el ${fechaIngreso}`);
  }
});

// Verificar que el mensaje esté siendo recibido correctamente y filtrar los comandos
conn.on('message-new', async (m) => {
  console.log("Mensaje recibido:", m.body);  // Depuración

  if (m.body.match(/^(groups|grouplist|listagrupos)$/i)) {
    // Verifica si el comando es uno de los definidos
    await handler(m, { conn, isOwner: true });  // Cambia isOwner si no es el propietario
  }
});

export default handler
