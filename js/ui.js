/* ============================================
   EyeRelax — UI Controller
   DOM manipulation, modal, keyboard shortcuts,
   fullscreen, audio cue, ARIA live updates
   ============================================ */

function UIController() {
  // Cache DOM elements
  this.els = {
    // Bars
    header: document.getElementById('header'),
    statusBar: document.getElementById('status-bar'),
    controlBar: document.getElementById('control-bar'),

    // Canvas & Ball
    canvasArea: document.getElementById('canvas-area'),
    ball: document.getElementById('ball'),

    // Idle overlay
    idleOverlay: document.getElementById('idle-overlay'),
    idleStartBtn: document.getElementById('idle-start-btn'),

    // Distance Guide overlay
    distanceOverlay: document.getElementById('distance-guide-overlay'),
    distanceReadyBtn: document.getElementById('distance-ready-btn'),

    // Status bar elements
    patternName: document.getElementById('pattern-name'),
    timerDisplay: document.getElementById('timer-display'),
    progressFill: document.getElementById('progress-fill'),
    routineProgress: document.getElementById('routine-progress'),

    // Control buttons
    btnStart: document.getElementById('btn-start'),
    btnPause: document.getElementById('btn-pause'),
    btnNext: document.getElementById('btn-next'),
    btnSettings: document.getElementById('btn-settings'),
    btnFullscreen: document.getElementById('btn-fullscreen'),
    btnPrev: document.getElementById('btn-prev'),

    // Preset buttons
    btnQuick: document.getElementById('btn-quick'),
    btnFull: document.getElementById('btn-full'),
    btnDeep: document.getElementById('btn-deep'),

    // Countdown
    countdownOverlay: document.getElementById('countdown-overlay'),
    countdownNumber: document.getElementById('countdown-number'),

    // Pattern transition
    transitionOverlay: document.getElementById('transition-overlay'),
    transitionName: document.getElementById('transition-name'),
    transitionDesc: document.getElementById('transition-desc'),

    // Complete screen
    completeOverlay: document.getElementById('complete-overlay'),
    completeTime: document.getElementById('complete-time'),
    completePatterns: document.getElementById('complete-patterns'),
    completeBtn: document.getElementById('complete-btn'),

    // Blink reminder
    blinkOverlay: document.getElementById('blink-overlay'),

    // Breathing label
    breathingLabel: document.getElementById('breathing-label'),

    // Settings modal
    modalBackdrop: document.getElementById('modal-backdrop'),
    modal: document.getElementById('settings-modal'),
    modalClose: document.getElementById('modal-close'),

    // Settings controls
    speedSlider: document.getElementById('speed-slider'),
    speedValue: document.getElementById('speed-value'),
    ballSizeSlider: document.getElementById('ball-size-slider'),
    ballSizeValue: document.getElementById('ball-size-value'),
    colorSwatches: document.querySelectorAll('.color-swatch'),
    durationBtns: document.querySelectorAll('.duration-btn'),
    audioCueToggle: document.getElementById('audio-toggle'),
    themeLight: document.getElementById('theme-light'),
    themeDark: document.getElementById('theme-dark'),
    themeAuto: document.getElementById('theme-auto'),

    // ARIA live region
    ariaLive: document.getElementById('aria-live')
  };

  // Fullscreen API support check
  this.fullscreenSupported = !!(
    document.documentElement.requestFullscreen ||
    document.documentElement.webkitRequestFullscreen
  );

  if (!this.fullscreenSupported && this.els.btnFullscreen) {
    this.els.btnFullscreen.classList.add('hidden');
  }

  // Audio context (lazy init)
  this._audioCtx = null;
}

// === Tema ===
UIController.prototype.applyTheme = function(theme) {
  var resolved = resolveTheme(theme);
  document.documentElement.setAttribute('data-theme', resolved);

  // Update active state pada theme buttons
  if (this.els.themeLight) this.els.themeLight.classList.toggle('active', theme === 'light');
  if (this.els.themeDark) this.els.themeDark.classList.toggle('active', theme === 'dark');
  if (this.els.themeAuto) this.els.themeAuto.classList.toggle('active', theme === 'auto');
};

// === Aksen Warna ===
UIController.prototype.applyAccentColor = function(color) {
  document.documentElement.setAttribute('data-accent', color);
  // Update swatch active state
  this.els.colorSwatches.forEach(function(swatch) {
    swatch.classList.toggle('active', swatch.getAttribute('data-color') === color);
  });
};

// === Ball Size ===
UIController.prototype.applyBallSize = function(radius) {
  document.documentElement.style.setProperty('--ball-radius', radius + 'px');
};

// === Settings Panel ===
UIController.prototype.openSettings = function() {
  if (this.els.modalBackdrop) this.els.modalBackdrop.classList.add('active');
  if (this.els.modal) {
    this.els.modal.classList.add('active');
    // Focus modal close button
    if (this.els.modalClose) this.els.modalClose.focus();
  }
};

