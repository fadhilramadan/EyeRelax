***

# PRD: EyeRelax — Web App Senam & Relaksasi Mata

## Dokumen Versi: 1.0 | Tanggal: 02 Juli 2026

***

## 1. Ringkasan Produk (Product Overview)

**EyeRelax** adalah web aplikasi lokal (tanpa framework) yang menampilkan bola/lingkaran bergerak di layar yang diikuti oleh kedua mata pengguna untuk merilekskan otot mata dan mengurangi *digital eyestrain*. Aplikasi ini dirancang dengan filosofi desain Swiss (International Typographic Style) dan Apple HIG — minimalis, objektif, fokus pada fungsi, dengan tipografi sans-serif bersih dan tata letak berbasis grid .

**Tujuan utama:** Memberikan alat sederhana, intuitif, dan estetis untuk senam mata yang bisa dijalankan langsung dari browser, kapan saja.

***

## 2. Latar Belakang & Masalah (Problem Statement)

Pengguna layar komputer/HP berjam-jam mengalami *digital eyestrain* (mata lelah, kering, penglihatan kabur, sakit kepala) . Aturan 20-20-20 dan latihan seperti *figure eight*, *focus change*, dan *near-far focus* terbukti membantu kenyamanan mata . Namun, tidak ada alat visual sederhana yang memandu pengguna melakukan gerakan tersebut dengan estetika yang menyenangkan.

**Mengapa tanpa framework?** Proyek ini hanya butuh HTML/CSS/JS murni agar:
- Ringan & instan dibuka (file lokal, no build step)
- Tidak ada dependency eksternal
- Bisa dijalankan offline (double-click `index.html`)

***

## 3. Target Pengguna (Target Audience)

| User Persona | Kebutuhan |
|---|---|
| Pekerja kantoran / programmer | Istirahat mata singkat di sela pekerjaan |
| Pelajar / mahasiswa | Relaksasi setelah belajar di depan layar |
| Pengguna umum | Senam mata rutin untuk kesehatan mata harian |

***

## 4. Tujuan Produk (Product Goals)

1. Menyediakan panduan visual gerakan mata yang mudah diikuti
2. Estetika minimalis Swiss + Apple yang menenangkan (bukan mengganggu)
3. Nol friksi: buka file → langsung mulai (no login, no install)
4. Customizable: durasi, kecepatan, warna tema
5. Bekerja offline 100%

***

## 5. Filosofi Desain (Design Philosophy)

### 5.1 Swiss Design (International Typographic Style)

Desain Swiss menekankan kesederhanaan, kejelasan, keterbacaan, dan objektivitas. Ciri khasnya meliputi tata letak asimetris, penggunaan grid matematis, tipografi sans-serif (Helvetica, Univers, Akzidenz-Grotesk), teks rata kiri, dan fotografi objektif . Filosofi intinya adalah "solution to the design problem should emerge from its content" — solusi desain muncul dari kontennya sendiri, bukan ornamen dekoratif .

### 5.2 Apple HIG (Human Interface Guidelines)

Apple HIG menekankan:
- **Clarity:** Hierarki visual jelas, ruang putih generous
- **Deference:** Konten utama (bola bergerak) selalu jadi prioritas visual
- **Depth:** Lapisan dan animasi halus yang natural
- Warna netral dengan satu accent color
- Animasi dengan easing natural (ease-in-out, spring)

### 5.3 Implementasi Konkret

| Elemen | Spesifikasi |
|---|---|
| Tipografi | Inter atau Helvetica Neue, sans-serif, bobot 400/500/700 |
| Grid | 8pt baseline grid, 12-column layout |
| Warna utama | Background: #FAFAFA (light) / #0A0A0A (dark); Accent: #6366F1 |
| Bentuk bola | Circle sempurna, diameter 40–60px, dengan soft glow halus |
| Teks | Rata kiri (flush-left, ragged-right) |
| Animasi | CSS transitions + requestAnimationFrame, cubic-bezier easing natural |
| Ruang putih | Generous — minimal 40% ruang negatif di setiap section |

