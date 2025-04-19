import pkg from '@whiskeysockets/baileys';
const { generateWAMessageFromContent, proto } = pkg;

let handler = async (m, { conn }) => {
  const sections = [{
    title: "Selecciona tu escuadra",
    highlight_label: "Lista FF",
    rows: [
      {
        header: "Escuadra 1",
        title: "Unirme a Escuadra 1",
        description: "Toca para añadirte",
        id: "add_escuadra1"
      },
      {
        header: "Escuadra 2",
        title: "Unirme a Escuadra 2",
        description: "Toca para añadirte",
        id: "add_escuadra2"
      },
      {
        header: "Suplente",
        title: "Unirme como Suplente",
        description: "Toca para entrar como reserva",
        id: "add_suplente"
      },
      {
        header: "Limpiar lista",
        title: "Limpiar todo",
        description: "Vaciar la lista",
        id: "limpiar_lista"
      }
    ]
  }];

  const msg = generateWAMessageFromContent(m.chat, {
    viewOnceMessage: {
      message: {
        messageContextInfo: {
          deviceListMetadata: {},
          deviceListMetadataVersion: 2
        },
        interactiveMessage: proto.Message.InteractiveMessage.create({
          body: proto.Message.InteractiveMessage.Body.create({
            text: `> 🗓️ *COL*: 22:00
> ⚔️ *MODALIDAD*: CLK
> 👕 *ROPA*: verde

⬅️ *Escuadra 1:*
┊👨🏻‍💻 ➤
┊👨🏻‍💻 ➤
┊👨🏻‍💻 ➤
┊👨🏻‍💻 ➤

⬅️ *Escuadra 2:*
┊👨🏻‍💻 ➤
┊👨🏻‍💻 ➤
┊👨🏻‍💻 ➤
┊👨🏻‍💻 ➤

⥤ *SUPLENTE:*
┊👨🏻‍💻 ➤
┊👨🏻‍💻 ➤`
          }),
          footer: proto.Message.InteractiveMessage.Footer.create({
            text: "BOLILLOBOT | MELDEXZZ."
          }),
          header: proto.Message.InteractiveMessage.Header.create({
            title: "Lista FF",
            subtitle: "Selecciona una opción",
            hasMediaAttachment: false
          }),
          nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
            buttons: [
              {
                name: "single_select",
                buttonParamsJson: JSON.stringify({
                  title: "Lista FF",
                  sections: sections
                })
              }
            ]
          })
        })
      }
    }
  }, {});

  await conn.relayMessage(msg.key.remoteJid, msg.message, { messageId: msg.key.id });
};

handler.command = /^\.listaff$/i;
export default handler;
