/**
 * audioAnalyzer.js
 *
 * Real-time audio analysis engine for SONIC BLOOM.
 * Analyzes audio from the website's own HTMLAudioElement using Web Audio API's
 * AnalyserNode (never requests microphone access).
 *
 * Detects:
 *   1. High-frequency treble transients & peaks (e.g. vocal crests, cymbals, highs)
 *   2. Sustained high-frequency energy
 *   3. Strong musical accents across all frequency bands
 *   4. Quiet passages (for dimming & calming stage lights)
 *
 * Provides a clean event subscription interface and a dev-only trigger
 * so visual pyrotechnics can be tested before and during real audio playback.
 */

// Event listener set for pyrotechnic events
const listeners = new Set();

export function subscribePyrotechnics(callback) {
  listeners.add(callback);
  return () => {
    listeners.delete(callback);
  };
}

export function emitPyrotechnic(event) {
  listeners.forEach((cb) => {
    try {
      cb(event);
    } catch (err) {
      console.warn('[AudioAnalyzer] Listener error:', err);
    }
  });
}

/**
 * Temporary development-only trigger for testing and previewing bursts.
 * Automatically no-ops in production.
 */
export function triggerDevPyrotechnic(type = 'high_freq_peak', detail = {}) {
  if (typeof window !== 'undefined' && import.meta.env?.DEV) {
    emitPyrotechnic({
      type,
      intensity: detail.intensity || 0.85,
      timestamp: Date.now(),
      source: 'dev-trigger',
      ...detail,
    });
  }
}

// Expose on window in DEV for quick console testing if desired
if (typeof window !== 'undefined' && import.meta.env?.DEV) {
  window.__triggerSonicBloomPyro = triggerDevPyrotechnic;
}

/**
 * Creates and manages an AudioContext + AnalyserNode session
 * for an HTMLAudioElement.
 */
export class SonicBloomAudioEngine {
  constructor() {
    this.audioContext = null;
    this.analyser = null;
    this.sourceNode = null;
    this.freqData = null;
    this.timeData = null;
    this.connectedElement = null;

    // Smoothed baselines
    this.smoothedHigh = 0;
    this.smoothedAmp = 0;
    this.highDurationMs = 0;
    this.quietDurationMs = 0;
    this.lastBurstTime = 0;
    this.cooldownMs = 1500; // Minimum 1.5s between full bursts to prevent visual overload

    this.state = {
      amplitude: 0,
      lowFreq: 0,
      midFreq: 0,
      highFreq: 0,
      progress: 0,
      isPlaying: false,
      isQuiet: false,
      isSustainedHigh: false,
    };
  }

