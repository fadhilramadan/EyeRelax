/* ============================================
   EyeRelax — Animation Engine
   requestAnimationFrame loop, speed control,
   auto-pause, resize handling
   ============================================ */

function AnimationEngine(ballElement, canvasElement) {
  // Referensi DOM
  this.ball = ballElement;
  this.canvas = canvasElement;

  // State
  this.currentPattern = null;
  this.state = 'idle'; // idle | playing | paused
  this.startTime = 0;
  this.elapsed = 0;
  this.pausedAt = 0;
  this.duration = 30; // detik
  this.speed = 1.0;
  this.rafId = null;
  this.progress = 0; // 0–1
  this.reducedMotion = false;

  // Callbacks
  this._onComplete = null;
  this._onProgress = null;
  this._onPhaseLabel = null;

  // Ukuran canvas
  this._canvasRect = null;
  this._updateCanvasRect();

  // Deteksi reduced motion
  var motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  this.reducedMotion = motionQuery.matches;
  var self = this;
  motionQuery.addEventListener('change', function(e) {
    self.reducedMotion = e.matches;
  });

  // Resize handler
  this._resizeHandler = this._updateCanvasRect.bind(this);
  window.addEventListener('resize', this._resizeHandler);

  // Visibilitychange handler — auto-pause
  this._visibilityHandler = this._onVisibilityChange.bind(this);
  document.addEventListener('visibilitychange', this._visibilityHandler);
}

// Update dimensi canvas
AnimationEngine.prototype._updateCanvasRect = function() {
  if (this.canvas) {
    this._canvasRect = this.canvas.getBoundingClientRect();
  }
};

// Mulai animasi pattern
AnimationEngine.prototype.start = function(pattern, duration, speed) {
  this.currentPattern = pattern;
  this.duration = duration || pattern.duration || 30;
  this.speed = speed || 1.0;

  // Reduced motion: kurangi speed 50%
  var effectiveSpeed = this.reducedMotion ? this.speed * 0.5 : this.speed;

  this.elapsed = 0;
  this.pausedAt = 0;
  this.progress = 0;
  this.state = 'playing';

  // Reset ball appearance
  this.ball.classList.remove('fading');
  this.ball.classList.add('visible');

  // Khusus blink reminder: sembunyikan bola
  if (pattern.isBlinkReminder) {
    this.ball.style.opacity = '0';
  } else {
    this.ball.style.opacity = '';
  }

  this._updateCanvasRect();
  this.startTime = performance.now();

  var self = this;
  function loop(timestamp) {
    if (self.state !== 'playing') return;

    var effectiveSpeed = self.reducedMotion ? self.speed * 0.5 : self.speed;
    var totalMs = self.duration * 1000;
    self.elapsed = (timestamp - self.startTime);
    self.progress = Math.min(self.elapsed / totalMs, 1);

    // Update posisi bola
    self._updateBallPosition(self.progress * effectiveSpeed);

    // Callback progress
    if (self._onProgress) {
      var remainingSec = Math.max(0, (totalMs - self.elapsed) / 1000);
      self._onProgress(self.progress, remainingSec);
    }

    // Phase label untuk breathing
    if (self._onPhaseLabel && pattern.getPhaseLabel) {
      self._onPhaseLabel(pattern.getPhaseLabel(self.progress));
    }

    // Cek selesai
    if (self.progress >= 1) {
      self.state = 'idle';
      if (self._onComplete) {
        self._onComplete();
      }
      return;
    }

    self.rafId = requestAnimationFrame(loop);
  }

  this.rafId = requestAnimationFrame(loop);
};