***

## 6. Pola Gerakan Mata (Eye Movement Patterns)

Berikut adalah gerakan mata yang akan divisualisasikan, didasarkan pada latihan mata standar untuk *digital eyestrain relief* :

| # | Nama Gerakan | Pola | Durasi | Tujuan |
|---|---|---|---|---|
| 1 | Horizontal Sweep | Bola bergerak kiri ↔ kanan secara horizontal | 30 detik | Melenturkan otot rectus lateralis & medialis |
| 2 | Vertical Sweep | Bola bergerak naik ↔ turun secara vertikal | 30 detik | Melenturkan otot rectus superior & inferior |
| 3 | Diagonal Sweep | Bola bergerak diagonal (kiri-atas → kanan-bawah, dan sebaliknya) | 30 detik | Melatih gerakan oblique mata |
| 4 | Circle (Clockwise) | Bola bergerak membentuk lingkaran searah jarum jam | 30 detik | Gerakan rotasi penuh, relaksasi menyeluruh |
| 5 | Circle (Counter-clockwise) | Bola bergerak membentuk lingkaran berlawanan jarum jam | 30 detik | Variasi arah rotasi |
| 6 | Figure Eight (∞) | Bola menelusuri bentuk angka 8 | 30 detik | Latihan tracking kompleks  |
| 7 | Rectangle | Bola bergerak membentuk persegi panjang | 30 detik | Kombinasi horizontal + vertikal |
| 8 | Focus Shift (Near-Far) | Bola membesar/mengecil (simulasi near-far) | 30 detik | Latihan akomodasi lensa  |
| 9 | Blink Reminder | Teks/visual mengingatkan untuk berkedip | 15 detik | Mencegah mata kering |
| 10 | Random Drift | Bola bergerak lambat dengan trajektori acak halus | 30 detik | Relaksasi pasif |

### 6.1 Urutan Default (Preset)

**Full Routine (±5 menit):**
Horizontal → Vertical → Diagonal → Circle CW → Circle CCW → Figure Eight → Rectangle → Focus Shift → Blink Reminder → Random Drift

**Quick Break (±2 menit):**
Horizontal → Vertical → Circle CW → Blink Reminder

**Deep Relax (±8 menit):**
Semua gerakan + Random Drift diulang 2×

***

## 7. Spesifikasi Fitur (Feature Specifications)

### 7.1 Core Engine: Animation Engine

**Tujuan:** Menggerakkan sebuah elemen (lingkaran) di sepanjang *path* yang ditentukan.

**Implementasi teknis:**
- Menggunakan `requestAnimationFrame` untuk smooth animation
- Path didefinisikan sebagai fungsi matematika (parametric equations)
- Setiap gerakan adalah objek konfigurasi: `{ name, path: (t) => {x, y}, duration, easing }`

**Path formulas (contoh):**
```
Horizontal: x = cx + A * sin(t * 2π), y = cy
Vertical:   x = cx, y = cy + A * sin(t * 2π)
Circle:     x = cx + R * cos(t * 2π), y = cy + R * sin(t * 2π)
Figure 8:   x = cx + A * sin(t * 2π), y = cy + A * sin(t * 4π) / 2
Rectangle: piecewise function per quadrant
```
(dengan `cx, cy` = center, `A` = amplitude, `R` = radius, `t` ∈ )

### 7.2 Fitur Utama

