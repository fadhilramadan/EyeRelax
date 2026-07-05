/* ============================================
   EyeRelax — Main App Controller
   State machine, orchestration, event wiring
   ============================================ */

function App() {
  // Settings
  this.settings = loadSettings();

  // UI Controller
  this.ui = new UIController();

  // Animation Engine
  this.engine = new AnimationEngine(this.ui.els.ball, this.ui.els.canvasArea);

  // State
  this.state = 'idle'; // idle | countdown | playing | paused | complete
  this.currentPreset = null;
  this.currentRoutine = []; // Array pattern configs untuk routine saat ini
  this.currentPatternIndex = 0;
  this.routineStartTime = 0;

  // Terapkan settings awal
  this._applySettings();

  // Wire events
  this._bindEvents();

  // Set state awal
  this.ui.showIdleState();

  // Set preset default
  this.selectPreset(this.settings.lastPreset || 'quick');
}

// Terapkan semua settings ke UI
App.prototype._applySettings = function() {
  this.ui.updateSettingsUI(this.settings);
  this.engine.speed = this.settings.speed;
};

// === Event Binding ===
App.prototype._bindEvents = function() {
  var self = this;

  // Preset buttons
  var presetMap = {
    'btn-quick': 'quick',
    'btn-full': 'full',
    'btn-deep': 'deep'
  };

  Object.keys(presetMap).forEach(function(btnId) {
    var btn = document.getElementById(btnId);
    if (btn) {
      btn.addEventListener('click', function() {
        self.selectPreset(presetMap[btnId]);
      });
    }
  });

  // Idle start button
  if (this.ui.els.idleStartBtn) {
    this.ui.els.idleStartBtn.addEventListener('click', function() {
      self.startRoutine();
    });
  }

  // Start button
  if (this.ui.els.btnStart) {
    this.ui.els.btnStart.addEventListener('click', function() {
      self.startRoutine();
    });
  }

  // Distance ready button
  if (this.ui.els.distanceReadyBtn) {
    this.ui.els.distanceReadyBtn.addEventListener('click', function() {
      self.proceedFromDistanceGuide();
    });
  }

  // Pause/Resume button
  if (this.ui.els.btnPause) {
    this.ui.els.btnPause.addEventListener('click', function() {
      self.togglePause();
    });
  }

  // Next button
  if (this.ui.els.btnNext) {
    this.ui.els.btnNext.addEventListener('click', function() {
      self.nextPattern();
    });
  }

  // Prev button
  if (this.ui.els.btnPrev) {
    this.ui.els.btnPrev.addEventListener('click', function() {
      self.prevPattern();
    });
  }

  // Settings button
  if (this.ui.els.btnSettings) {
    this.ui.els.btnSettings.addEventListener('click', function() {
      if (self.ui.isSettingsOpen()) {
        self.ui.closeSettings();
      } else {
        self.ui.openSettings();
      }
    });
  }

  // Fullscreen button
  if (this.ui.els.btnFullscreen) {
    this.ui.els.btnFullscreen.addEventListener('click', function() {
      self.ui.toggleFullscreen();
    });
  }

  // Modal close
  if (this.ui.els.modalClose) {
    this.ui.els.modalClose.addEventListener('click', function() {
      self.ui.closeSettings();
    });
  }

  // Modal backdrop click
  if (this.ui.els.modalBackdrop) {
    this.ui.els.modalBackdrop.addEventListener('click', function() {
      self.ui.closeSettings();
    });
  }

  // Complete button
  if (this.ui.els.completeBtn) {
    this.ui.els.completeBtn.addEventListener('click', function() {
      self.ui.hideComplete();
      self.resetToIdle();
    });
  }

  // === Settings Controls ===

  // Speed slider
  if (this.ui.els.speedSlider) {
    this.ui.els.speedSlider.addEventListener('input', function() {
      var val = parseFloat(this.value);
      self.settings.speed = val;
      self.engine.speed = val;
      self.ui.els.speedValue.textContent = val.toFixed(1) + '×';
      self._saveSettings();
    });
  }

  // Ball size slider
  if (this.ui.els.ballSizeSlider) {
    this.ui.els.ballSizeSlider.addEventListener('input', function() {
      var val = parseInt(this.value);
      self.settings.ballSize = val;
      self.ui.applyBallSize(val);
      self.ui.els.ballSizeValue.textContent = val + 'px';
      self._saveSettings();
    });
  }

  // Duration buttons
  this.ui.els.durationBtns.forEach(function(btn) {
    btn.addEventListener('click', function() {
      var dur = parseInt(this.getAttribute('data-duration'));
      self.settings.duration = dur;
      self.ui.els.durationBtns.forEach(function(b) {
        b.classList.toggle('active', parseInt(b.getAttribute('data-duration')) === dur);
      });
      self._saveSettings();
    });
  });

  // Color swatches
  this.ui.els.colorSwatches.forEach(function(swatch) {
    swatch.addEventListener('click', function() {
      var color = this.getAttribute('data-color');
      self.settings.accentColor = color;
      self.ui.applyAccentColor(color);
      self._saveSettings();
    });
  });

  // Audio cue toggle
  if (this.ui.els.audioCueToggle) {
    this.ui.els.audioCueToggle.addEventListener('click', function() {
      self.settings.audioCue = !self.settings.audioCue;
      this.classList.toggle('active', self.settings.audioCue);
      this.setAttribute('aria-pressed', self.settings.audioCue ? 'true' : 'false');
      self._saveSettings();
    });
  }

  // Theme buttons
  ['light', 'dark', 'auto'].forEach(function(theme) {
    var btn = document.getElementById('theme-' + theme);
    if (btn) {
      btn.addEventListener('click', function() {
        self.settings.theme = theme;
        self.ui.applyTheme(theme);
        self._saveSettings();
      });
    }
  });

  // === Keyboard Shortcuts ===
  document.addEventListener('keydown', function(e) {
    // Abaikan saat mengetik di input
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

    switch (e.code) {
      case 'Space':
        e.preventDefault();
        if (self.state === 'idle') {
          self.startRoutine();
        } else if (self.state === 'distance_guide') {
          self.proceedFromDistanceGuide();
        } else {
          self.togglePause();
        }
        break;

      case 'ArrowRight':
        e.preventDefault();
        self.nextPattern();
        break;

      case 'ArrowLeft':
        e.preventDefault();
        self.prevPattern();
        break;

      case 'KeyF':
        if (!self.ui.isSettingsOpen()) {
          e.preventDefault();
          self.ui.toggleFullscreen();
        }
        break;

      case 'KeyT':
        if (!self.ui.isSettingsOpen()) {
          e.preventDefault();
          self.toggleTheme();
        }
        break;

      case 'KeyS':
        e.preventDefault();
        if (self.ui.isSettingsOpen()) {
          self.ui.closeSettings();
        } else {
          self.ui.openSettings();
        }
        break;

      case 'Escape':
        if (self.ui.isSettingsOpen()) {
          self.ui.closeSettings();
        } else if (document.fullscreenElement || document.webkitFullscreenElement) {
          self.ui.toggleFullscreen();
        }
        break;

      // 1-9: Select pattern by number
      case 'Digit1': case 'Digit2': case 'Digit3':
      case 'Digit4': case 'Digit5': case 'Digit6':
      case 'Digit7': case 'Digit8': case 'Digit9':
        if (!self.ui.isSettingsOpen()) {
          var num = parseInt(e.code.replace('Digit', ''));
          self._selectPatternByNumber(num);
        }
        break;
    }
  });

  // Resize handler — update canvas dimensions
  window.addEventListener('resize', function() {
    if (self.engine) {
      self.engine._updateCanvasRect();
    }
  });

  // System theme change listener
  if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function() {
      if (self.settings.theme === 'auto') {
        self.ui.applyTheme('auto');
      }
    });
  }
};

