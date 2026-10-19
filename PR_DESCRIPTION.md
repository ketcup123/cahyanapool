## Ringkasan
Polish UI untuk halaman publik. Warna, foto, copy, dan routing tidak diubah. Admin tidak tersentuh.

## Yang berubah
- `src/styles/polish.css` (baru, dimuat terakhir): ukuran teks minimal 13px untuk isi dan 11px untuk label, kontras label diperbaiki, target sentuh 44px+, nav dengan indikator aktif, ritme galeri tanpa margin negatif, kontak dan footer lebih rapi.
- Konten hero sekarang sejajar dengan container section lain (sebelumnya meleset 6 sampai 20px).
- `SiteFooter.jsx`: pakai logo asli (sebelumnya ikon daun, beda dengan header), tambah WhatsApp, email, dan alamat.
- Tombol WhatsApp mengambang pindah dari hijau lama ke navy yang sudah ada di palet.
- `index.html`: theme-color ke navy, preconnect font, preload foto hero, meta OG dasar.

## Temuan yang sengaja tidak diubah (di luar scope visual)
1. `HomePage.jsx`: blok "1993 TAHUN MEMBANGUN..." menampilkan tahun berdiri, bukan jumlah tahun. Seharusnya `new Date().getFullYear() - brand.since`.
2. `config.js`: `mapsSearch` menempelkan alamat ke short link Google Maps, jadi URL-nya rusak.
3. `<a href="/#layanan">` di header dan footer memicu reload penuh dari `/portofolio`.
4. `global.css` berisi banyak CSS mati dari dua redesign sebelumnya (`.hero*`, `.service-card`, `.quote-band`, `.editorial-manifesto`). Hapus setelah admin dicek manual.
5. Foto di `public/images` banyak yang 700KB sampai 1MB. Kompres ke WebP.

## Belum diverifikasi
Belum di-build dan belum dilihat di browser. Cek preview Vercel di ukuran 375, 768, dan 1280 sebelum merge.
