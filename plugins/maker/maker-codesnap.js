import fetch from 'node-fetch'
/*
* lumnztyz ngasih credits ke yang bersangkutan dengan sc ini, baik base, apikey, scrape, dan lain sebagainya.
* github resmi sc ini : https://github.com/SiX-CoRe/SxcWaMdV3
* developer : t.me/LumnzTyz
* saluran info update : https://whatsapp.com/channel/0029Vb7XYjLKgsNyWrRHL10k
‼️JANGAN HAPUS CREDITS INI YA, RENAME RENAME SAJA JANGAN COBA COBA HAPUS TEKS INI ‼️
*/
let handler = async (m, { conn, text }) => {
  await m.react('✨')

  if (!text) return

  let url = `${global.APIs.faa}/faa/codesnap?text=${encodeURIComponent(text)}`
  let res = await fetch(url)

  if (!res.ok) return

  let buffer = Buffer.from(await res.arrayBuffer())

  await conn.sendFile(m.chat, buffer, 'codesnap.png', '', m)
}

handler.help = ['codesnap <code>']
handler.tags = ['maker']
handler.command = /^codesnap$/i
handler.limit = true

export default handler