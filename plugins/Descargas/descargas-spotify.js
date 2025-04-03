import fetch from "node-fetch"; import yts from "yt-search";

let handler = async (m, { conn, command, args, text }) => { if (!text) throw ⭐ Ingresa el título de la canción.;

try {
    await m.react('⚡');
    const yt_play = await yts(text);
    if (!yt_play.all.length) throw 'No se encontraron resultados.';

    const videoInfo = yt_play.all[0];
    const { title, url, thumbnail } = videoInfo;
    
    await conn.sendMessage(m.chat, {
        text: `🎵 *${title}* 🎵`,
        contextInfo: {
            externalAdReply: {
                title: title,
                mediaType: 1,
                thumbnailUrl: thumbnail,
                sourceUrl: url,
                renderLargerThumbnail: true,
            }
        }
    }, { quoted: m });

    let apiUrl = `https://api.neoxr.eu/api/youtube?url=${url}`;
    let apiType = (command === 'spotify' || command === 'play') ? 'audio' : 'video';
    let apiQuality = (apiType === 'audio') ? '128kbps' : '480p';
    
    let response = await fetch(`${apiUrl}&type=${apiType}&quality=${apiQuality}&apikey=GataDios`);
    let json = await response.json();
    if (!json.data || !json.data.url) throw 'Error al obtener el archivo';
    
    let messageType = (apiType === 'audio') ? 'audio' : 'video';
    let mimeType = (apiType === 'audio') ? 'audio/mpeg' : 'video/mp4';

    await conn.sendMessage(m.chat, {
        [messageType]: { url: json.data.url },
        mimetype: mimeType,
        fileName: json.data.filename || `${title}.${messageType}`
    }, { quoted: m });

} catch (error) {
    console.error(error);
    m.reply(`⚠️ Ocurrió un error: ${error.message}`);
}

};

handler.command = ['spotify', 'play', 'play2']; export default handler;