| ID | Fitur | Deskripsi | Prioritas |
|---|---|---|---|
| F-01 | Start/Pause/Resume | Kontrol dasar untuk memulai atau menjeda gerakan | P0 |
| F-02 | Pattern Selector | Pilih gerakan individual dari daftar | P0 |
| F-03 | Preset Routines | Pilih paket: Quick Break, Full Routine, Deep Relax | P0 |
| F-04 | Speed Control | Slider untuk kecepatan gerakan (0.5× – 2×) | P1 |
| F-05 | Duration Control | Atur durasi per gerakan (15s, 30s, 60s) | P1 |
| F-06 | Progress Indicator | Progress bar + nama gerakan saat ini + timer hitung mundur | P0 |
| F-07 | Theme Toggle | Light / Dark mode toggle | P1 |
| F-08 | Ball Size Control | Slider untuk ukuran bola (20px – 80px) | P2 |
| F-09 | Accent Color Picker | Pilih warna aksen bola dari preset palette | P2 |
| F-10 | Audio Cue (opsional) | Suara lembut saat transisi gerakan (toggle on/off) | P2 |
| F-11 | Fullscreen Mode | Tombol untuk fullscreen browser API | P1 |
| F-12 | Countdown Timer | Hitung mundur sebelum mulai ("3, 2, 1, mulai") | P1 |
| F-13 | Settings Persistence | Simpan preferensi ke localStorage | P1 |
| F-14 | Keyboard Shortcuts | Space=pause/resume, ←/→=prev/next pattern, F=fullscreen | P1 |
| F-15 | Breathing Guide Mode | Lingkaran membesar/mengecil sinkron dengan napas (4-7-8 method) | P2 |

### 7.3 UI/UX Layout

```
+----------------------------------------------------------+
|  [Logo]  EyeRelax                    [Quick] [Full] [Deep] |  ← Header bar
+----------------------------------------------------------+
|                                                          |
|                                                          |
|                    ●  ← (bola bergerak)                   |
|                                                          |
|                                                          |
+----------------------------------------------------------+
|  [Pattern: Horizontal Sweep]  [02:30 / 05:00]  [▮▮▮▮▱▱] |  ← Status bar
+----------------------------------------------------------+
|  [▶ Start]  [⏸ Pause]  [⏭ Next]  [⚙ Settings]  [⛶ Full] |  ← Control bar
+----------------------------------------------------------+
```

### 7.4 Settings Panel (Modal)

```
Settings
─────────────────────────────
Speed:        [───●───] 1.0×
Ball Size:    [──●────] 40px
Duration:     [30s ▼]
Accent Color: [🔵 🔴 🟢 🟣 🟠]
Audio Cue:    [ ON  OFF]
Theme:        [ Light  Dark ]
─────────────────────────────
           [Save to localStorage]
```

***

## 8. Struktur File & Arsitektur Teknis

### 8.1 Stack

| Layer | Teknologi |
|---|---|
| Markup | HTML5 semantik |
| Styling | CSS3 (Custom Properties, Grid, Flexbox) |
| Logic | Vanilla JavaScript (ES6+, no framework) |
| Animasi | `requestAnimationFrame` + CSS Transitions |
| Storage | localStorage API untuk preferensi |
| Font | Inter (Google Fonts) atau sistem Helvetica/Arial fallback |

### 8.2 Struktur Folder

```
eyerelax/
├── index.html              # Halaman utama
├── css/
│   ├── style.css           # Stylesheet utama (layout, header, footer)
│   ├── animation.css       # Animasi bola & transitions
│   └── themes.css          # CSS custom properties untuk light/dark theme
├── js/
│   ├── app.js              # Main app controller (state, event listeners)
│   ├── engine.js           # Animation engine (requestAnimationFrame loop)
│   ├── patterns.js         # Definisi semua pola gerakan (parametric functions)
│   ├── presets.js          # Preset routines (Quick, Full, Deep)
│   ├── ui.js               # UI controls (buttons, sliders, modal)
│   └── storage.js          # localStorage read/write helper
├── assets/
│   └── favicon.svg         # Favicon (lingkaran minimalis)
└── README.md               # Dokumentasi
```

### 8.3 Module Dependency Graph

