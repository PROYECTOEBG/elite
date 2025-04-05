let handler = async (m, { conn, isOwner }) => {
  console.log("Comando ejecutado");
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
