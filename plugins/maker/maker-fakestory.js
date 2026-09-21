import { Canvas, loadImage, FontLibrary } from 'skia-canvas'
import fs from 'fs'
import path from 'path'
/*
* lumnztyz ngasih credits ke yang bersangkutan dengan sc ini, baik base, apikey, scrape, dan lain sebagainya.
* github resmi sc ini : https://github.com/SiX-CoRe/SxcWaMdV3
* developer : t.me/LumnzTyz
* saluran info update : https://whatsapp.com/channel/0029Vb7XYjLKgsNyWrRHL10k
‼️JANGAN HAPUS CREDITS INI YA, RENAME RENAME SAJA JANGAN COBA COBA HAPUS TEKS INI ‼️
*/
const FONT_DIR = './font'
const BG_PATH = './bg-template.jpg'

async function ensureFile(url, filePath) {
  if (fs.existsSync(filePath)) return

  const res = await fetch(url)
  if (!res.ok) throw new Error(`Gagal download: ${url}`)

  const buf = Buffer.from(await res.arrayBuffer())
  fs.writeFileSync(filePath, buf)
}

async function getProfile(conn, m) {
  try {
    return await conn.profilePictureUrl(m.sender, 'image')
  } catch {
    return 'https://raw.githubusercontent.com/uploader762/dat4/main/uploads/e0f993-1777126212302.jpg'
  }
}

