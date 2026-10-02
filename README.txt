# WebGIS Semarang

## Menjalankan aplikasi

Chatbot memerlukan backend Node.js dan koneksi internet ke Groq, jadi halaman tidak dapat dibuka dengan klik dua kali (`file://`). Gunakan Node.js 20.6 atau lebih baru.

1. Salin `.env.example` menjadi `.env`.
2. Isi `GROQ_API_KEY` di `.env` dengan key Groq yang masih aktif. Jangan masukkan file `.env` ke Git.
3. Jalankan `npm.cmd start` dari folder proyek PowerShell.
4. Buka `http://localhost:3000/map.html`.

Tidak perlu memasang atau mengunduh model lokal. Jangan masukkan API key asli ke `.env.example` atau ke Git.
Skrip lokal `upload_cases_to_supabase.py` sengaja tidak disertakan karena memuat service-role key; pindahkan key ke environment variable sebelum membagikan skrip tersebut.

## Konteks chatbot

Chatbot menggunakan filter penyakit/tahun aktif, ringkasan kasus per kecamatan, rincian jenis kelamin dan kematian, tren bulanan, serta zona aksesibilitas. Untuk pertanyaan di luar data peta, chatbot dapat menjawab sebagai pengetahuan umum dan menandai bahwa jawabannya bukan analisis data Semarang. Chatbot tidak memiliki akses pencarian web.

## Deploy

Deploy aplikasi pada hosting yang mendukung Node.js. Atur `GROQ_API_KEY`, `GROQ_MODEL` (opsional), dan `PORT` sebagai environment variables di hosting, lalu jalankan `node server.js`. Jangan deploy `.env` atau membagikan API key di sisi browser.