// Update posisi bola berdasarkan progress
AnimationEngine.prototype._updateBallPosition = function(t) {
  if (!this.currentPattern || !this._canvasRect) return;

  var rect = this._canvasRect;
  var pattern = this.currentPattern;

  // Hitung posisi dari path function (return 0–1)
  var pos = pattern.path(t);

  // Margin 10% dari viewport
  var marginX = rect.width * 0.1;
  var marginY = rect.height * 0.1;
  var areaW = rect.width - marginX * 2;
  var areaH = rect.height - marginY * 2;

  var pixelX = marginX + pos.x * areaW;
  var pixelY = marginY + pos.y * areaH;

  this.ball.style.left = pixelX + 'px';
  this.ball.style.top = pixelY + 'px';

  // Focus Shift / Breathing: ubah ukuran bola
  if (pattern.getScale) {
    var scale = pattern.getScale(t);
    var baseSize = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--ball-radius')) || 20;
    var newRadius = baseSize * scale;
    this.ball.style.width = (newRadius * 2) + 'px';
    this.ball.style.height = (newRadius * 2) + 'px';
    // Sesuaikan glow
    var glowSize = 20 * scale;
    var glowColor = getComputedStyle(document.documentElement).getPropertyValue('--ball-glow').trim();
    this.ball.style.boxShadow = '0 0 ' + glowSize + 'px ' + glowColor + ', 0 0 ' + (glowSize * 3) + 'px ' + glowColor;
  } else {
    // Reset ukuran ke default
    this.ball.style.width = '';
    this.ball.style.height = '';
    this.ball.style.boxShadow = '';
  }
};

// Pause animasi
AnimationEngine.prototype.pause = function() {
  if (this.state !== 'playing') return;
  this.state = 'paused';
  this.pausedAt = this.elapsed;
  if (this.rafId) {
    cancelAnimationFrame(this.rafId);
    this.rafId = null;
  }
};

// Resume animasi
AnimationEngine.prototype.resume = function() {
  if (this.state !== 'paused') return;
  this.state = 'playing';

  var self = this;
  var effectiveSpeed = this.reducedMotion ? this.speed * 0.5 : this.speed;
  var totalMs = this.duration * 1000;

  // Sesuaikan startTime agar progress berlanjut dari pausedAt
  this.startTime = performance.now() - this.pausedAt;

  function loop(timestamp) {
    if (self.state !== 'playing') return;

    var currentEffectiveSpeed = self.reducedMotion ? self.speed * 0.5 : self.speed;

    self.elapsed = (timestamp - self.startTime);
    self.progress = Math.min(self.elapsed / totalMs, 1);

    self._updateBallPosition(self.progress * currentEffectiveSpeed);

    if (self._onProgress) {
      var remainingSec = Math.max(0, (totalMs - self.elapsed) / 1000);
      self._onProgress(self.progress, remainingSec);
    }

    if (self._onPhaseLabel && self.currentPattern && self.currentPattern.getPhaseLabel) {
      self._onPhaseLabel(self.currentPattern.getPhaseLabel(self.progress));
    }

    if (self.progress >= 1) {
      self.state = 'idle';
      if (self._onComplete) {
        self._onComplete();
      }
      return;
    }

    self.rafId = requestAnimationFrame(loop);
  }

  this.rafId = requestAnimationFrame(loop);
};

// Stop animasi
AnimationEngine.prototype.stop = function() {
  this.state = 'idle';
  this.currentPattern = null;
  this.elapsed = 0;
  this.progress = 0;
  if (this.rafId) {
    cancelAnimationFrame(this.rafId);
    this.rafId = null;
  }
};

// Callback saat pattern selesai
AnimationEngine.prototype.onComplete = function(callback) {
  this._onComplete = callback;
};

// Callback progress (progress 0-1, remainingSec)
AnimationEngine.prototype.onProgress = function(callback) {
  this._onProgress = callback;
};

// Callback phase label (untuk breathing)
AnimationEngine.prototype.onPhaseLabel = function(callback) {
  this._onPhaseLabel = callback;
};

// Auto-pause saat tab tidak aktif
AnimationEngine.prototype._onVisibilityChange = function() {
  if (document.hidden && this.state === 'playing') {
    this.pause();
    this._autoPaused = true;
  } else if (!document.hidden && this._autoPaused) {
    this.resume();
    this._autoPaused = false;
  }
};

// Bersihkan listeners
AnimationEngine.prototype.destroy = function() {
  this.stop();
  window.removeEventListener('resize', this._resizeHandler);
  document.removeEventListener('visibilitychange', this._visibilityHandler);
};