// === Pilih Preset ===
App.prototype.selectPreset = function(presetId) {
  var preset = PRESETS[presetId];
  if (!preset) return;

  this.currentPreset = preset;
  this.settings.lastPreset = presetId;
  this.ui.setActivePreset(presetId);
  this._saveSettings();

  // Update UI dengan info preset
  this.ui.announce('Preset dipilih: ' + preset.name);
};

// === Mulai Routine ===
App.prototype.startRoutine = function() {
  if (this.state === 'countdown' || this.state === 'playing' || this.state === 'distance_guide') return;

  // Jika belum pilih preset, default ke Quick Break
  if (!this.currentPreset) {
    this.selectPreset('quick');
  }

  // Build routine dari preset, gunakan custom duration jika diset
  var preset = this.currentPreset;
  var customDuration = this.settings.duration;
  this.currentRoutine = preset.patterns.map(function(p) {
    var duration = p.duration;
    // Gunakan durasi kustom untuk pattern standar
    if (p.id !== 'breathing' && p.id !== 'blink_reminder') {
      duration = customDuration;
    } else if (p.id === 'blink_reminder') {
      // Blink reminder durasi setengah dari kustom, minimal 10 detik
      duration = Math.max(10, Math.round(customDuration / 2));
    }
    return {
      id: p.id,
      duration: duration,
      pattern: getPattern(p.id)
    };
  });
  this.currentPatternIndex = 0;
  this.routineStartTime = Date.now();

  // Sembunyikan idle overlay
  this.ui.hideIdleOverlay();

  // Tampilkan distance guide
  this.state = 'distance_guide';
  this.ui.showDistanceGuide();
};

