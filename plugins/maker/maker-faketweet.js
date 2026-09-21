import axios from 'axios'
/*
* lumnztyz ngasih credits ke yang bersangkutan dengan sc ini, baik base, apikey, scrape, dan lain sebagainya.
* github resmi sc ini : https://github.com/SiX-CoRe/SxcWaMdV3
* developer : t.me/LumnzTyz
* saluran info update : https://whatsapp.com/channel/0029Vb7XYjLKgsNyWrRHL10k
‼️JANGAN HAPUS CREDITS INI YA, RENAME RENAME SAJA JANGAN COBA COBA HAPUS TEKS INI ‼️
*/
let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) {
        return m.reply(`Contoh penggunaan:
${usedPrefix + command} name|username|comment|verified

Contoh:
${usedPrefix + command} lumnztyz|anu|halo lumnz|true`)
    }

    let [name, username, comment, verified] = text.split('|')

    if (!name || !username || !comment) {
        return m.reply(`Format salah!
${usedPrefix + command} name|username|comment|verified`)
    }

    verified = (verified || 'false').trim().toLowerCase()

    const avatar = await conn.profilePictureUrl(m.sender, 'image')
        .catch(() => `${global.APIs.deline}/Eu3BVf3K4x.jpg`)

    const url = `${global.APIs.deline}/maker/faketweet?name=${encodeURIComponent(name.trim())}&username=${encodeURIComponent(username.trim())}&comment=${encodeURIComponent(comment.trim())}&avatar=${encodeURIComponent(avatar)}&verified=${verified}`

    try {
        const { data } = await axios.get(url, { responseType: 'arraybuffer' })
        await conn.sendFile(m.chat, data, 'faketweet.jpg', '', m)
    } catch (e) {
        console.error(e)
        m.reply('Gagal membuat fake tweet.')
    }
}

handler.help = ['faketweet <name>|<username>|<comment>|<verified>']
handler.tags = ['maker']
handler.command = /^faketweet$/i
handler.limit = true

export default handler