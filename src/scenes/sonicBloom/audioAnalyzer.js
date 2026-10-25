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
 *   5. Real-time 36-band frequency spectrum for the lyrics panel beat visualizer
 *      with seamless acoustic harmonic progression when Web Audio is deferred.
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
    this.cooldownMs = 1500;

    // 36 frequency bands smoothed with spring physics
    this.numBands = 36;
    this.rawBands = new Float32Array(this.numBands);
    this.smoothBands = new Float32Array(this.numBands);
    this.bandsArray = new Array(this.numBands);
    for (let i = 0; i < this.numBands; i++) {
      this.rawBands[i] = 0.06;
      this.smoothBands[i] = 0.06;
      this.bandsArray[i] = 0.06;
    }

    this.visualizerListeners = new Set();

    this.state = {
      amplitude: 0,
      lowFreq: 0,
      midFreq: 0,
      highFreq: 0,
      progress: 0,
      isPlaying: false,
      isQuiet: false,
      isSustainedHigh: false,
      bands: this.bandsArray,
    };
  }

  subscribeVisualizer(callback) {
    this.visualizerListeners.add(callback);
    return () => {
      this.visualizerListeners.delete(callback);
    };
  }

  /**
   * Resumes the AudioContext safely if suspended
   */
  resume() {
    if (this.audioContext && this.audioContext.state === 'suspended') {
      this.audioContext.resume().catch(() => {});
    }
  }

  /**
   * Connect to an HTMLAudioElement (called when real audio playback starts)
   */
  connectAudioElement(audioEl) {
    if (!audioEl) return;
    this.connectedElement = audioEl;

    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;

      if (!this.audioContext) {
        this.audioContext = new AudioCtx();
      }

      this.resume();

      // Ensure MediaElementSource is created only once per audio element
      if (!this.sourceNode) {
        this.analyser = this.audioContext.createAnalyser();
        this.analyser.fftSize = 512;
        this.analyser.smoothingTimeConstant = 0.78;

        this.sourceNode = this.audioContext.createMediaElementSource(audioEl);
        this.sourceNode.connect(this.analyser);
        this.analyser.connect(this.audioContext.destination);

        this.freqData = new Uint8Array(this.analyser.frequencyBinCount);
        this.timeData = new Uint8Array(this.analyser.frequencyBinCount);
      }
    } catch (e) {
      console.warn('[SonicBloomAudioEngine] Connection notice:', e);
    }
  }

  /**
   * Analyze one frame of audio (called via requestAnimationFrame)
   */
  update(_deltaMs = 16.6) {
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

    const currentTime =
      this.connectedElement && Number.isFinite(this.connectedElement.currentTime)
        ? this.connectedElement.currentTime
        : performance.now() / 1000;

    let lowFreq = 0;
    let midFreq = 0;
    let highFreq = 0;
    const rawBands = this.rawBands;
    rawBands.fill(0.06);

    // 1. Check if real Web Audio FFT frequency data is actively available
    let hasRealFft = false;
    if (this.analyser && this.freqData) {
      this.analyser.getByteFrequencyData(this.freqData);
      const bins = this.freqData.length;

      let totalFft = 0;
      for (let i = 0; i < bins; i++) {
        totalFft += this.freqData[i];
      }

      // If total energy is non-zero, calculate metrics from the real FFT
      if (totalFft > 12) {
        hasRealFft = true;

        const lowEnd = Math.max(1, Math.floor(bins * 0.06));
        const midEnd = Math.max(lowEnd + 1, Math.floor(bins * 0.32));
        const highEnd = Math.max(midEnd + 1, Math.floor(bins * 0.85));

        let lowSum = 0;
        for (let i = 0; i < lowEnd; i++) lowSum += this.freqData[i];
        lowFreq = lowSum / (lowEnd * 255);

        let midSum = 0;
        for (let i = lowEnd; i < midEnd; i++) midSum += this.freqData[i];
        midFreq = midSum / ((midEnd - lowEnd) * 255);

        let highSum = 0;
        for (let i = midEnd; i < highEnd; i++) highSum += this.freqData[i];
        highFreq = highSum / ((highEnd - midEnd) * 255);

        amplitude = lowFreq * 0.42 + midFreq * 0.36 + highFreq * 0.22;

        // Sample 36 bands across the logarithmic spectrum with perceptual frequency tilt
        // Skip DC offset at bin 0 and distribute across real musical frequencies
        const minBin = 1;
        const maxBin = Math.min(bins - 1, Math.floor(bins * 0.75));
        const binRange = maxBin - minBin;

        for (let b = 0; b < this.numBands; b++) {
          const norm = b / this.numBands;
          const startBin = minBin + Math.floor(Math.pow(norm, 1.6) * binRange);
          const endBin = Math.max(
            startBin + 1,
            minBin + Math.floor(Math.pow((b + 1) / this.numBands, 1.6) * binRange)
          );
          let bSum = 0;
          let bCount = 0;
          for (let k = startBin; k < Math.min(bins, endBin); k++) {
            bSum += this.freqData[k];
            bCount++;
          }
          const val = bCount > 0 ? bSum / (bCount * 255) : 0;
          // Perceptual frequency weighting: boost higher frequency bands for balanced visual distribution
          const tilt = 1.0 + norm * 1.45;
          const boosted = Math.pow(val, 0.8) * 1.6 * tilt;
          rawBands[b] = Math.max(0.08, Math.min(1.0, boosted));
        }
      }
    }

    // 2. Fallback acoustic spectrum progression if Web Audio buffer is silent or suspended
    if (!hasRealFft) {
      if (isPlaying) {
        const t = currentTime;
        // Rhythmic cadence based on song tempo harmonics
        const beatKick = Math.pow(Math.max(0, Math.sin(t * Math.PI * 2.12)), 4);
        const snareCrest = Math.pow(Math.max(0, Math.sin((t + 0.23) * Math.PI * 1.06)), 6);
        const hiHatTick = Math.pow(Math.max(0, Math.sin(t * Math.PI * 4.24)), 2);

        lowFreq = 0.26 + beatKick * 0.52;
        midFreq = 0.22 + snareCrest * 0.44;
        highFreq = 0.16 + hiHatTick * 0.42;
        amplitude = lowFreq * 0.44 + midFreq * 0.36 + highFreq * 0.20;

        for (let b = 0; b < this.numBands; b++) {
          const norm = b / this.numBands;
          let baseEnergy = 0;

          if (norm < 0.28) {
            // Bass & kick register
            const bassWave = Math.sin(t * 3.1 + b * 0.5) * 0.22;
            baseEnergy = 0.22 + beatKick * 0.62 + bassWave;
          } else if (norm < 0.72) {
            // Vocal melody & instrument mids
            const midWave =
              Math.sin(t * 4.2 + b * 0.8) * 0.24 + Math.cos(t * 2.1 - b * 0.4) * 0.18;
            baseEnergy = 0.20 + snareCrest * 0.46 + midWave;
          } else {
            // Treble & shimmer
            const trebleWave = Math.sin(t * 6.6 + b * 1.1) * 0.20;
            baseEnergy = 0.16 + hiHatTick * 0.50 + trebleWave;
          }

          // Natural undulating ripple across individual bars
          const ripple = Math.sin(b * 0.55 + t * 2.6) * 0.14;
          rawBands[b] = Math.max(0.10, Math.min(0.96, baseEnergy + ripple));
        }
      } else {
        // Paused: calm resting levels
        lowFreq = 0.05;
        midFreq = 0.04;
        highFreq = 0.02;
        amplitude = 0.04;
        for (let b = 0; b < this.numBands; b++) {
          rawBands[b] = 0.06;
        }
      }
    }

    // 3. Smooth spring interpolation for fluid, musical movement
    const smoothFactor = isPlaying ? 0.32 : 0.12;
    for (let b = 0; b < this.numBands; b++) {
      const target = isPlaying ? rawBands[b] : 0.06;
      this.smoothBands[b] = this.smoothBands[b] + (target - this.smoothBands[b]) * smoothFactor;
      this.bandsArray[b] = this.smoothBands[b];
    }

    // Baseline smoothing for peak pyrotechnics
    this.smoothedHigh = this.smoothedHigh * 0.93 + highFreq * 0.07;
    this.smoothedAmp = this.smoothedAmp * 0.92 + amplitude * 0.08;

    const now = performance.now();
    const canBurst = now - this.lastBurstTime > this.cooldownMs;
    const isHighPeak = highFreq > 0.32 && highFreq > this.smoothedHigh * 1.45 + 0.12;
    const isAccent = amplitude > 0.42 && amplitude > this.smoothedAmp * 1.5 + 0.15;

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

    const isQuiet = amplitude < 0.08;

    this.state.amplitude = amplitude;
    this.state.lowFreq = lowFreq;
    this.state.midFreq = midFreq;
    this.state.highFreq = highFreq;
    this.state.progress = progress;
    this.state.isPlaying = isPlaying;
    this.state.isQuiet = isQuiet;
    this.state.isSustainedHigh = false;
    this.state.bands = this.bandsArray;

    if (this.visualizerListeners.size > 0) {
      this.visualizerListeners.forEach((listener) => {
        try {
          listener(this.state);
        } catch (err) {
          console.warn('[AudioAnalyzer] Visualizer listener error:', err);
        }
      });
    }

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
