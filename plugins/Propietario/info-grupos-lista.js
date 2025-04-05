import fs from 'fs'
import PhoneNumber from 'awesome-phonenumber'

const archivoGrupos = './datos_grupos.json'
let datosGrupos = {}
if (fs.existsSync(archivoGrupos)) {
  datosGrupos = JSON.parse(fs.readFileSync(archivoGrupos))
}

let handler = async (m, { conn, isOwner }) => {
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

handler.help = ['listagrupos']
handler.tags = ['info']
handler.command = /^(groups|grouplist|listagrupos)$/i
handler.rowner = true
handler.exp = 30
export default handler
