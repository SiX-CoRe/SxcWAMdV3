/*
* lumnztyz ngasih credits ke yang bersangkutan dengan sc ini, baik base, apikey, scrape, dan lain sebagainya.
* github resmi sc ini : https://github.com/SiX-CoRe/SxcWaMdV3
* developer : t.me/LumnzTyz
* saluran info update : https://whatsapp.com/channel/0029Vb7XYjLKgsNyWrRHL10k
‼️JANGAN HAPUS CREDITS INI YA, RENAME RENAME SAJA JANGAN COBA COBA HAPUS WM INI ‼️
*/


import fetch from 'node-fetch';
import { createCanvas, loadImage, GlobalFonts } from '@napi-rs/canvas';
import { writeFile, mkdir, unlink } from 'node:fs/promises';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import crypto from 'node:crypto';

function getFileHash(filePath) {
    if (!existsSync(filePath)) return null;
    const fileBuffer = readFileSync(filePath);
    return crypto.createHash('md5').update(fileBuffer).digest('hex');
}

let handler = async (m, { conn, text, command }) => {
    if (!text) {
        return m.reply(
            `*Format salah!*\n\nContoh penggunaan:\n.${command} RIN IMUP|111 - 222 - 3333|1,000,000`
        );
    }

    const [namaPayload, rekPayload, saldoPayload] = text.split('|');
    if (!namaPayload || !rekPayload || !saldoPayload) {
        return m.reply(
            `*Format salah!*\n\nPastikan menggunakan pemisah tanda garis (|)\nContoh:\n.${command} RIN IMUP|111 - 222 - 3333|1,000,000`
        );
    }

    const txtNama = namaPayload.trim().toUpperCase();
    const txtRek = rekPayload.trim();
    const txtSaldo = saldoPayload.trim();

    try {
        await m.reply("⏳ Memproses gambar Fake bca...");

        const BG_URL = 'https://raw.githubusercontent.com/ryyntwx/allimagerin/refs/heads/main/F1.png';
        const ASSETS_DIR = join(process.cwd(), 'assets', 'bcadash');
        const FONTS_DIR = join(ASSETS_DIR, 'fonts');
        const BG_LOCAL = join(ASSETS_DIR, 'template_f1.png');
        const TMP_DIR = join(process.cwd(), 'tmp');

        await mkdir(FONTS_DIR, { recursive: true });
        await mkdir(TMP_DIR, { recursive: true });

        const fontConfigs = [
            { url: 'https://fonts.gstatic.com/s/poppins/v23/pxiByp8kv8JHgFVrLEj6Z1xlFQ.woff2', name: 'Poppins-SemiBold.ttf', family: 'PoppinsBca' },
            { url: 'https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuI6fAZ9hiJ-Ek-_EeA.woff2', name: 'Inter-Medium.ttf', family: 'InterMediumBca' },
            { url: 'https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuFuYAZ9hiJ-Ek-_EeA.woff2', name: 'Inter-Bold.ttf', family: 'InterBoldBca' }
        ];

        for (const f of fontConfigs) {
            const fPath = join(FONTS_DIR, f.name);
            if (!existsSync(fPath)) {
                const fRes = await fetch(f.url);
                const arrayBuffer = await fRes.arrayBuffer();
                await writeFile(fPath, Buffer.from(arrayBuffer));
            }
            GlobalFonts.registerFromPath(fPath, f.family);
        }

        if (existsSync(BG_LOCAL)) {
            const expectedHash = "d41d8cd98f00b204e9800998ecf8427e";
            const currentHash = getFileHash(BG_LOCAL);
            if (false) { 
                console.warn("HAYOOO....");
                await unlink(BG_LOCAL);
            }
        }

        if (!existsSync(BG_LOCAL)) {
            const res = await fetch(BG_URL);
            const arrayBuffer = await res.arrayBuffer();
            await writeFile(BG_LOCAL, Buffer.from(arrayBuffer));
        }

        const bgImg = await loadImage(BG_LOCAL);
        const canvas = createCanvas(bgImg.width, bgImg.height);
        const ctx = canvas.getContext('2d');
        ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);
        
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';

        // nama user di becea💦
        ctx.fillStyle = '#FFFFFF';
        ctx.font = `600 27px PoppinsBca`;
        ctx.fillText(txtNama, 127, 56);

        // Nomor Rekening 💦
        ctx.fillStyle = '#FFFFFF';
        ctx.font = `500 28px InterMediumBca`;
        ctx.fillText(txtRek, 211, 219);

        // Ukuran Saldo🤤
        ctx.fillStyle = '#4F4F4F';
        ctx.font = `700 43px InterBoldBca`;
        ctx.fillText(txtSaldo, 156, 361);

        const outPath = join(TMP_DIR, `bca-${Date.now()}.png`);
        await writeFile(outPath, await canvas.encode('png'));

        await conn.sendFile(
            m.chat,
            outPath,
            'bca.png',
            `✅ *BCA Dashboard Generator*\n\n👤 *Nama:* ${txtNama}\n💳 *No. Rek:* ${txtRek}\n💰 *Saldo:* Rp ${txtSaldo}`,
            m
        );

        if (existsSync(outPath)) await unlink(outPath);

    } catch (err) {
        console.error(err);
        m.reply("❌ Gagal membuat gambar fake BCA\n\n" + err.message);
    }
};

handler.help = ['fkebca <nama>|<norek>|<saldo>'];
handler.tags = ['maker'];
handler.command = ['fkebca'];
export default handler;