// === Selesai Distance Guide, Masuk ke Countdown ===
App.prototype.proceedFromDistanceGuide = function() {
  if (this.state !== 'distance_guide') return;

  this.ui.hideDistanceGuide();

  // Update routine progress
  this.ui.updateRoutineProgress(1, this.currentRoutine.length);

  // Tampilkan countdown
  this.state = 'countdown';
  var self = this;
  this.ui.showCountdown(function() {
    self._startCurrentPattern();
  });

  // Play transition sound
  if (this.settings.audioCue) {
    this.ui.playTransitionSound();
  }
};

// === Mulai Pattern Saat Ini ===
App.prototype._startCurrentPattern = function() {
  if (this.currentPatternIndex >= this.currentRoutine.length) {
    this._routineComplete();
    return;
  }

  var routineItem = this.currentRoutine[this.currentPatternIndex];
  var pattern = routineItem.pattern;

  if (!pattern) {
    // Pattern tidak ditemukan, skip
    this.currentPatternIndex++;
    this._startCurrentPattern();
    return;
  }

  this.state = 'playing';

  // Update UI
  this.ui.updatePatternName(pattern.name);
  this.ui.showPlayState();
  this.ui.updateRoutineProgress(this.currentPatternIndex + 1, this.currentRoutine.length);
  this.ui.announce('Pola gerakan: ' + pattern.name + '. ' + pattern.description);

  // Khusus blink reminder
  if (pattern.isBlinkReminder) {
    this.ui.showBlinkReminder();
  } else {
    this.ui.hideBlinkReminder();
  }

  // Khusus breathing
  if (pattern.isBreathing) {
    this.ui.showBreathingLabel('Tarik Napas...');
  } else {
    this.ui.hideBreathingLabel();
  }

  // Hitung durasi efektif
  var duration = routineItem.duration;

  // Setup engine callbacks
  var self = this;
  var totalSec = duration / this.settings.speed;

  this.engine.onProgress(function(progress, remainingSec) {
    self.ui.updateProgress(progress);
    self.ui.updateTimer(remainingSec, totalSec);
  });

  this.engine.onPhaseLabel(function(label) {
    self.ui.showBreathingLabel(label);
  });

  this.engine.onComplete(function() {
    self.ui.hideBlinkReminder();
    self.ui.hideBreathingLabel();

    // Pindah ke pattern berikutnya
    self.currentPatternIndex++;

    if (self.currentPatternIndex >= self.currentRoutine.length) {
      self._routineComplete();
    } else {
      // Transisi ke pattern berikutnya
      var nextPattern = self.currentRoutine[self.currentPatternIndex].pattern;
      if (nextPattern) {
        // Fade ball
        self.ui.els.ball.classList.add('fading');

        if (self.settings.audioCue) {
          self.ui.playTransitionSound();
        }

        self.ui.showTransition(nextPattern.name, nextPattern.description, function() {
          self.ui.els.ball.classList.remove('fading');
          self.ui.els.ball.classList.add('visible');
          self._startCurrentPattern();
        });
      } else {
        self._startCurrentPattern();
      }
    }
  });

  // Mulai engine
  this.engine.start(pattern, duration, this.settings.speed);
};

