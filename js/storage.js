/* ============================================
   EyeRelax — localStorage Helper
   Simpan & muat preferensi pengguna
   ============================================ */

var STORAGE_KEY = 'eyerelax_settings';

// Default settings
var DEFAULT_SETTINGS = {
  speed: 1.0,
  ballSize: 20, // radius dalam px
  duration: 30,
  accentColor: 'ocean',
  audioCue: false,
  theme: 'auto', // 'light' | 'dark' | 'auto'
  lastPreset: 'quick'
};

// Muat settings dari localStorage
function loadSettings() {
  try {
    var stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      var parsed = JSON.parse(stored);
      // Merge dengan default (untuk forward-compat)
      var settings = {};
      for (var key in DEFAULT_SETTINGS) {
        if (DEFAULT_SETTINGS.hasOwnProperty(key)) {
          settings[key] = parsed.hasOwnProperty(key) ? parsed[key] : DEFAULT_SETTINGS[key];
        }
      }
      return settings;
    }
  } catch (e) {
    // localStorage tidak tersedia atau data corrupt
    console.warn('EyeRelax: Gagal memuat settings, menggunakan default.', e);
  }
  return Object.assign({}, DEFAULT_SETTINGS);
}

// Simpan settings ke localStorage
function saveSettings(settings) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    return true;
  } catch (e) {
    console.warn('EyeRelax: Gagal menyimpan settings.', e);
    return false;
  }
}

// Hapus settings (reset ke default)
function clearSettings() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    // Abaikan
  }
}

// Deteksi preferensi tema sistem
function getSystemTheme() {
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }
  return 'light';
}

// Resolve tema aktual dari setting ('auto' → system preference)
function resolveTheme(themeSetting) {
  if (themeSetting === 'auto' || !themeSetting) {
    return getSystemTheme();
  }
  return themeSetting;
}
