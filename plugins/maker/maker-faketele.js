/*
* lumnztyz ngasih credits ke yang bersangkutan dengan sc ini, baik base, apikey, scrape, dan lain sebagainya.
* github resmi sc ini : https://github.com/SiX-CoRe/SxcWaMdV3
* developer : t.me/LumnzTyz
* saluran info update : https://whatsapp.com/channel/0029Vb7XYjLKgsNyWrRHL10k
‼️JANGAN HAPUS CREDITS INI YA, RENAME RENAME SAJA JANGAN COBA COBA HAPUS TEKS INI ‼️
*/

import { createCanvas, loadImage, GlobalFonts } from '@napi-rs/canvas';
import { writeFile, mkdir } from 'node:fs/promises';
import { existsSync, unlinkSync } from 'node:fs';
import { join } from 'node:path';
import axios from 'axios';

let fontBufferCache = null;
let fontRegistered = false;
const FONT_NAME = 'TeleRobotoMono';

let handler = async (m, { conn, text, command, usedPrefix }) => {
    let q = m.quoted ? m.quoted : m;
    let mime = (q.msg || q).mimetype || '';

    if (!/image/.test(mime)) {
        return m.reply(`*Format Salah!*\n\nHarap reply/kirim gambar untuk Foto Profil (PP) lalu masukkan teks format:\n\n*Contoh:* ${usedPrefix + command} Nama | Nomor HP | Bio | Username`);
    }

    if (!text) {
        return m.reply(`*Format Teks Kosong!*\n\nContoh Penggunaan:\n${usedPrefix + command} Nama | Nomor HP | Bio | Username`);
    }

    let [namaInput, ponselInput, bioInput, userInput] = text.split('|').map(v => v ? v.trim() : '');

    if (!namaInput || !ponselInput || !bioInput || !userInput) {
        return m.reply(`*Semua Input Wajib Diisi!*\n\nFormat lengkap:\n${usedPrefix + command} Nama | Nomor HP | Bio | Username`);
    }

    try {
        await m.reply("⏳ Memproses Fake Telegram Profile...");

        let ppBuffer = await q.download();

        const ASSETS_DIR = join(process.cwd(), 'assets', 'faketele');
        const BG_LOCAL = join(ASSETS_DIR, 'bg_tele.png');
        const TMP_DIR = join(process.cwd(), 'tmp');

        const TTF_URL = 'https://cdn.jsdelivr.net/fontsource/fonts/roboto-mono@latest/latin-700-normal.ttf';
        const BG_URL = 'https://raw.githubusercontent.com/ryyntwx/Image-rinn/refs/heads/main/c8ac4ffc-618c-411c-b36c-45c06c7e5a5e.png';

        await mkdir(ASSETS_DIR, { recursive: true });
        await mkdir(TMP_DIR, { recursive: true });

        if (!fontRegistered) {
            try {
                if (!fontBufferCache) {
                    const fontRes = await axios.get(TTF_URL, {
                        responseType: 'arraybuffer',
                        headers: { 'User-Agent': 'Mozilla/5.0' }
                    });
                    fontBufferCache = Buffer.from(fontRes.data);
                }
                
                fontRegistered = GlobalFonts.register(fontBufferCache, FONT_NAME);
            } catch (errFont) {
                console.error("Gagal load font, menggunakan fallback system font:", errFont.message);
            }
        }

        const fontFamily = fontRegistered ? FONT_NAME : 'sans-serif';

        if (!existsSync(BG_LOCAL)) {
            const bgRes = await axios.get(BG_URL, { 
                responseType: 'arraybuffer', 
                headers: { 'User-Agent': 'Mozilla/5.0' } 
            });
            await writeFile(BG_LOCAL, Buffer.from(bgRes.data));
        }

        const bgImg = await loadImage(BG_LOCAL);
        const ppImg = await loadImage(ppBuffer);

        const canvas = createCanvas(bgImg.width, bgImg.height);
        const ctx = canvas.getContext('2d');

        ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);

        let nama = namaInput;
        let ponsel = ponselInput;
        let bio = bioInput;
        let username = userInput.startsWith('@') ? userInput : '@' + userInput;

        const config = {
            pp: { x: 571, y: 244, r: 137 },
            nama: { y: 448, size: 50 },
            ponsel: { x: 80, y: 883, size: 35 },
            bio: { x: 83, y: 996, size: 36 },
            username: { x: 83, y: 1143, size: 38 }
        };

        // Pp ukuran kecil
        ctx.save();
        ctx.beginPath();
        ctx.arc(config.pp.x, config.pp.y, config.pp.r, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.clip();
        ctx.drawImage(ppImg, config.pp.x - config.pp.r, config.pp.y - config.pp.r, config.pp.r * 2, config.pp.r * 2);
        ctx.restore();

        // nama
        ctx.fillStyle = '#FFFFFF';
        ctx.font = `bold ${config.nama.size}px ${fontFamily}`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(nama, canvas.width / 2, config.nama.y);

        // nomor hp
        ctx.textAlign = 'left';
        ctx.font = `${config.ponsel.size}px ${fontFamily}`;
        ctx.fillText(ponsel, config.ponsel.x, config.ponsel.y);

        // bio
        ctx.font = `${config.bio.size}px ${fontFamily}`;
        ctx.fillText(bio, config.bio.x, config.bio.y);

        // usernamee
        ctx.font = `${config.username.size}px ${fontFamily}`;
        ctx.fillText(username, config.username.x, config.username.y);

        const outPath = join(TMP_DIR, `faketele-${Date.now()}.png`);
        await writeFile(outPath, await canvas.encode('png'));

        await conn.sendFile(m.chat, outPath, 'faketele.png', `— *FAKE TELEGRAM PROFILE* —\n\n👤 *Nama:* ${nama}\n📞 *Ponsel:* ${ponsel}\n📝 *Bio:* ${bio}\n🏷️ *User:* ${username}`, m);

        if (existsSync(outPath)) unlinkSync(outPath);

    } catch (e) {
        console.error(e);
        m.reply("❌ Gagal membuat Fake Telegram Profile\n\n" + e.message);
    }
};

handler.help = ['faketele <Nama | Nomor | Bio | Username>'];
handler.tags = ['maker'];
handler.command = ['faketele', 'faketelegram'];

export default handler;