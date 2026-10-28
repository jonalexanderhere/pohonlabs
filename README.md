# Pohonlab

Web app pembelajaran Matematika Diskrit berdasarkan `Pohon.pdf` (52 halaman). Dibuat dengan JavaScript, CSS, dan Vite, tanpa backend atau API key.

## Menjalankan

Gunakan Node.js 22.12+ atau 24 LTS.

```sh
npm install
npm run dev
```

## Verifikasi

```sh
npm test
npm run build
npm run preview
```

## Deploy ke Vercel

1. Push folder proyek ini ke repository GitHub (jangan sertakan node_modules).
2. Di Vercel, pilih Add New → Project dan impor repository tersebut.
3. Root Directory: folder yang berisi package.json. Framework Preset: Vite.
4. Build Command: npm run build. Output Directory: dist.
5. Klik Deploy. Tidak ada environment variable yang diperlukan.

Konfigurasi tersedia di vercel.json. Alternatif dari folder proyek: `npx vercel` (login akun Vercel diperlukan). Navigasi menggunakan hash sehingga tidak memerlukan rewrite server.

Panduan resmi: https://vite.dev/guide/static-deploy#vercel dan https://vercel.com/docs/builds/configure-a-build

## Fitur

- Ringkasan belajar dan progres lokal menggunakan localStorage.
- Materi pohon, hutan, sifat, terminologi, n-ary, biner, dan aplikasi.
- Prim dan Kruskal langkah demi langkah, putar otomatis, jeda, ulangi, dan bobot kumulatif.
- BST dengan input sendiri, preorder, inorder, dan postorder.
- Huffman untuk teks sendiri, tabel frekuensi, kode, dan ukuran payload.
- Lima soal dengan umpan balik dan pembahasan.
- PDF sumber bisa dibuka dari aplikasi.
- Layout responsif dan kontrol yang dapat diakses dengan keyboard.

## Catatan materi

Graf contoh mengikuti tabel sisi halaman 19; MST berbobot 105. Pohon pencarian biner dibangun dari data halaman 44, dengan nilai 60 sesuai daftar data (diagram PDF memiliki salah ketik). Kode Huffman dihitung dari frekuensi aktual; pengurangan ukuran tidak menghitung overhead tabel kode. Materi ditulis ulang, dengan tautan halaman sumber. Kuis adalah soal konsep tambahan, bukan salinan lima soal latihan akhir PDF. Menu Solver mencakup kelima soal latihan halaman 48–52. Progres tersimpan per browser, tanpa akun atau sinkronisasi.

Font Google Fonts memiliki fallback sans-serif. Semua algoritma berjalan lokal di browser.


## Solver soal

Buka `#solver` melalui menu **Solver soal** atau tombol di ringkasan.

- Koin palsu: strategi adaptif untuk 8 koin, satu palsu lebih berat/ringan, maksimal 3 penimbangan. Pilih hasil neraca; pohon keputusan lengkap dan verifikasi 16 kasus tersedia.
- Pohon 4-ary: input relasi `orangtua: anak1 anak2 ...`, visualisasi dan tiga traversal. Inorder memakai konvensi anak pertama, akar, lalu anak-anak lainnya; definisi ini tidak universal untuk pohon nonbiner.
- Tenis: enumerasi seluruh urutan yang berhenti saat target total atau streak tercapai; preset PDF menghasilkan 10 urutan. Target total dapat diubah 2–5 dan streak 2–3.
- MST: input simpul dan sisi berbobot sendiri, Kruskal, visualisasi, total bobot, dan alasan penerimaan/penolakan sisi. Preset soal halaman 51 menghasilkan bobot 22. Graf terpisah menghasilkan hutan minimum dan pemberitahuan bahwa MST tunggal tidak ada.
- BST: input huruf atau angka, visualisasi dan tiga traversal; preset karakter dari halaman 52. Duplikat diabaikan.

Jawaban MST, traversal, BST, dan tenis dapat diunduh sebagai teks. Semua proses berjalan lokal tanpa layanan AI, backend, atau API key. Input solver dipertahankan selama perpindahan menu dalam sesi halaman; refresh mengembalikan preset. Pengujian mencakup seluruh 16 kasus koin, enumerasi semua spanning tree graf PDF untuk memverifikasi MST, dan kondisi terminasi tenis.
