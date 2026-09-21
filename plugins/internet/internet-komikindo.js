/**
 * Komikindo
 * -----------------------------
 * Type   : Plugins ESM
 * creator : Hilman
 * Channel : https://whatsapp.com/channel/0029VbAYjQgKrWQulDTYcg2K
 * API : https://api.kaicloud.my.id
 * Note : Sesuaiain sama SC kalian
 */
import axios from 'axios'
import PDFDocument from 'pdfkit'
import sharp from 'sharp'

const API = 'https://api.kaicloud.my.id/api/manga/komikindo'

function cleanTitle(t = '') {
  return t.replace(/^Komik\s*/i, '').replace(/\s+/g, ' ').trim()
}

function extractImageUrl(v) {
  if (typeof v === 'string') return v
  return v?.url || v?.image || v?.src || v?.link || ''
}

async function downloadImage(url) {
  const { data } = await axios.get(url, {
    responseType: 'arraybuffer',
    timeout: 30000,
    headers: { 'Referer': 'https://komikindo.ch/' }
  })
  return Buffer.from(data)
}

async function imagesToPDF(imageUrls) {
  return new Promise(async (resolve, reject) => {
    try {
      const doc = new PDFDocument({ autoFirstPage: false })
      const chunks = []

      doc.on('data', chunk => chunks.push(chunk))
      doc.on('end', () => resolve(Buffer.concat(chunks)))
      doc.on('error', reject)

      for (const url of imageUrls) {
        try {
          let buffer = await downloadImage(url)
          buffer = await sharp(buffer).jpeg({ quality: 85 }).toBuffer()

          const meta = await sharp(buffer).metadata()
          const { width, height } = meta

          doc.addPage({ size: [width, height] })
          doc.image(buffer, 0, 0, { width, height })
        } catch (e) {
          console.log('Gagal proses gambar:', url, e.message)
        }
      }

      doc.end()
    } catch (e) {
      reject(e)
    }
  })
}

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) throw `Contoh:\n${usedPrefix + command} bocchi the rock`

  if (text.includes('|')) {
    const [, chapterUrl] = text.split('|')

    await m.reply(' Sedang mengambil gambar & membuat PDF, mohon tunggu...')

    const { data } = await axios.get(`${API}/read`, {
      params: { url: chapterUrl.trim() },
      headers: { accept: 'application/json' },
      timeout: 30000
    })

    if (!data?.status || !data?.data?.images?.length) throw 'Gagal mengambil gambar chapter'

    const images = data.data.images.map(extractImageUrl).filter(Boolean)
    const title = cleanTitle(data.data.title) || 'Komik'

    if (!images.length) throw 'Gagal mengambil gambar chapter'

    const pdfBuffer = await imagesToPDF(images)

    const fileName = title.replace(/[^a-zA-Z0-9]/g, '_').slice(0, 60) + '.pdf'

    return await conn.sendMessage(m.chat, {
      document: pdfBuffer,
      mimetype: 'application/pdf',
      fileName,
      caption: `📄 ${title}\nTotal halaman: ${images.length}`
    }, { quoted: m })
  }

  if (/^https:\/\/komikindo\.ch\/komik\//i.test(text)) {
    const { data } = await axios.get(`${API}/detail`, {
      params: { url: text.trim() },
      headers: { accept: 'application/json' },
      timeout: 30000
    })

    if (!data?.status || !data?.data?.chapters?.length) throw 'Chapter tidak ditemukan'

    const detail = data.data
    const title = cleanTitle(detail.title)

    const rows = detail.chapters.slice(0, 30).map(c => ({
      title: `Chapter ${c.chapter}`,
      description: c.date ? `❀ ${c.date}` : 'Tap untuk download PDF',
      id: `${usedPrefix + command} chapter|${c.link}`
    }))

    return await conn.sendMessage(m.chat, {
      image: { url: detail.image },
      caption: `❀ ${title}\n` +
        `Status: ${detail.info?.status || '-'}\n` +
        `Author: ${detail.info?.author || '-'}\n` +
        `Genre: ${(detail.genres || []).join(', ')}\n` +
        `Total Chapter: ${detail.chapterCount ?? detail.chapters.length}`,
      footer: 'Komikindo',
      nativeFlow: [{
        text: '❀ Pilih Chapter',
        sections: [{
          title: 'Daftar Chapter',
          rows
        }]
      }]
    }, { quoted: m })
  }

  const { data } = await axios.get(`${API}/search`, {
    params: { q: text },
    headers: { accept: 'application/json' },
    timeout: 30000
  })

  if (!data?.status || !data?.data?.length) throw 'Komik tidak ditemukan'

  const hasil = data.data

  const rows = hasil.slice(0, 20).map(v => ({
    title: v.title,
    description: `${v.type || '-'}${v.rating ? ' | ⭐ ' + v.rating : ''}`,
    id: `${usedPrefix + command} ${v.link}`
  }))

  return await conn.sendMessage(m.chat, {
    image: { url: hasil[0].image },
    caption: `❀ Hasil pencarian: ${text}\nTotal: ${hasil.length} komik`,
    footer: 'Komikindo',
    nativeFlow: [{
      text: '❀ Pilih Komik',
      sections: [{
        title: 'Daftar Komik',
        rows
      }]
    }]
  }, { quoted: m })
}

handler.help = ['komikindo']
handler.tags = ['internet']
handler.command = /^komikindo$/i
handler.limit = false
handler.register = true

export default handler