  /**
   * Connect to an HTMLAudioElement (called when real audio playback starts)
   */
  connectAudioElement(audioEl) {
    if (!audioEl || this.connectedElement === audioEl) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;

      if (!this.audioContext) {
        this.audioContext = new AudioCtx();
      }

      if (this.audioContext.state === 'suspended') {
        const resume = () => {
          this.audioContext?.resume();
          window.removeEventListener('click', resume);
          window.removeEventListener('keydown', resume);
        };
        window.addEventListener('click', resume, { once: true });
        window.addEventListener('keydown', resume, { once: true });
      }

      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = 512;
      this.analyser.smoothingTimeConstant = 0.8;

      this.sourceNode = this.audioContext.createMediaElementSource(audioEl);
      this.sourceNode.connect(this.analyser);
      this.analyser.connect(this.audioContext.destination);

      this.freqData = new Uint8Array(this.analyser.frequencyBinCount);
      this.timeData = new Uint8Array(this.analyser.frequencyBinCount);
      this.connectedElement = audioEl;
    } catch (e) {
      console.warn('[SonicBloomAudioEngine] Connection error:', e);
    }
  }

  /**
   * Analyze one frame of audio (called via requestAnimationFrame or useFrame)
   */
  update(deltaMs = 16.6) {
    if (!this.analyser || !this.freqData) {
      return this.state;
    }

    this.analyser.getByteFrequencyData(this.freqData);
    const bins = this.freqData.length;

    // Split frequency spectrum into Low / Mid / High
    // bin ~ 86Hz each at 44.1kHz with 512 FFT
    const lowEnd = Math.max(1, Math.floor(bins * 0.05));     // ~0 - 250Hz
    const midEnd = Math.max(lowEnd + 1, Math.floor(bins * 0.30)); // ~250 - 2500Hz
    const highEnd = Math.max(midEnd + 1, Math.floor(bins * 0.85)); // ~2500 - 12000Hz

    let lowSum = 0;
    for (let i = 0; i < lowEnd; i++) lowSum += this.freqData[i];
    const lowFreq = lowSum / (lowEnd * 255);

    let midSum = 0;
    for (let i = lowEnd; i < midEnd; i++) midSum += this.freqData[i];
    const midFreq = midSum / ((midEnd - lowEnd) * 255);

    let highSum = 0;
    for (let i = midEnd; i < highEnd; i++) highSum += this.freqData[i];
    const highFreq = highSum / ((highEnd - midEnd) * 255);

    const amplitude = lowFreq * 0.4 + midFreq * 0.35 + highFreq * 0.25;

    // Baseline smoothing
    this.smoothedHigh = this.smoothedHigh * 0.93 + highFreq * 0.07;
    this.smoothedAmp = this.smoothedAmp * 0.92 + amplitude * 0.08;

    const now = performance.now();
    const canBurst = now - this.lastBurstTime > this.cooldownMs;

    // 1. High-frequency treble transient / peak detection
    // Requires highFreq to significantly exceed smoothed baseline and minimum threshold
    const isHighPeak = highFreq > 0.32 && highFreq > this.smoothedHigh * 1.45 + 0.12;

    // 2. Strong overall musical accent (sudden jump across bands)
    const isAccent = amplitude > 0.42 && amplitude > this.smoothedAmp * 1.5 + 0.15;

    // 3. Sustained high-frequency energy
    if (highFreq > 0.35) {
      this.highDurationMs += deltaMs;
    } else {
      this.highDurationMs = Math.max(0, this.highDurationMs - deltaMs * 2);
    }
    const isSustainedHigh = this.highDurationMs > 350;

    // 4. Quiet passage detection
    if (amplitude < 0.07) {
      this.quietDurationMs += deltaMs;
    } else {
      this.quietDurationMs = 0;
    }
    const isQuiet = this.quietDurationMs > 600;

    // Trigger visual pyrotechnic event if conditions met
    if (canBurst) {
      if (isHighPeak) {
        this.lastBurstTime = now;
        emitPyrotechnic({
          type: 'high_freq_peak',
          intensity: Math.min(1.0, highFreq * 1.5),
          timestamp: now,
          source: 'audio-analysis',
        });
      } else if (isAccent) {
        this.lastBurstTime = now;
        emitPyrotechnic({
          type: 'accent',
          intensity: Math.min(1.0, amplitude * 1.4),
          timestamp: now,
          source: 'audio-analysis',
        });
      }
    }

    if (isSustainedHigh && Math.random() < 0.04) {
      // Occasional gentle sparkle pulse during sustained highs
      emitPyrotechnic({
        type: 'sustained_sparkle',
        intensity: highFreq,
        timestamp: now,
        source: 'audio-analysis',
      });
    }

    const isPlaying = Boolean(
      this.connectedElement &&
        !this.connectedElement.paused &&
        !this.connectedElement.ended &&
        this.connectedElement.currentTime > 0
    );

    const progress =
      this.connectedElement && this.connectedElement.duration
        ? this.connectedElement.currentTime / this.connectedElement.duration
        : 0;

    this.state = {
      amplitude,
      lowFreq,
      midFreq,
      highFreq,
      progress,
      isPlaying,
      isQuiet,
      isSustainedHigh,
    };

    return this.state;
  }

  destroy() {
    try {
      this.sourceNode?.disconnect();
      this.analyser?.disconnect();
      if (this.audioContext && this.audioContext.state !== 'closed') {
        this.audioContext.close();
      }
    } catch {
      // ignore cleanup errors
    }
    this.audioContext = null;
    this.analyser = null;
    this.connectedElement = null;
  }
}
