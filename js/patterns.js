/* ============================================
   EyeRelax — Definisi Pola Gerakan Mata
   Setiap pattern: name, description, path(t), duration
   t ∈ [0, 1], return {x, y} dalam proporsi (0-1) dari area canvas
   ============================================ */

const PATTERNS = {
  horizontal: {
    id: 'horizontal',
    name: 'Horizontal Sweep',
    description: 'Melenturkan otot rectus lateralis & medialis',
    duration: 30,
    // Bola bergerak kiri ↔ kanan
    path: function(t) {
      // Gerakan bolak-balik halus dengan easing
      const x = 0.5 + 0.4 * Math.sin(t * 2 * Math.PI);
      const y = 0.5;
      return { x, y };
    }
  },

  vertical: {
    id: 'vertical',
    name: 'Vertical Sweep',
    description: 'Melenturkan otot rectus superior & inferior',
    duration: 30,
    // Bola bergerak naik ↔ turun
    path: function(t) {
      const x = 0.5;
      const y = 0.5 + 0.4 * Math.sin(t * 2 * Math.PI);
      return { x, y };
    }
  },

  diagonal: {
    id: 'diagonal',
    name: 'Diagonal Sweep',
    description: 'Melatih gerakan oblique mata',
    duration: 30,
    // Bola bergerak diagonal (bergantian arah)
    path: function(t) {
      // Setengah pertama: kiri-atas → kanan-bawah
      // Setengah kedua: kanan-atas → kiri-bawah
      const cycle = t * 2;
      if (cycle < 1) {
        const progress = Math.sin(cycle * Math.PI);
        return {
          x: 0.5 + 0.35 * (progress * 2 - 1),
          y: 0.5 + 0.35 * (progress * 2 - 1)
        };
      } else {
        const progress = Math.sin((cycle - 1) * Math.PI);
        return {
          x: 0.5 + 0.35 * (progress * 2 - 1),
          y: 0.5 - 0.35 * (progress * 2 - 1)
        };
      }
    }
  },

  circle_cw: {
    id: 'circle_cw',
    name: 'Circle (Clockwise)',
    description: 'Gerakan rotasi penuh, relaksasi menyeluruh',
    duration: 30,
    // Lingkaran searah jarum jam
    path: function(t) {
      const angle = t * 2 * Math.PI;
      const x = 0.5 + 0.35 * Math.cos(angle - Math.PI / 2);
      const y = 0.5 + 0.35 * Math.sin(angle - Math.PI / 2);
      return { x, y };
    }
  },

  circle_ccw: {
    id: 'circle_ccw',
    name: 'Circle (Counter-clockwise)',
    description: 'Variasi arah rotasi',
    duration: 30,
    // Lingkaran berlawanan jarum jam
    path: function(t) {
      const angle = -t * 2 * Math.PI;
      const x = 0.5 + 0.35 * Math.cos(angle - Math.PI / 2);
      const y = 0.5 + 0.35 * Math.sin(angle - Math.PI / 2);
      return { x, y };
    }
  },

  figure_eight: {
    id: 'figure_eight',
    name: 'Figure Eight (∞)',
    description: 'Latihan tracking kompleks',
    duration: 30,
    // Bentuk angka 8 / infinity
    path: function(t) {
      const angle = t * 2 * Math.PI;
      const x = 0.5 + 0.35 * Math.sin(angle);
      const y = 0.5 + 0.2 * Math.sin(angle * 2);
      return { x, y };
    }
  },

  rectangle: {
    id: 'rectangle',
    name: 'Rectangle',
    description: 'Kombinasi horizontal + vertikal',
    duration: 30,
    // Piecewise — bergerak membentuk persegi panjang
    path: function(t) {
      const margin = 0.15;
      const left = margin;
      const right = 1 - margin;
      const top = margin + 0.1;
      const bottom = 1 - margin - 0.1;

      // Bagi t menjadi 4 segmen
      const segment = t * 4;

      if (segment < 1) {
        // Atas: kiri → kanan
        const p = segment;
        return { x: left + (right - left) * p, y: top };
      } else if (segment < 2) {
        // Kanan: atas → bawah
        const p = segment - 1;
        return { x: right, y: top + (bottom - top) * p };
      } else if (segment < 3) {
        // Bawah: kanan → kiri
        const p = segment - 2;
        return { x: right - (right - left) * p, y: bottom };
      } else {
        // Kiri: bawah → atas
        const p = segment - 3;
        return { x: left, y: bottom - (bottom - top) * p };
      }
    }
  },

  focus_shift: {
    id: 'focus_shift',
    name: 'Focus Shift (Near-Far)',
    description: 'Latihan akomodasi lensa — bola membesar/mengecil',
    duration: 30,
    // Bola tetap di tengah, ukuran berubah (dihandle oleh engine)
    isFocusShift: true,
    path: function(t) {
      return { x: 0.5, y: 0.5 };
    },
    // Scale factor: 0.5 → 2.5 → 0.5 secara halus
    getScale: function(t) {
      return 1 + 1.2 * Math.sin(t * 2 * Math.PI);
    }
  },

  blink_reminder: {
    id: 'blink_reminder',
    name: 'Blink Reminder',
    description: 'Mencegah mata kering — berkediplah perlahan',
    duration: 15,
    isBlinkReminder: true,
    path: function(t) {
      return { x: 0.5, y: 0.5 };
    }
  },

  random_drift: {
    id: 'random_drift',
    name: 'Random Drift',
    description: 'Relaksasi pasif — ikuti bola dengan santai',
    duration: 30,
    // Perlin-like smooth random movement via layered sine waves
    path: function(t) {
      const x = 0.5 +
        0.15 * Math.sin(t * 2.3 * Math.PI + 1.2) +
        0.1 * Math.sin(t * 5.1 * Math.PI + 0.7) +
        0.08 * Math.sin(t * 8.7 * Math.PI + 3.1);
      const y = 0.5 +
        0.15 * Math.sin(t * 1.7 * Math.PI + 2.5) +
        0.1 * Math.sin(t * 4.3 * Math.PI + 1.1) +
        0.08 * Math.sin(t * 7.9 * Math.PI + 0.3);
      return { x, y };
    }
  },

  breathing: {
    id: 'breathing',
    name: 'Breathing Guide',
    description: 'Sinkronkan napas — 4 detik masuk, 7 tahan, 8 keluar',
    duration: 38, // Satu siklus 4-7-8 = 19 detik, 2 siklus
    isBreathing: true,
    path: function(t) {
      return { x: 0.5, y: 0.5 };
    },
    // Scale berdasarkan pola napas 4-7-8
    getScale: function(t) {
      const cycleLength = 19; // detik per siklus
      const totalDuration = 38;
      const secondsIn = t * totalDuration;
      const cycleT = (secondsIn % cycleLength);

      if (cycleT < 4) {
        // Tarik napas (4 detik) — membesar
        const p = cycleT / 4;
        return 0.6 + 1.8 * p;
      } else if (cycleT < 11) {
        // Tahan (7 detik) — stabil besar
        return 2.4;
      } else {
        // Buang napas (8 detik) — mengecil
        const p = (cycleT - 11) / 8;
        return 2.4 - 1.8 * p;
      }
    },
    getPhaseLabel: function(t) {
      const cycleLength = 19;
      const totalDuration = 38;
      const secondsIn = t * totalDuration;
      const cycleT = (secondsIn % cycleLength);

      if (cycleT < 4) return 'Tarik Napas...';
      if (cycleT < 11) return 'Tahan...';
      return 'Buang Napas...';
    }
  }
};

// Daftar pattern IDs dalam urutan tampil
const PATTERN_ORDER = [
  'horizontal', 'vertical', 'diagonal',
  'circle_cw', 'circle_ccw', 'figure_eight',
  'rectangle', 'focus_shift', 'blink_reminder', 'random_drift'
];

// Ambil pattern berdasarkan ID
function getPattern(id) {
  return PATTERNS[id] || null;
}

// Ambil semua pattern dalam urutan
function getAllPatterns() {
  return PATTERN_ORDER.map(function(id) { return PATTERNS[id]; });
}
