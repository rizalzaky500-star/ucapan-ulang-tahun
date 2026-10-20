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

## Deploy ke Vercel

Hubungkan repository ini ke Vercel dan deploy ulang setelah perubahan konfigurasi di-commit. Halaman ucapan dan admin dipublikasikan sebagai file statis:
- **Halaman utama:** `/` atau `/halaman.html`
- **Halaman admin:** `/admin.html` atau `/admin`

Pengaturan admin disimpan di `localStorage`, jadi perubahan hanya berlaku di browser dan domain yang sama.
Saat pertama membuka halaman admin, buat password minimal 6 karakter. Password admin juga hanya berlaku di browser dan domain tersebut; ini gerbang sederhana di sisi klien, bukan autentikasi server-side.
