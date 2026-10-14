# CahyanaPool — panduan build dan deployment

## Stack
- React + Vite + JavaScript + plain CSS
- React Router
- Aset foto proyek dari `public/images`
- Supabase PostgreSQL disiapkan sebagai backend target melalui `supabase/schema.sql`

## Jalankan secara lokal
1. Instal Node.js versi LTS.
2. Jalankan `npm install`.
3. Salin `.env.example` menjadi `.env.local`.
4. Isi konfigurasi kontak yang benar dan nomor WhatsApp dalam format internasional, hanya angka. Contoh format Indonesia: `62812...` (jangan memakai tanda `+`, spasi, atau tanda hubung).
5. Jalankan `npm run dev`.

## Build produksi
- Jalankan `npm run build`.
- Hasil build dibuat ke folder `dist/`.
- Upload isi `dist/` ke document root hosting statis.
- Atur hosting agar URL SPA seperti `/portofolio` dan `/admin` mengarah ke `index.html`. Pada Hostinger, gunakan konfigurasi rewrite yang disediakan pada bagian berikut.

Tambahkan file `.htaccess` berikut ke `public/` sebelum build jika hosting menggunakan Apache:
```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

## Kontak yang perlu dikonfirmasi sebelum domain dipublikasikan
- Nomor WhatsApp utama dan nomor per layanan. Saat ini nomor belum diberikan, sehingga tombol WhatsApp mengarah ke bagian informasi kontak sampai nomor dikonfigurasi.
- Email yang digunakan pada situs ditulis sebagai `ganteng.bgt23@gmail.com`; pastikan alamat tersebut benar dan dapat menerima email.
- Alamat ditampilkan sebagai `Jalan Masjid Al-akhyar No.45E RT.40/RW.02`. Tautan peta membuka pencarian Google Maps berdasarkan alamat tersebut; pastikan pin yang dipilih benar.
- Tautan Instagram dan TikTok memakai akun `@aloshaavisal` dan `@inialosha`; pastikan akun tersebut milik bisnis dan boleh dipublikasikan.

## Backend Supabase
1. Buat proyek Supabase.
2. Jalankan `supabase/schema.sql` di SQL Editor.
3. Buat akun pemilik melalui Supabase Auth.
4. Masukkan UUID akun tersebut ke `public.user_roles` dengan role `admin`.
5. Jangan publikasikan `service_role` key. Kunci tersebut tidak boleh berada di variabel `VITE_*` atau bundle frontend.
6. Sebelum mengaktifkan pengelolaan foto, implementasikan koneksi SDK, kebijakan Storage, dan URL bertanda tangan (signed URLs) untuk bucket privat.

**Status penting:** website publik memakai galeri foto lokal dan dapat dibangun sebagai frontend statis. Panel `/admin` sengaja tidak mengizinkan pengelolaan foto sampai autentikasi dan penyimpanan backend diintegrasikan. Jangan menganggap pengelolaan foto dari browser sebagai penyimpanan produksi.
