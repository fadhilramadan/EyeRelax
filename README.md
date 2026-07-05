# EyeRelax — Web App Senam & Relaksasi Mata

Aplikasi web minimalis lokal untuk membantu merilekskan otot mata dan mengurangi ketegangan mata digital (*digital eyestrain*) dengan mengikuti gerakan bola visual.

## Filosofi Desain

- **Swiss Design (International Typographic Style):** Tata letak bersih, berbasis grid, tipografi sans-serif (Inter), asimetri yang seimbang, dan ruang negatif (*whitespace*) yang generous.
- **Apple Human Interface Guidelines (HIG):** Fokus utama pada konten (bola bergerak), transisi dan animasi yang natural, serta skema warna yang menenangkan.

## Fitur Utama

1. **10 Pola Gerakan Mata:** Latihan bervariasi termasuk Horizontal, Vertikal, Diagonal, Melingkar, Angka 8, Kotak, Latihan Fokus (Fokus Jauh-Dekat), Kedipan Mata (Blink Reminder), Gerakan Acak (Random Drift), dan Panduan Napas (Breathing Guide).
2. **Preset Routine:** Pilihan instan seperti *Quick Break* (~2 menit), *Full Routine* (~5 menit), dan *Deep Relax* (~8 menit).
3. **Penyetelan Kecepatan Sangat Variatif:** Slider kecepatan dari 0.1x hingga 4.0x untuk kenyamanan penuh.
4. **Kustomisasi Ukuran & Warna Bola:** Pengaturan ukuran bola dan pilihan warna aksen dari palet yang harmoni.
5. **Panduan Jarak Aman:** Peringatan jarak aman mata ke monitor (~satu lengan) sebelum memulai.
6. **Aksesibilitas Tinggi:** Navigasi keyboard penuh, ramah screen reader, serta dukungan `prefers-reduced-motion` (kecepatan dikurangi 50%).
7. **Offline-First:** Tidak ada dependensi eksternal, dapat dijalankan offline sepenuhnya hanya dengan membuka file `index.html`.

## Cara Menjalankan

1. Ekstrak folder proyek.
2. Klik dua kali (atau buka) file `index.html` langsung di browser Chrome, Firefox, Safari, atau Edge Anda.
3. Tidak diperlukan instalasi `npm` atau server lokal.

## Kontrol Keyboard

- `Space`: Memulai, menjeda, melanjutkan sesi, atau melewati panduan jarak.
- `←` / `→`: Pindah ke gerakan sebelumnya/berikutnya.
- `S`: Membuka/menutup menu pengaturan.
- `T`: Mengubah tema (Terang / Gelap).
- `F`: Mengaktifkan/menonaktifkan mode layar penuh (*fullscreen*).
- `1-9`: Lompat langsung ke nomor gerakan dalam routine.
- `Esc`: Menutup pengaturan atau keluar dari layar penuh.

## Struktur Folder

```
eyerelax/
├── index.html              # Halaman utama
├── css/
│   ├── style.css           # Stylesheet layout & komponen
│   ├── animation.css       # Animasi transisi & visual bola
│   └── themes.css          # Variabel warna light/dark theme
├── js/
│   ├── app.js              # Main app controller & state
│   ├── engine.js           # Animation loop (requestAnimationFrame)
│   ├── patterns.js         # Definisi lintasan gerakan mata
│   ├── presets.js          # Konfigurasi preset routine
│   ├── ui.js               # Kontrol antarmuka & DOM
│   └── storage.js          # Penyimpanan preferensi lokal
└── assets/
    └── favicon.svg         # Favicon minimalis
```
