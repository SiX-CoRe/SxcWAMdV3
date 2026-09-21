/*
* lumnztyz ngasih credits ke yang bersangkutan dengan sc ini, baik base, apikey, scrape, dan lain sebagainya.
* github resmi sc ini : https://github.com/SiX-CoRe/SxcWaMdV3
* developer : t.me/LumnzTyz
* saluran info update : https://whatsapp.com/channel/0029Vb7XYjLKgsNyWrRHL10k
‼️JANGAN HAPUS CREDITS INI YA, RENAME RENAME SAJA JANGAN COBA COBA HAPUS TEKS INI ‼️
*/
import axios from 'axios'

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) {
        return m.reply(`Contoh penggunaan:
${usedPrefix + command} sxcwamdboy sc free tapi full fitur vvip`)
    }

    const url = `${global.APIs.deline}/maker/cewekbrat?text=${encodeURIComponent(text)}`

    try {
        const { data } = await axios.get(url, { responseType: 'arraybuffer' })
        await conn.sendFile(m.chat, data, 'cewekbrat.jpg', '', m)
    } catch (e) {
        console.error(e)
        m.reply('Gagal membuat gambar cewek brat.')
    }
}

handler.help = ['cewekbrat <teks>']
handler.tags = ['maker']
handler.command = /^cewekbrat$/i
handler.limit = true

export default handler