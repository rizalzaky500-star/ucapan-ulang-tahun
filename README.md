# Website Ucapan Selamat Ulang Tahun 🎉

Website interaktif untuk ucapan selamat ulang tahun dilengkapi dengan efek kembang api (confetti) dan panel admin untuk mengubah nama serta umur secara dinamis.
Lagu `public/laguwae.mpeg` diputar berulang setelah kartu ucapan dibuka.

## Cara Menggunakan (Vite, Node.js Localhost & Network)

### Pengembangan
Jalankan Vite untuk halaman HTML dan API lokal:
```bash
npm run dev
```

Vite menampilkan alamat lokal, biasanya `http://localhost:5173/`. Halaman admin tersedia di `/admin.html`.

### Build dan Jalankan Server
Untuk membuat build HTML statis dan menjalankan server Node.js beserta API MongoDB:
```bash
npm start
```
Perintah ini membangun file ke folder `dist/` lalu menjalankan server pada port 3000.

### 2. Akses Website
- **Development:** alamat yang dicetak Vite di terminal
- **Build/server:** `http://localhost:3000/`
- **Halaman Admin:** `/admin.html` pada alamat server yang digunakan

## Konfigurasi Database MongoDB

Pengaturan nama dan umur disimpan pada database `ultah`, collection `main`, menggunakan satu dokumen dengan `_id: "birthday"`. Untuk menjalankan secara lokal, atur `MONGODB_URI`, `ADMIN_PASSWORD`, dan `ADMIN_SESSION_SECRET` di file `.env`. Gunakan kata sandi admin yang kuat dan secret acak minimal 32 karakter. Jangan masukkan kredensial database atau kata sandi ke kode frontend atau commit file `.env`.

Vite menyajikan halaman HTML saat pengembangan, sedangkan endpoint `/api/settings` dan `/api/session` tetap berjalan di server Node.js.

## Deploy ke Vercel

Hubungkan repository ini ke Vercel dan deploy ulang setelah perubahan konfigurasi di-commit. Tambahkan `MONGODB_URI`, `ADMIN_PASSWORD`, dan `ADMIN_SESSION_SECRET` di **Project Settings → Environment Variables**. Halaman ucapan dan admin dipublikasikan sebagai file statis, sedangkan endpoint berjalan sebagai function:
- **Halaman utama:** `/` atau `/halaman.html`
- **Halaman admin:** `/admin.html` atau `/admin`
- **API pengaturan:** `/api/settings`
- **API sesi admin:** `/api/session`
