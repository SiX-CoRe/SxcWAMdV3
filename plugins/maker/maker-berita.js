import axios from 'axios'

async function uploadUguu(buffer) {
  const form = new FormData()
  form.append('files[]', new Blob([buffer]), 'image.jpg')

  const res = await fetch('https://uguu.se/upload.php', {
    method: 'POST',
    body: form
  })

  const json = await res.json()
  if (!json.success) throw new Error('Upload gagal')

  return json.files[0].url
}

const handler = async (m, { conn, text, usedPrefix, command }) => {
  let judul = ''
  let urlGambar = ''

  try {
    if (
      m.quoted?.mimetype?.startsWith('image/') ||
      m.mimetype?.startsWith('image/')
    ) {
      judul = text.trim()

      if (!judul) {
        return conn.reply(
          m.chat,
          `Gunakan:\n${usedPrefix}${command} <judul>\n\nReply atau kirim gambar dengan caption command.`,
          m
        )
      }

      m.react('📤')

      const q = m.quoted || m
      const media = await q.download()

      if (!media) throw new Error('Gagal mengunduh gambar')

      urlGambar = await uploadUguu(media)
    } else {
      if (!text) {
        return conn.reply(
          m.chat,
          `Gunakan:\n${usedPrefix}${command} <judul>|<url gambar>\n\nAtau reply gambar dengan:\n${usedPrefix}${command} <judul>`,
          m
        )
      }

      const parts = text.split('|')

      if (parts.length < 2) {
        return conn.reply(
          m.chat,
          `Format:\n${usedPrefix}${command} <judul>|<url gambar>`,
          m
        )
      }

      judul = parts[0].trim()
      urlGambar = parts[1].trim()
    }

    m.react('🔄')

    const apiUrl =
      `https://api-nanzz.my.id/docs/api/maker/berita.php?text=${encodeURIComponent(judul)}&url=${encodeURIComponent(urlGambar)}`

    const response = await axios.get(apiUrl, {
      responseType: 'arraybuffer',
      timeout: 30000
    })

    await conn.sendMessage(
      m.chat,
      {
        image: Buffer.from(response.data),
        caption: `— berita maker — judul: ${judul}`
      },
      { quoted: m }
    )

    m.react('✅')
  } catch (e) {
    console.error(e)
    m.react('❌')
    conn.reply(m.chat, `Error: ${e.message || e}`, m)
  }
}

handler.help = ['berita']
handler.tags = ['maker']
handler.command = /^(berita|beritamaker)$/i
handler.limit = true
handler.register = true

export default handler