UIController.prototype.closeSettings = function() {
  if (this.els.modalBackdrop) this.els.modalBackdrop.classList.remove('active');
  if (this.els.modal) this.els.modal.classList.remove('active');
  // Return focus ke settings button
  if (this.els.btnSettings) this.els.btnSettings.focus();
};

UIController.prototype.isSettingsOpen = function() {
  return this.els.modal && this.els.modal.classList.contains('active');
};

// === Update Settings UI ===
UIController.prototype.updateSettingsUI = function(settings) {
  if (this.els.speedSlider) {
    this.els.speedSlider.value = settings.speed;
    this.els.speedValue.textContent = settings.speed.toFixed(1) + '×';
  }
  if (this.els.ballSizeSlider) {
    this.els.ballSizeSlider.value = settings.ballSize;
    this.els.ballSizeValue.textContent = settings.ballSize + 'px';
  }
  // Duration buttons
  this.els.durationBtns.forEach(function(btn) {
    btn.classList.toggle('active', parseInt(btn.getAttribute('data-duration')) === settings.duration);
  });
  // Audio toggle
  if (this.els.audioCueToggle) {
    this.els.audioCueToggle.classList.toggle('active', settings.audioCue);
    this.els.audioCueToggle.setAttribute('aria-pressed', settings.audioCue ? 'true' : 'false');
  }
  // Color
  this.applyAccentColor(settings.accentColor);
  // Theme
  this.applyTheme(settings.theme);
  // Ball size
  this.applyBallSize(settings.ballSize);
};

// === Preset Buttons ===
UIController.prototype.setActivePreset = function(presetId) {
  var buttons = [this.els.btnQuick, this.els.btnFull, this.els.btnDeep];
  var ids = ['quick', 'full', 'deep'];
  for (var i = 0; i < buttons.length; i++) {
    if (buttons[i]) {
      buttons[i].classList.toggle('active', ids[i] === presetId);
      buttons[i].setAttribute('aria-pressed', ids[i] === presetId ? 'true' : 'false');
    }
  }
};

// === Status Bar Updates ===
UIController.prototype.updatePatternName = function(name) {
  if (this.els.patternName) {
    this.els.patternName.textContent = name;
  }
};

UIController.prototype.updateTimer = function(remainingSec, totalSec) {
  if (this.els.timerDisplay) {
    this.els.timerDisplay.textContent = formatTime(remainingSec) + ' / ' + formatTime(totalSec);
  }
};

UIController.prototype.updateProgress = function(progress) {
  if (this.els.progressFill) {
    this.els.progressFill.style.width = (progress * 100) + '%';
  }
};

UIController.prototype.updateRoutineProgress = function(current, total) {
  if (this.els.routineProgress) {
    this.els.routineProgress.textContent = current + ' / ' + total;
  }
};

// === Control Button States ===
UIController.prototype.showPlayState = function() {
  // Tampilkan tombol Pause, sembunyikan Start
  if (this.els.btnStart) this.els.btnStart.classList.add('hidden');
  if (this.els.btnPause) {
    this.els.btnPause.classList.remove('hidden');
    this.els.btnPause.querySelector('.label').textContent = 'Pause';
    this.els.btnPause.querySelector('.icon').innerHTML = '<svg class="svg-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>';
    this.els.btnPause.setAttribute('aria-label', 'Pause animasi');
  }
};

UIController.prototype.showPauseState = function() {
  if (this.els.btnPause) {
    this.els.btnPause.querySelector('.label').textContent = 'Resume';
    this.els.btnPause.querySelector('.icon').innerHTML = '<svg class="svg-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>';
    this.els.btnPause.setAttribute('aria-label', 'Resume animasi');
  }
};

UIController.prototype.showIdleState = function() {
  if (this.els.btnStart) this.els.btnStart.classList.remove('hidden');
  if (this.els.btnPause) this.els.btnPause.classList.add('hidden');

  // Reset status
  this.updatePatternName('Siap');
  this.updateTimer(0, 0);
  this.updateProgress(0);
  this.updateRoutineProgress(0, 0);

  // Tampilkan idle overlay
  if (this.els.idleOverlay) this.els.idleOverlay.classList.remove('hidden');

  // Sembunyikan distance guide
  this.hideDistanceGuide();

  // Sembunyikan bola
  if (this.els.ball) this.els.ball.classList.add('hidden');
};

UIController.prototype.hideIdleOverlay = function() {
  if (this.els.idleOverlay) this.els.idleOverlay.classList.add('hidden');
  if (this.els.ball) this.els.ball.classList.remove('hidden');
};

UIController.prototype.showDistanceGuide = function() {
  if (this.els.distanceOverlay) this.els.distanceOverlay.classList.remove('hidden');
  if (this.els.distanceReadyBtn) this.els.distanceReadyBtn.focus();
};

UIController.prototype.hideDistanceGuide = function() {
  if (this.els.distanceOverlay) this.els.distanceOverlay.classList.add('hidden');
};

