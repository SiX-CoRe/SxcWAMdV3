import { createCanvas, loadImage, GlobalFonts } from '@napi-rs/canvas'
import fs from 'fs'
import https from 'https'
import path from 'path'
import { fileURLToPath } from 'url'
/*
* lumnztyz ngasih credits ke yang bersangkutan dengan sc ini, baik base, apikey, scrape, dan lain sebagainya.
* github resmi sc ini : https://github.com/SiX-CoRe/SxcWaMdV3
* developer : t.me/LumnzTyz
* saluran info update : https://whatsapp.com/channel/0029Vb7XYjLKgsNyWrRHL10k
‼️JANGAN HAPUS CREDITS INI YA, RENAME RENAME SAJA JANGAN COBA COBA HAPUS TEKS INI ‼️
*/
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const CONFIG = {
  pos: {
    saldo: { x: 62, y: 325 },
    koin: { x: 115, y: 400 },
    pill: { x: 50, y: 510 }
  },
  fontSize: {
    rp: 34,
    saldo: 95,
    koin: 34,
    pill: 34
  },
  icon: {
    eye: { w: 60, h: 60 },
    report: { w: 30, h: 30 },
    next: { w: 30, h: 30 }
  },
  pill: {
    height: 48,
    paddingLeft: 14,
    paddingRight: 14,
    gapIconText: 10,
    gapTextArrow: 16
  },
  gap: {
    rpToAngka: 8,
    angkaToEye: 20,
    eyeOffsetY: 12
  },
  color: {
    report: 'rgb(196, 227, 245)',
    eye: 'rgb(204, 226, 240)'
  },
  baseUrl: 'https://raw.githubusercontent.com/Ditzzx-vibecoder/Assets/main'
}

const bulanId = [
  'Januari', 'Februari', 'Maret', 'April',
  'Mei', 'Juni', 'Juli', 'Agustus',
  'September', 'Oktober', 'November', 'Desember'
]

function downloadAsset(url, dest) {
  return new Promise((resolve, reject) => {
    const doGet = targetUrl => {
      https.get(targetUrl, res => {
        if ([301, 302, 307, 308].includes(res.statusCode)) {
          return doGet(res.headers.location)
        }

        if (res.statusCode !== 200) {
          return reject(new Error(`Gagal download asset: ${res.statusCode} ${targetUrl}`))
        }

        const file = fs.createWriteStream(dest)
        res.pipe(file)

        file.on('finish', () => file.close(resolve))
        file.on('error', err => {
          fs.unlink(dest, () => reject(err))
        })
      }).on('error', err => {
        fs.unlink(dest, () => reject(err))
      })
    }

    doGet(url)
  })
}

async function ensureAsset(asset) {
  if (!fs.existsSync(asset.path) || fs.statSync(asset.path).size === 0) {
    await downloadAsset(asset.url, asset.path)
  }
}

function tintIcon(ctx, img, x, y, w, h, color) {
  const off = createCanvas(w, h)
  const octx = off.getContext('2d')

  octx.drawImage(img, 0, 0, w, h)
  octx.globalCompositeOperation = 'source-in'
  octx.fillStyle = color
  octx.fillRect(0, 0, w, h)

  ctx.drawImage(off, x, y, w, h)
}

function formatRupiahNumber(value) {
  return String(value || '0').replace(/[^\d]/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, '.')
}

