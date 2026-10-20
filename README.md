# Website Ucapan Selamat Ulang Tahun 🎉

Website interaktif untuk ucapan selamat ulang tahun dilengkapi dengan efek kembang api (confetti) dan panel admin untuk mengubah nama serta umur secara dinamis.
Lagu `laguwae.mpeg` diputar berulang setelah kartu ucapan dibuka.

## Cara Menggunakan (Node.js Localhost & Network)

### 1. Jalankan Server
Gunakan perintah berikut untuk menjalankan server Node.js:
```bash
npm start
```
atau langsung menggunakan Node.js:
```bash
node server.js
```

### 2. Akses Website
- **Localhost:** `http://localhost:3000/`
- **Network (HP / Perangkat lain dalam 1 Wi-Fi):** `http://<IP-KOMPUTER>:3000/` (IP otomatis ditampilkan di terminal saat server berjalan)
- **Halaman Admin:** `http://localhost:3000/admin.html`

## Konfigurasi Database MongoDB

Pengaturan nama dan umur disimpan pada database `ultah`, collection `main`, menggunakan satu dokumen dengan `_id: "birthday"`. Untuk menjalankan secara lokal, atur `MONGODB_URI`, `ADMIN_PASSWORD`, dan `ADMIN_SESSION_SECRET` di file `.env`. Gunakan kata sandi admin yang kuat dan secret acak minimal 32 karakter. Jangan masukkan kredensial database atau kata sandi ke kode frontend atau commit file `.env`.

Panel admin dan halaman ucapan membaca serta menyimpan pengaturan melalui endpoint `/api/settings`.

## Deploy ke Vercel

Hubungkan repository ini ke Vercel dan deploy ulang setelah perubahan konfigurasi di-commit. Tambahkan `MONGODB_URI`, `ADMIN_PASSWORD`, dan `ADMIN_SESSION_SECRET` di **Project Settings → Environment Variables**. Halaman ucapan dan admin dipublikasikan sebagai file statis, sedangkan endpoint berjalan sebagai function:
- **Halaman utama:** `/` atau `/halaman.html`
- **Halaman admin:** `/admin.html` atau `/admin`
- **API pengaturan:** `/api/settings`
- **API sesi admin:** `/api/session`