async function generateStory(pp, name, text) {
  if (!fs.existsSync(FONT_DIR)) fs.mkdirSync(FONT_DIR, { recursive: true })

  await ensureFile(
    'https://raw.githubusercontent.com/Ditzzx-vibecoder/Assets/main/Font/Inter-SemiBold.otf',
    path.join(FONT_DIR, 'Inter-SemiBold.otf')
  )

  await ensureFile(
    'https://raw.githubusercontent.com/Ditzzx-vibecoder/Assets/main/Font/Inter-Bold.otf',
    path.join(FONT_DIR, 'Inter-Bold.otf')
  )

  await ensureFile(
    'https://raw.githubusercontent.com/Ditzzx-vibecoder/Assets/main/Image/_20260430144912806.jpg',
    BG_PATH
  )

  FontLibrary.use('Inter-SB', [path.join(FONT_DIR, 'Inter-SemiBold.otf')])
  FontLibrary.use('Inter-B', [path.join(FONT_DIR, 'Inter-Bold.otf')])

  const bg = await loadImage(BG_PATH)
  const avatar = await loadImage(pp)

  const canvas = new Canvas(bg.width, bg.height)
  const ctx = canvas.getContext('2d')

  ctx.imageSmoothingEnabled = true
  ctx.imageSmoothingQuality = 'high'

  ctx.drawImage(bg, 0, 0)

  const header = { x: 115, y: 388, gap: 25 }
  const p = { cx: header.x, cy: header.y, r: 68 }

  const SAFE_PADDING_X = 100
  const SAFE_PADDING_TOP = 480
  const SAFE_PADDING_BOTTOM = 480

  const safeLeft = SAFE_PADDING_X
  const safeRight = bg.width - SAFE_PADDING_X
  const safeTop = SAFE_PADDING_TOP
  const safeBottom = bg.height - SAFE_PADDING_BOTTOM
  const safeW = safeRight - safeLeft
  const safeH = safeBottom - safeTop
  const safeCX = bg.width / 2
  const safeCY = (safeTop + safeBottom) / 2

  const s = Math.min(avatar.width, avatar.height)
  const sx = (avatar.width - s) / 2
  const sy = (avatar.height - s) / 2

  ctx.save()
  ctx.beginPath()
  ctx.arc(p.cx, p.cy, p.r, 0, Math.PI * 2)
  ctx.closePath()
  ctx.clip()
  ctx.drawImage(
    avatar,
    sx,
    sy,
    s,
    s,
    p.cx - p.r,
    p.cy - p.r,
    p.r * 2,
    p.r * 2
  )
  ctx.restore()

  ctx.font = 'bold 55px "Inter-SB"'
  ctx.fillStyle = '#ffffff'
  ctx.textBaseline = 'middle'
  ctx.textAlign = 'left'
  ctx.fillText(String(name).slice(0, 18), p.cx + p.r + header.gap, p.cy)

  function parseTokens(input) {
    const tokens = []
    const regex = /\(([^)]*)\)/g
    let last = 0
    let match

    while ((match = regex.exec(input)) !== null) {
      if (match.index > last) {
        tokens.push({ text: input.slice(last, match.index), red: false })
      }

      tokens.push({ text: match[1], red: true })
      last = regex.lastIndex
    }

    if (last < input.length) {
      tokens.push({ text: input.slice(last), red: false })
    }

    return tokens
  }

  function wrapTokens(ctx, tokens, maxWidth, fsz) {
    const lines = []
    let curLine = []
    let curW = 0
    const words = []

    for (const tok of tokens) {
      const parts = tok.text.split(/(\s+)/)
      for (const part of parts) {
        if (part !== '') words.push({ text: part, red: tok.red })
      }
    }

    for (const word of words) {
      if (/^\s+$/.test(word.text)) continue

      ctx.font = `bold ${fsz}px "${word.red ? 'Inter-B' : 'Inter-SB'}"`
      const wordW = ctx.measureText(word.text).width

      ctx.font = `bold ${fsz}px "Inter-SB"`
      const spaceW = ctx.measureText(' ').width
      const addW = curLine.length > 0 ? spaceW + wordW : wordW

      if (curW + addW > maxWidth && curLine.length > 0) {
        lines.push(curLine)
        curLine = [{ text: word.text, red: word.red }]
        curW = wordW
      } else {
        if (curLine.length > 0) {
          const last = curLine[curLine.length - 1]

          if (last.red === word.red) {
            last.text += ' ' + word.text
          } else {
            curLine.push({ text: ' ', red: false })
            curLine.push({ text: word.text, red: word.red })
          }

          curW += spaceW + wordW
        } else {
          curLine.push({ text: word.text, red: word.red })
          curW = wordW
        }
      }
    }

    if (curLine.length > 0) lines.push(curLine)
    return lines
  }

  function lineWidth(ctx, segments, fsz) {
    return segments.reduce((sum, seg) => {
      ctx.font = `bold ${fsz}px "${seg.red ? 'Inter-B' : 'Inter-SB'}"`
      return sum + ctx.measureText(seg.text).width
    }, 0)
  }

  function drawScaledText(ctx, input) {
    const tokens = parseTokens(input.trim())

    const MAX_FONT = 65
    const MIN_FONT = 18

    let fsz = MAX_FONT
    let lines
    let totalH
    let lh

    do {
      lh = fsz * 1.25
      lines = wrapTokens(ctx, tokens, safeW, fsz)
      totalH = lines.length * lh

      if (totalH <= safeH) break
      fsz--
    } while (fsz > MIN_FONT)

    if (totalH > safeH) {
      const maxLines = Math.floor(safeH / lh)
      lines = lines.slice(0, maxLines)

      if (lines.length > 0) {
        const lastLine = lines[lines.length - 1]

        ctx.font = `bold ${fsz}px "Inter-SB"`
        const dotsW = ctx.measureText('...').width

        while (lineWidth(ctx, lastLine, fsz) + dotsW > safeW) {
          const last = lastLine[lastLine.length - 1]

          if (!last) break

          if (last.text.length > 1) {
            last.text = last.text.slice(0, -1).trimEnd()
          } else {
            lastLine.pop()
          }
        }

        lastLine.push({ text: '...', red: false })
      }

      totalH = lines.length * lh
    }

    const startY = safeCY - totalH / 2 + lh / 2

    ctx.textBaseline = 'middle'

    for (let i = 0; i < lines.length; i++) {
      const segments = lines[i]
      const totalW = lineWidth(ctx, segments, fsz)

      let x = safeCX - totalW / 2
      const y = startY + i * lh

      for (const seg of segments) {
        ctx.font = `bold ${fsz}px "${seg.red ? 'Inter-B' : 'Inter-SB'}"`
        ctx.fillStyle = seg.red ? '#e51a1a' : '#000000'
        ctx.textAlign = 'left'
        ctx.fillText(seg.text, x, y)
        x += ctx.measureText(seg.text).width
      }
    }
  }

  drawScaledText(ctx, text)

  return await canvas.toBuffer('png')
}

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) {
    return m.reply(
      `Contoh:\n${usedPrefix + command} aku suka banget`
    )
  }

  try {
    await m.react?.('🕒')

    const pp = await getProfile(conn, m)
    const name = await conn.getName(m.sender)
    const buffer = await generateStory(pp, name, text)

    await conn.sendMessage(
      m.chat,
      {
        image: buffer,
        caption: 'Fake story berhasil dibuat ✅'
      },
      { quoted: m }
    )

    await m.react?.('✅')
  } catch (e) {
    await m.react?.('❌')
    m.reply(String(e?.message || e))
  }
}

handler.help = ['igstory <teks>']
handler.tags = ['maker']
handler.command = /^(igstory|fakestory|story)$/i
handler.limit = true

export default handler