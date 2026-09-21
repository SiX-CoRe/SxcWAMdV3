import puppeteer from 'puppeteer'
import { addExtra } from 'puppeteer-extra'
import StealthPlugin from 'puppeteer-extra-plugin-stealth'
import crypto from 'crypto'
import fs from 'fs'

const puppeteerExtra = addExtra(puppeteer)
puppeteerExtra.use(StealthPlugin())

const API_URL = 'https://keyyss-react.web.id/api/react'
const FRONTEND_ORIGIN = 'https://keyyss-react.web.id'

class KeyyssReactBot {
    constructor() {
        this.deviceFingerprint = `DEV_${crypto.randomBytes(4).toString('hex')}`
    }

    async sendReaction(waUrl, emojis) {
        const browser = await puppeteerExtra.launch({
            headless: 'new',
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-blink-features=AutomationControlled',
                '--disable-gpu'
            ]
        })

        const page = await browser.newPage()
        await page.setViewport({ width: 390, height: 844 })
        
        const mobileUA = 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Mobile Safari/537.36'
        await page.setUserAgent(mobileUA)

        await page.evaluateOnNewDocument(() => {
            Object.defineProperty(navigator, 'webdriver', { get: () => undefined })
            window.chrome = { runtime: {} }
            Object.defineProperty(navigator, 'languages', { get: () => ['id-ID', 'id', 'en-US', 'en'] })
            Object.defineProperty(navigator, 'platform', { get: () => 'Android' })
        })

        try {
            await page.goto(FRONTEND_ORIGIN, { waitUntil: 'networkidle2', timeout: 30000 })

            // Membuat dummy token turnstile
            const dummyTurnstile = `${crypto.randomBytes(2).toString('hex').toUpperCase()}.${crypto.randomBytes(4).toString('hex').toUpperCase()}.${crypto.randomBytes(2).toString('hex').toUpperCase()}`

            const responseData = await page.evaluate(async (apiUrl, fingerprint, emojis, turnstile, url) => {
                const res = await fetch(apiUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Device-Fingerprint': fingerprint,
                    },
                    body: JSON.stringify({
                        url: url,
                        deviceFingerprint: fingerprint,
                        emojis: emojis,
                        turnstileToken: turnstile
                    })
                })
                
                if (!res.ok) {
                    const errText = await res.text().catch(() => 'Unknown error')
                    throw new Error(`HTTP ${res.status}: ${errText}`)
                }
                return await res.json()
            }, API_URL, this.deviceFingerprint, emojis, dummyTurnstile, waUrl)

            return {
                status: true,
                data: responseData,
                fingerprint: this.deviceFingerprint
            }

        } catch (err) {
            throw err
        } finally {
            await browser.close()
        }
    }
}

let handler = async (m, { conn, args, usedPrefix, command }) => {
    if (!args[0]) {
        return m.reply(
            `❌ Masukkan URL WhatsApp Channel.\n\n` +
            `Contoh:\n` +
            `${usedPrefix + command} https://whatsapp.com/channel/0029... 😂,😭,😆\n\n` + 
            `Saluran Update Sc Sxcwamd: https://whatsapp.com/channel/0029Vb7XYjLKgsNyWrRHL10k`
        )
    }

    const waUrl = args[0]
    const rawEmojis = args.slice(1).join(' ')

    if (!/^https?:\/\/(www\.)?whatsapp\.com\/channel\//i.test(waUrl)) {
        return m.reply('❌ URL harus berupa link WhatsApp Channel yang valid.')
    }

    let emojis = '😂,,,'
    if (rawEmojis) {
        emojis = rawEmojis.split(',').map(r => r.trim()).filter(Boolean).join(',')
        const parts = rawEmojis.split(',')
        while (emojis.split(',').length < parts.length) emojis += ','
    }

    await m.reply(
        `⏳ *Memproses reaction dengan browser (Puppeteer)...*\n\n` +
        `🔗 Target: ${waUrl}\n` +
        `😀 Emoji: ${emojis}`
    )

    const bot = new KeyyssReactBot()
    
    try {
        const result = await bot.sendReaction(waUrl, emojis)
        
        if (result && result.status) {
            const data = result.data
            
            let textResult = `✅ *REACTION BERHASIL!*\n\n`
            textResult += `🔗 *Target:* ${waUrl}\n`
            textResult += `😀 *Emoji:* ${emojis}\n`
            textResult += `🕵️ *Fingerprint:* ${result.fingerprint}\n`

            if (data?.newLimit !== undefined) {
                textResult += `📊 *Limit:* ${data.newLimit}\n`
            }
            if (data?.cooldownRemainingSeconds !== undefined) {
                textResult += `⏳ *Cooldown:* ${data.cooldownRemainingSeconds}s\n`
            }
            if (data?.message) {
                textResult += `💬 *Message:* ${data.message}\n`
            }

            textResult += `\n📦 *Response:*\n`
            textResult += '```json\n'
            textResult += JSON.stringify(data, null, 2)
            textResult += '\n```'

            await m.reply(textResult)
        }
    } catch (error) {
        console.error('[Keyyss React Puppeteer]', error)
        await m.reply(`❌ *Reaction gagal!*\n\nError: ${error.message}`)
    }
}

handler.help = ['wareact <url> <emoji>']
handler.tags = ['tools']
handler.command = /^(wareact|rch)$/i

export default handler