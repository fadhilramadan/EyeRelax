/* ============================================
   EyeRelax — Preset Routines
   Quick Break (~2 menit), Full Routine (~5 menit),
   Deep Relax (~8 menit)
   ============================================ */

var PRESETS = {
  quick: {
    id: 'quick',
    name: 'Quick Break',
    description: '~2 menit — istirahat singkat',
    icon: '⚡',
    patterns: [
      { id: 'horizontal', duration: 30 },
      { id: 'vertical', duration: 30 },
      { id: 'circle_cw', duration: 30 },
      { id: 'blink_reminder', duration: 15 }
    ]
  },

  full: {
    id: 'full',
    name: 'Full Routine',
    description: '~5 menit — latihan lengkap',
    icon: '✨',
    patterns: [
      { id: 'horizontal', duration: 30 },
      { id: 'vertical', duration: 30 },
      { id: 'diagonal', duration: 30 },
      { id: 'circle_cw', duration: 30 },
      { id: 'circle_ccw', duration: 30 },
      { id: 'figure_eight', duration: 30 },
      { id: 'rectangle', duration: 30 },
      { id: 'focus_shift', duration: 30 },
      { id: 'blink_reminder', duration: 15 },
      { id: 'random_drift', duration: 30 }
    ]
  },

  deep: {
    id: 'deep',
    name: 'Deep Relax',
    description: '~8 menit — relaksasi mendalam',
    icon: '🧘',
    patterns: [
      { id: 'horizontal', duration: 30 },
      { id: 'vertical', duration: 30 },
      { id: 'diagonal', duration: 30 },
      { id: 'circle_cw', duration: 30 },
      { id: 'circle_ccw', duration: 30 },
      { id: 'figure_eight', duration: 30 },
      { id: 'rectangle', duration: 30 },
      { id: 'focus_shift', duration: 30 },
      { id: 'blink_reminder', duration: 15 },
      { id: 'random_drift', duration: 30 },
      // Ulang Random Drift 2×
      { id: 'random_drift', duration: 30 },
      { id: 'breathing', duration: 38 },
      { id: 'blink_reminder', duration: 15 }
    ]
  }
};

// Hitung total durasi preset dalam detik
function getPresetDuration(presetId) {
  var preset = PRESETS[presetId];
  if (!preset) return 0;
  var total = 0;
  for (var i = 0; i < preset.patterns.length; i++) {
    total += preset.patterns[i].duration;
  }
  return total;
}

// Format detik menjadi MM:SS
function formatTime(seconds) {
  var m = Math.floor(seconds / 60);
  var s = Math.floor(seconds % 60);
  return (m < 10 ? '0' : '') + m + ':' + (s < 10 ? '0' : '') + s;
}