// === Routine Selesai ===
App.prototype._routineComplete = function() {
  this.state = 'complete';
  this.engine.stop();

  // Hitung total waktu
  var totalTimeSec = (Date.now() - this.routineStartTime) / 1000;

  this.ui.showPlayState(); // Pastikan UI consistent
  this.ui.showComplete(totalTimeSec, this.currentRoutine.length);
  this.ui.announce('Selamat! Sesi selesai. Total waktu: ' + formatTime(totalTimeSec));

  if (this.settings.audioCue) {
    this.ui.playTransitionSound();
  }
};

// === Toggle Pause / Resume ===
App.prototype.togglePause = function() {
  if (this.state === 'playing') {
    this.engine.pause();
    this.state = 'paused';
    this.ui.showPauseState();
    this.ui.announce('Dijeda');
  } else if (this.state === 'paused') {
    this.engine.resume();
    this.state = 'playing';
    this.ui.showPlayState();
    this.ui.announce('Dilanjutkan');
  }
};

// === Next Pattern ===
App.prototype.nextPattern = function() {
  if (this.state !== 'playing' && this.state !== 'paused') return;

  this.engine.stop();
  this.ui.hideBlinkReminder();
  this.ui.hideBreathingLabel();

  this.currentPatternIndex++;
  if (this.currentPatternIndex >= this.currentRoutine.length) {
    this._routineComplete();
  } else {
    this._startCurrentPattern();
  }
};

// === Previous Pattern ===
App.prototype.prevPattern = function() {
  if (this.state !== 'playing' && this.state !== 'paused') return;

  this.engine.stop();
  this.ui.hideBlinkReminder();
  this.ui.hideBreathingLabel();

  this.currentPatternIndex = Math.max(0, this.currentPatternIndex - 1);
  this._startCurrentPattern();
};

// === Toggle Theme ===
App.prototype.toggleTheme = function() {
  var currentResolved = resolveTheme(this.settings.theme);
  var newTheme = currentResolved === 'dark' ? 'light' : 'dark';
  this.settings.theme = newTheme;
  this.ui.applyTheme(newTheme);
  this._saveSettings();
  this.ui.announce('Tema: ' + newTheme);
};

// === Select Pattern by Number (1-9) ===
App.prototype._selectPatternByNumber = function(num) {
  if (this.state !== 'playing' && this.state !== 'paused') return;
  if (num < 1 || num > this.currentRoutine.length) return;

  this.engine.stop();
  this.ui.hideBlinkReminder();
  this.ui.hideBreathingLabel();

  this.currentPatternIndex = num - 1;
  this._startCurrentPattern();
};

// === Reset ke Idle ===
App.prototype.resetToIdle = function() {
  this.state = 'idle';
  this.engine.stop();
  this.ui.showIdleState();
  this.ui.hideBlinkReminder();
  this.ui.hideBreathingLabel();
};

// === Simpan Settings ===
App.prototype._saveSettings = function() {
  saveSettings(this.settings);
};

// === Init ===
document.addEventListener('DOMContentLoaded', function() {
  window.eyeRelaxApp = new App();
});