```
app.js
 ├── engine.js   (animation loop)
 │    └── patterns.js  (path functions)
 ├── presets.js  (routine definitions)
 ├── ui.js       (DOM manipulation)
 └── storage.js  (preferences)
```

### 8.4 API Surface (Internal)

```javascript
// engine.js
class AnimationEngine {
  constructor(canvas_or_element, patterns)
  start(pattern, duration, speed)
  pause()
  resume()
  stop()
  onComplete(callback)
}

// patterns.js
const PATTERNS = {
  horizontal: { name: "Horizontal Sweep", path: (t) => ({x, y}), duration: 30 },
  vertical: { ... },
  circle_cw: { ... },
}

// app.js
class App {
  constructor()
  loadSettings()
  selectPattern(id)
  selectPreset(id)
  startRoutine()
  nextPattern()
  togglePause()
  toggleFullscreen()
  toggleTheme()
}
```

***

## 9. Spesifikasi Visual Detail

### 9.1 Bola (The Eye-Following Circle)

| Properti | Nilai |
|---|---|
| Bentuk | Circle sempurna (border-radius: 50%) |
| Ukuran default | 40px diameter |
| Warna | Accent color (default #6366F1) |
| Shadow | box-shadow: 0 0 20px rgba(99,102,241,0.3) |
| Trail (opsional) | Subtle fading trail (opacity 0.1) |
| Easing | cubic-bezier(0.4, 0, 0.2, 1) |

### 9.2 Canvas Area

- Full viewport (100vw × 100vh) dengan padding internal
- Background: solid color (light: #FAFAFA, dark: #0A0A0A)
- Ample negative space — bola bergerak di area yang luas dan bersih
- Bola tidak boleh terlalu dekat ke tepi (margin minimal 10% dari viewport)

### 9.3 Tipografi

| Elemen | Font | Size | Weight |
|---|---|---|---|
| Logo/Title | Inter / Helvetica Neue | 18px | 700 |
| Pattern Name | Inter / Helvetica Neue | 14px | 500 |
| Timer | SF Mono / Inter | 24px | 400 |
| Settings Label | Inter / Helvetica Neue | 13px | 400 |
| Button | Inter / Helvetica Neue | 14px | 500 |

### 9.4 Color Tokens (CSS Custom Properties)

```css
:root {
  --bg-primary: #FAFAFA;
  --bg-secondary: #FFFFFF;
  --bg-overlay: rgba(0, 0, 0, 0.04);
  --text-primary: #1A1A1A;
  --text-secondary: #6B6B6B;
  --accent: #6366F1;
  --accent-glow: rgba(99, 102, 241, 0.3);
  --border: rgba(0, 0, 0, 0.08);
  --ball-radius: 20px;
  --transition-base: 300ms cubic-bezier(0.4, 0, 0.2, 1);
}

[data-theme="dark"] {
  --bg-primary: #0A0A0A;
  --bg-secondary: #1A1A1A;
  --bg-overlay: rgba(255, 255, 255, 0.04);
  --text-primary: #FAFAFA;
  --text-secondary: #9B9B9B;
  --accent: #818CF8;
  --accent-glow: rgba(129, 140, 248, 0.4);
  --border: rgba(255, 255, 255, 0.08);
}
```

***

## 10. Interaction Design

### 10.1 State Machine

```
[Idle] → (user selects pattern/preset) → [Ready]
[Ready] → (user clicks Start) → [Countdown 3..2..1] → [Playing]
[Playing] → (user clicks Pause) → [Paused]
[Paused] → (user clicks Resume) → [Playing]
[Playing] → (pattern ends) → [Transition 2s] → [Next Pattern] → [Playing]
[Playing] → (routine ends) → [Complete Screen] → [Idle]
```

### 10.2 Microinteractions

- Hover pada button: background subtle change (opacity ↑), no scale transform
- Button active: opacity ↓, slight translate-y(1px)
- Pattern transition: bola fades out → fades in di posisi start baru (300ms)
- Countdown: angka besar di tengah, scale + fade animation
- Complete screen: teks "Selamat! 🎉" dengan subtle confetti optional

### 10.3 Keyboard Shortcuts

| Key | Action |
|---|---|
| Space | Pause / Resume |
| → | Next pattern |
| ← | Previous pattern |
| F | Toggle fullscreen |
| T | Toggle theme |
| S | Open settings |
| Esc | Close modal / Exit fullscreen |
| 1-9 | Select pattern by number |

***

## 11. Performance Requirements

| Metrik | Target |
|---|---|
| Time to Interactive (TTI) | < 500ms (local file) |
| Animation FPS | Consistent 60fps |
| Bundle size | < 50KB (HTML+CSS+JS, uncompressed) |
| Memory usage | < 30MB |
| No external network requests | 100% offline capable |
| No dependencies | Zero npm/cdn dependencies |

### 11.1 Accessibility (a11y)

- WCAG 2.1 AA compliant
- Keyboard navigable: Tab through all interactive elements
- ARIA labels: `aria-label`, `role="button"`, `aria-pressed` for toggles
- Focus visible: outline 2px solid accent on focus
- Color contrast ratio: minimum 4.5:1 for text
- `prefers-reduced-motion`: detect and slow animation speed by 50%
- Screen reader: announce pattern name change via `aria-live="polite"`
- Respect `prefers-color-scheme` for initial theme

***

## 12. Edge Cases & Error Handling

| Skenario | Handling |
|---|---|
| User resize window saat animasi berjalan | Recalculate center & amplitude on resize |
| Tab tidak aktif (visibilitychange) | Auto-pause animation |
| localStorage tidak tersedia | Fallback ke default settings, no crash |
| Browser tidak support Fullscreen API | Sembunyikan tombol fullscreen |
| User tekan Start tanpa pilih pattern | Default ke preset "Quick Break" |
| `prefers-reduced-motion` aktif | Kurangi speed 50%, disable trail |
| Mobile/touch device | Buttons jadi lebih besar, layout adaptif |

### 12.1 Browser Compatibility

| Browser | Versi Minimum |
|---|---|
| Chrome | 90+ |
| Firefox | 88+ |
| Safari | 14+ |
| Edge | 90+ |
| Samsung Internet | 14+ |

***

## 13. Testing Plan

| Kategori | Test Case |
|---|---|
| Functional | Setiap pola gerakan mengikuti path yang benar |
| Functional | Preset routine berjalan sesuai urutan |
| Functional | Pause/Resume tidak mengubah posisi bola |
| Functional | Settings tersimpan & dimuat dari localStorage |
| Performance | FPS ≥ 55 saat animasi berjalan (Chrome DevTools) |
| Performance | No layout shift (CLS = 0) |
| Visual | Bola tidak keluar dari margin aman |
| Visual | Theme toggle instant, no flash |
| A11y | Tab navigation mencakup semua control |
| A11y | Screen reader announce pattern name |
| Responsive | Layout bekerja di 320px – 2560px |
| Edge | Auto-pause saat tab inactive |
| Edge | Resize window tidak crash |

***

## 14. Roadmap & Milestones

### Phase 1 — MVP (P0 features)
- [ ] HTML structure + CSS styling (Swiss/Apple aesthetic)
- [ ] Animation engine dengan `requestAnimationFrame`
- [ ] 10 pola gerakan dasar
- [ ] 3 preset routines
- [ ] Start/Pause/Resume/Next controls
- [ ] Progress bar + timer
- [ ] Responsive layout

### Phase 2 — Polish (P1 features)
- [ ] Speed & duration control
- [ ] Theme toggle (light/dark)
- [ ] Fullscreen mode
- [ ] Countdown timer
- [ ] Keyboard shortcuts
- [ ] localStorage persistence
- [ ] Accessibility (WCAG AA)

### Phase 3 — Enhancement (P2 features)
- [ ] Ball size control
- [ ] Accent color picker
- [ ] Audio cue (Web Audio API, generated tone)
- [ ] Breathing guide mode
- [ ] Trail effect on ball
- [ ] Complete screen with stats

### Phase 4 — Future (optional)
- [ ] PWA support (service worker for true offline app)
- [ ] Multi-language (ID/EN)
- [ ] Custom routine builder
- [ ] Session statistics & streak tracking
- [ ] Soundscapes (ambient audio for relaxation)

***

## 15. Acceptance Criteria

| ID | Kriteria | Status |
|---|---|---|
| AC-01 | Membuka `index.html` langsung menampilkan UI tanpa loading | ☐ |
| AC-02 | Bola bergerak mengikuti 10 pola dengan akurasi visual | ☐ |
| AC-03 | Preset routines berjalan sesuai urutan & durasi | ☐ |
| AC-04 | UI mengikuti prinsip Swiss Design (grid, sans-serif, whitespace) | ☐ |
| AC-05 | Animasi smooth 60fps tanpa jank | ☐ |
| AC-06 | Dark/Light theme bekerja dengan benar | ☐ |
| AC-07 | Semua kontrol dapat diakses via keyboard | ☐ |
| AC-08 | Tidak ada dependency eksternal (100% local) | ☐ |
| AC-09 | Layout responsif di mobile & desktop | ☐ |
| AC-10 | Settings tersimpan di localStorage | ☐ |

***

## 16. Glossary

| Istilah | Definisi |
|---|---|
| Swiss Design / International Typographic Style | Gerakan desain yang menekankan grid matematis, sans-serif, kejelasan, dan objektivitas  |
| Apple HIG | Apple Human Interface Guidelines — prinsip desain: clarity, deference, depth |
| Digital Eyestrain | Ketegangan mata akibat penggunaan layar berkepanjangan; gejala: mata kering, lelah, penglihatan kabur, sakit kepala  |
| 20-20-20 Rule | Aturan: setiap 20 menit, lihat objek 20 kaki jauhnya selama 20 detik  |
| requestAnimationFrame | Browser API untuk animasi smooth yang sinkron dengan refresh rate layar |
| Figure Eight | Latihan mata: telusuri bentuk angka 8 dengan mata selama 30 detik  |
| Near-Far Focus | Latihan akomodasi: fokus bergantian antara objek dekat & jauh  |
| CSS Custom Properties | Variabel CSS native (`--var-name`) untuk theming |
| localStorage | Web API untuk menyimpan data key-value di browser secara persisten |

***

## 17. Catatan untuk AI Builder

1. **Gunakan pure HTML/CSS/JS** — tidak ada React, Vue, atau framework apapun
2. **Struktur file modular** sesuai section 8.2 — pisahkan logic ke file JS terpisah
3. **Animation engine wajib menggunakan `requestAnimationFrame`** — jangan pakai `setInterval`
4. **Path functions** harus menerima parameter `t` (0-1) dan return `{x, y}` dalam pixel
5. **CSS wajib menggunakan Custom Properties** untuk theming
6. **Font: gunakan Inter** dari Google Fonts dengan fallback Helvetica Neue, Arial, sans-serif
7. **Minimalis maksimal** — setiap elemen harus punya alasan untuk ada (Swiss: form follows function)
8. **Whitespace generous** — jangan takut ruang kosong
9. **Animasi transisi** menggunakan `cubic-bezier(0.4, 0, 0.2, 1)` atau `ease-in-out`
10. **Komentar kode** dalam Bahasa Indonesia, ringkas dan jelas
11. **Test di Chrome, Firefox, Safari** sebelum dianggap selesai
12. **File `index.html` harus bisa dibuka langsung** dengan double-click tanpa server