async function generateGopay(saldo, koin, terpakai, bulan) {
  const fontDir = path.join(__dirname, '../tmp/fonts')
  const imgDir = path.join(__dirname, '../tmp/assets')

  fs.mkdirSync(fontDir, { recursive: true })
  fs.mkdirSync(imgDir, { recursive: true })

  const B = CONFIG.baseUrl

  const assets = {
    bg: {
      url: `${B}/Image/quality_restoration_20260501080321276.jpg`,
      path: path.join(imgDir, 'gopay_bg.jpg')
    },
    fontReg: {
      url: `${B}/Font/rupa_sans_regular.ttf`,
      path: path.join(fontDir, 'rupa_reg.ttf')
    },
    fontSb: {
      url: `${B}/Font/rupa_sans_semi_bold.ttf`,
      path: path.join(fontDir, 'rupa_sb.ttf')
    },
    fontSerif: {
      url: `${B}/Font/rupa_serif_semi_bold.ttf`,
      path: path.join(fontDir, 'rupa_serif.ttf')
    },
    iconReport: {
      url: `${B}/Image/bar-chart_6687624.svg`,
      path: path.join(imgDir, 'gopay_report.svg')
    },
    iconEye: {
      url: `${B}/Image/icChat16ReadMessage.svg`,
      path: path.join(imgDir, 'gopay_eye.svg')
    },
    iconNext: {
      url: `${B}/Image/icNavigation16NextIos.svg`,
      path: path.join(imgDir, 'gopay_next.svg')
    }
  }

  for (const asset of Object.values(assets)) {
    await ensureAsset(asset)
  }

  GlobalFonts.registerFromPath(assets.fontReg.path, 'RupaSans')
  GlobalFonts.registerFromPath(assets.fontSb.path, 'RupaSansBold')
  GlobalFonts.registerFromPath(assets.fontSerif.path, 'RupaSerif')

  const bg = await loadImage(assets.bg.path)
  const iconReport = await loadImage(assets.iconReport.path)
  const iconEye = await loadImage(assets.iconEye.path)
  const iconNext = await loadImage(assets.iconNext.path)

  const canvas = createCanvas(bg.width, bg.height)
  const ctx = canvas.getContext('2d')

  const { pos, fontSize, icon, pill, gap, color } = CONFIG

  ctx.drawImage(bg, 0, 0)

  ctx.fillStyle = '#fff'
  ctx.font = `800 ${fontSize.rp}px RupaSansBold`
  ctx.fillText('Rp', pos.saldo.x, pos.saldo.y - 38)

  const rpW = ctx.measureText('Rp').width

  ctx.font = `800 ${fontSize.saldo}px RupaSerif`

  const angkaX = pos.saldo.x + rpW + gap.rpToAngka
  ctx.fillText(saldo, angkaX, pos.saldo.y)

  const angkaW = ctx.measureText(saldo).width
  const eyeX = angkaX + angkaW + gap.angkaToEye
  const eyeMidY = pos.saldo.y - fontSize.saldo / 2 + gap.eyeOffsetY

  tintIcon(
    ctx,
    iconEye,
    eyeX,
    eyeMidY - icon.eye.h / 2,
    icon.eye.w,
    icon.eye.h,
    color.eye
  )

  ctx.fillStyle = '#fff'
  ctx.font = `800 ${fontSize.koin}px RupaSansBold`
  ctx.fillText(koin, pos.koin.x, pos.koin.y)

  const koinAngkaW = ctx.measureText(koin).width

  ctx.font = `400 ${fontSize.koin}px RupaSans`
  ctx.fillText(' Coins', pos.koin.x + koinAngkaW, pos.koin.y)

  const rpTerpakaiText = `Rp${formatRupiahNumber(terpakai)}`

  ctx.font = `600 ${fontSize.pill}px RupaSansBold`
  const rpTerpakaiW = ctx.measureText(rpTerpakaiText).width

  ctx.font = `400 ${fontSize.pill}px RupaSans`
  const sisaText = ` udah terpakai di ${bulan}`
  const sisaW = ctx.measureText(sisaText).width

  const textW = rpTerpakaiW + sisaW

  const pillW =
    pill.paddingLeft +
    icon.report.w +
    pill.gapIconText +
    textW +
    pill.gapTextArrow +
    icon.next.w +
    pill.paddingRight

  const pillCenterY = pos.pill.y + pill.height / 2
  const textBaseY = pillCenterY + fontSize.pill / 3

  const textStartX =
    pos.pill.x +
    pill.paddingLeft +
    icon.report.w +
    pill.gapIconText

  tintIcon(
    ctx,
    iconReport,
    pos.pill.x + pill.paddingLeft,
    pillCenterY - icon.report.h / 2,
    icon.report.w,
    icon.report.h,
    color.report
  )

  tintIcon(
    ctx,
    iconNext,
    pos.pill.x + pillW - pill.paddingRight - icon.next.w,
    pillCenterY - icon.next.h / 2,
    icon.next.w,
    icon.next.h,
    '#fff'
  )

  ctx.fillStyle = '#fff'
  ctx.font = `600 ${fontSize.pill}px RupaSansBold`
  ctx.fillText(rpTerpakaiText, textStartX, textBaseY)

  ctx.font = `400 ${fontSize.pill}px RupaSans`
  ctx.fillText(sisaText, textStartX + rpTerpakaiW, textBaseY)

  return canvas.toBuffer('image/jpeg')
}

let handler = async (m, { conn, args, usedPrefix, command }) => {
  try {
    const input = args[0]

    if (!input || isNaN(input.replace(/\./g, ''))) {
      return m.reply(
        `Masukkan nominal saldo!\nContoh: *${usedPrefix + command} 100000*`
      )
    }

    const nominal = parseInt(input.replace(/\./g, ''))

    if (nominal <= 0) {
      return m.reply('Nominal harus lebih dari 0!')
    }

    await m.react('⏱️')

    const saldo = nominal.toLocaleString('id-ID')
    const koin = String(Math.floor(Math.random() * 900) + 100)

    const terpakai = String(
      Math.floor(Math.random() * Math.min(nominal, 500000))
    )

    const bulan = bulanId[new Date().getMonth()]

    const tanggal = new Date().toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    })

    const buffer = await generateGopay(saldo, koin, terpakai, bulan)

    await conn.sendMessage(
      m.chat,
      {
        image: buffer,
        caption:
          `*≡ F A K E - G O P A Y ≡*\n\n` +
          `Request by: ${m.pushName || 'User'}\n\n` +
          `${global.wm5 || global.namebot || 'Bot'} — ${tanggal}`
      },
      { quoted: m }
    )

    await m.react('✅')
  } catch (e) {
    console.error(e)
    await m.react('❌')
    m.reply(`Error:\n${e.message}`)
  }
}

handler.help = ['fakegopay']
handler.tags = ['maker']
handler.command = /^(fakegopay|fgopay)$/i
handler.register = true
handler.limit = true

export default handler