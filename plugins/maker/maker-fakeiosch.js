/*
* lumnztyz ngasih credits ke yang bersangkutan dengan sc ini, baik base, apikey, scrape, dan lain sebagainya.
* github resmi sc ini : https://github.com/SiX-CoRe/SxcWaMdV3
* developer : t.me/LumnzTyz
* saluran info update : https://whatsapp.com/channel/0029Vb7XYjLKgsNyWrRHL10k
‼️JANGAN HAPUS CREDITS INI YA, RENAME RENAME SAJA JANGAN COBA COBA HAPUS TEKS INI ‼️
*/

import { createCanvas, loadImage, GlobalFonts } from '@napi-rs/canvas';
import { writeFile, mkdir, stat, unlink } from 'node:fs/promises';
import { existsSync, unlinkSync } from 'node:fs';
import { join } from 'node:path';
import axios from 'axios';

let handler = async (m, { conn, text, command, usedPrefix }) => {
    let q = m.quoted ? m.quoted : m;
    let mime = (q.msg || q).mimetype || '';

    if (!/image/.test(mime)) {
        return m.reply(`*Format Salah!*\n\nHarap reply/kirim gambar untuk foto profil saluran, lalu masukkan format teks:\n\n*Contoh:* ${usedPrefix + command} SXCWAMD|3.621|13.10`);
    }

    if (!text) {
        return m.reply(`*Format Teks Kosong!*\n\n*Penggunaan:* ${usedPrefix + command} Nama Saluran | Jumlah Pengikut | Jam\n*Contoh:* ${usedPrefix + command} SXCWAMD|3.621|13.10`);
    }

    let [namaInput, pengikutInput, jamInput] = text.split('|').map(v => v ? v.trim() : '');

    if (!namaInput || !pengikutInput || !jamInput) {
        return m.reply(`*Input Tidak Lengkap!*\n\nPastikan diisi 3 parameter:\n*Contoh:* ${usedPrefix + command} SXCWAMD|3.621|13.10`);
    }

    try {
        await m.reply("⏳ Memproses Fake CH iOS...");

        let ppBuffer = await q.download();

        const ASSETS_DIR = join(process.cwd(), 'assets', 'fakech');
        const FONTS_DIR = join(ASSETS_DIR, 'fonts');
        const BG_LOCAL = join(ASSETS_DIR, 'bg_fakech.png');
        const TMP_DIR = join(process.cwd(), 'tmp');

        await mkdir(FONTS_DIR, { recursive: true });
        await mkdir(TMP_DIR, { recursive: true });

        const fonts = [
            {
                url: 'https://fonts.gstatic.com/s/inter/v13/UcC73FwrK3iLTeHuS_fvQtMwCp50KnMa1ZL7W0Q5nw.woff2', 
                name: 'Inter-Black-900.woff2', 
                family: 'Inter', 
                weight: '900' 
            },
            {
                url: 'https://fonts.gstatic.com/s/inter/v13/UcC73FwrK3iLTeHuS_fvQtMwCp50KnMa1ZL7W0Q5nw.woff2', 
                name: 'Inter-Medium-500.woff2', 
                family: 'Inter', 
                weight: '500' 
            },
            {
                url: 'https://fonts.gstatic.com/s/inter/v13/UcC73FwrK3iLTeHuS_fvQtMwCp50KnMa1ZL7W0Q5nw.woff2', 
                name: 'Inter-Bold-700.woff2', 
                family: 'Inter', 
                weight: '700' 
            }
        ];

        for (const f of fonts) {
            const fPath = join(FONTS_DIR, f.name);
            let isValid = false;

            if (existsSync(fPath)) {
                const fileStat = await stat(fPath);
                if (fileStat.size > 2000) { 
                    isValid = true;
                } else {
                    await unlink(fPath);
                }
            }

            if (!isValid) {
                const fRes = await axios.get(f.url, { 
                    responseType: 'arraybuffer', 
                    headers: { 'User-Agent': 'Mozilla/5.0' },
                    timeout: 15000
                });
                await writeFile(fPath, Buffer.from(fRes.data));
            }

            try {
                GlobalFonts.registerFromPath(fPath, f.family);
            } catch (err) {
                console.warn(`Font warning [${f.name}]:`, err.message);
            }
        }

        const BG_URL = 'https://raw.githubusercontent.com/ryyntwx/Image-rinn/refs/heads/main/153a185e-f1de-4078-8042-fdfc56592c3d.png';
        if (!existsSync(BG_LOCAL)) {
            const bgRes = await axios.get(BG_URL, { responseType: 'arraybuffer', headers: { 'User-Agent': 'Mozilla/5.0' } });
            await writeFile(BG_LOCAL, Buffer.from(bgRes.data));
        }

        const bgImg = await loadImage(BG_LOCAL);
        const ppImg = await loadImage(ppBuffer);

        const canvas = createCanvas(bgImg.width, bgImg.height);
        const ctx = canvas.getContext('2d');

        ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);

        let namaText = namaInput;
        let pengikutText = `${pengikutInput} pengikut`;
        let jamText = jamInput;

        const config = {
            pp: { x: 585, y: 622, r: 213 },
            nama: { y: 908, maxSize: 68, maxWidth: 1000 },
            pengikut: { y: 995, size: 45 },
            jam: { x: 116, y: 63, size: 43 }
        };

        // pp
        ctx.save();
        ctx.beginPath();
        ctx.arc(config.pp.x, config.pp.y, config.pp.r, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.clip();
        ctx.drawImage(ppImg, config.pp.x - config.pp.r, config.pp.y - config.pp.r, config.pp.r * 2, config.pp.r * 2);
        ctx.restore();

        // nama salurann
        ctx.fillStyle = '#FFFFFF';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        let fontSize = config.nama.maxSize;
        ctx.font = `900 ${fontSize}px Inter, sans-serif`;

        while (ctx.measureText(namaText).width > config.nama.maxWidth && fontSize > 14) {
            fontSize -= 2;
            ctx.font = `900 ${fontSize}px Inter, sans-serif`;
        }
        ctx.fillText(namaText, canvas.width / 2, config.nama.y);

        // pengikuT
        ctx.fillStyle = '#8E8E93';
        ctx.font = `500 ${config.pengikut.size}px Inter, sans-serif`;
        ctx.fillText(pengikutText, canvas.width / 2, config.pengikut.y);

        // jamm
        ctx.fillStyle = '#FFFFFF';
        ctx.font = `700 ${config.jam.size}px Inter, sans-serif`;
        ctx.textAlign = 'center';
        ctx.fillText(jamText, config.jam.x, config.jam.y);

        const outPath = join(TMP_DIR, `fakech-${Date.now()}.png`);
        await writeFile(outPath, await canvas.encode('png'));

        let captionText = `— *FAKE CH IOS* —\n\n✎ *Nama :* ${namaText}\n✎ *Pengikut :* ${pengikutText}\n✎ *Jam :* ${jamText}`;

        await conn.sendFile(m.chat, outPath, 'fakech.png', captionText, m);

        if (existsSync(outPath)) unlinkSync(outPath);

    } catch (e) {
        console.error(e);
        m.reply("❌ Terjadi kesalahan saat memproses gambar\n\n" + e.message);
    }
};

handler.help = ['fakech <Nama | Pengikut | Jam>'];
handler.tags = ['maker'];
handler.command = ['fakech', 'fakechannel'];

export default handler;