// === Countdown ===
UIController.prototype.showCountdown = function(callback) {
  var self = this;
  var overlay = this.els.countdownOverlay;
  var numberEl = this.els.countdownNumber;

  if (!overlay || !numberEl) {
    if (callback) callback();
    return;
  }

  overlay.classList.add('active');
  var count = 3;

  function showNumber() {
    if (count <= 0) {
      // Tampilkan "Mulai!" sejenak
      numberEl.textContent = 'Mulai!';
      numberEl.style.fontSize = '48px';
      numberEl.style.animation = 'none';
      void numberEl.offsetWidth; // Force reflow
      numberEl.style.animation = 'countdownPulse 700ms var(--ease-out) forwards';

      setTimeout(function() {
        overlay.classList.remove('active');
        numberEl.style.fontSize = '';
        if (callback) callback();
      }, 700);
      return;
    }

    numberEl.textContent = count;
    numberEl.style.animation = 'none';
    void numberEl.offsetWidth; // Force reflow
    numberEl.style.animation = 'countdownPulse 900ms var(--ease-out) forwards';

    count--;
    setTimeout(showNumber, 900);
  }

  showNumber();
};

// === Pattern Transition ===
UIController.prototype.showTransition = function(patternName, description, callback) {
  var overlay = this.els.transitionOverlay;
  if (!overlay) {
    if (callback) callback();
    return;
  }

  if (this.els.transitionName) this.els.transitionName.textContent = patternName;
  if (this.els.transitionDesc) this.els.transitionDesc.textContent = description;

  overlay.classList.add('active');

  setTimeout(function() {
    overlay.classList.remove('active');
    if (callback) callback();
  }, 1500);
};

// === Complete Screen ===
UIController.prototype.showComplete = function(totalTime, patternCount) {
  if (this.els.completeTime) {
    this.els.completeTime.textContent = formatTime(totalTime);
  }
  if (this.els.completePatterns) {
    this.els.completePatterns.textContent = patternCount;
  }
  if (this.els.completeOverlay) {
    this.els.completeOverlay.classList.add('active');
    this._spawnConfetti();
  }
};

UIController.prototype.hideComplete = function() {
  if (this.els.completeOverlay) {
    this.els.completeOverlay.classList.remove('active');
  }
};

// === Blink Reminder ===
UIController.prototype.showBlinkReminder = function() {
  if (this.els.blinkOverlay) this.els.blinkOverlay.classList.add('active');
};

UIController.prototype.hideBlinkReminder = function() {
  if (this.els.blinkOverlay) this.els.blinkOverlay.classList.remove('active');
};

// === Breathing Label ===
UIController.prototype.showBreathingLabel = function(text) {
  if (this.els.breathingLabel) {
    this.els.breathingLabel.textContent = text;
    this.els.breathingLabel.classList.add('active');
  }
};

UIController.prototype.hideBreathingLabel = function() {
  if (this.els.breathingLabel) {
    this.els.breathingLabel.classList.remove('active');
  }
};

// === Fullscreen ===
UIController.prototype.toggleFullscreen = function() {
  if (!this.fullscreenSupported) return;

  if (document.fullscreenElement || document.webkitFullscreenElement) {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    }
  } else {
    var el = document.documentElement;
    if (el.requestFullscreen) {
      el.requestFullscreen();
    } else if (el.webkitRequestFullscreen) {
      el.webkitRequestFullscreen();
    }
  }
};

// === Audio Cue ===
UIController.prototype.playTransitionSound = function() {
  try {
    if (!this._audioCtx) {
      this._audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    var ctx = this._audioCtx;
    var osc = ctx.createOscillator();
    var gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.type = 'sine';
    osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
    osc.frequency.exponentialRampToValueAtTime(659.25, ctx.currentTime + 0.1); // E5

    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.3);
  } catch (e) {
    // Audio API tidak tersedia, abaikan
  }
};

// === ARIA Live Announcements ===
UIController.prototype.announce = function(message) {
  if (this.els.ariaLive) {
    this.els.ariaLive.textContent = message;
  }
};

// === Confetti (subtle celebration) ===
UIController.prototype._spawnConfetti = function() {
  var container = document.getElementById('confetti-container');
  if (!container) return;

  container.innerHTML = '';
  var colors = ['#6366F1', '#818CF8', '#F43F5E', '#10B981', '#F59E0B', '#8B5CF6'];

  for (var i = 0; i < 30; i++) {
    var particle = document.createElement('div');
    particle.className = 'confetti-particle';
    particle.style.left = (Math.random() * 100) + '%';
    particle.style.background = colors[Math.floor(Math.random() * colors.length)];
    particle.style.animationDelay = (Math.random() * 1.5) + 's';
    particle.style.animationDuration = (2 + Math.random() * 2) + 's';
    container.appendChild(particle);
  }

  // Hapus setelah animasi selesai
  setTimeout(function() {
    container.innerHTML = '';
  }, 5000);
};
