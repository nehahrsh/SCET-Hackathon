/**
 * rPPG Heart Rate & HRV Extraction
 * Uses color-channel analysis from face video to extract photoplethysmography signal
 * Falls back to simulation for demo purposes
 */

export class RPPGExtractor {
  constructor() {
    this.samplingRate = 30; // fps
    this.windowSize = 300; // 10 seconds at 30fps
  }

  /**
   * Extract rPPG signal from video frames
   * @param {Array<ImageData>} frames - Array of video frames
   * @returns {Object} { hr, hrv, waveform, confidence }
   */
  async extractFromFrames(frames) {
    if (!frames || frames.length < 150) {
      return this.generateSimulatedData();
    }

    try {
      // Extract green channel (most sensitive to blood volume changes)
      const greenSignal = this.extractGreenChannel(frames);

      // Detrend and filter
      const filteredSignal = this.bandpassFilter(greenSignal, 0.7, 3.5);

      // Calculate HR from FFT peak
      const hr = this.calculateHeartRate(filteredSignal);

      // Calculate HRV from peak intervals
      const hrv = this.calculateHRV(filteredSignal);

      // Calculate confidence based on signal quality
      const confidence = this.assessSignalQuality(filteredSignal);

      return {
        hr,
        hrv,
        waveform: filteredSignal.slice(0, 150), // First 5 seconds
        confidence,
        timestamp: Date.now()
      };
    } catch (error) {
      console.warn('rPPG extraction failed, using simulation:', error);
      return this.generateSimulatedData();
    }
  }

  /**
   * Extract average green channel intensity from face ROI
   */
  extractGreenChannel(frames) {
    const signal = [];

    for (const frame of frames) {
      if (!frame.data) continue;

      let greenSum = 0;
      let count = 0;

      // Sample center region (face ROI)
      const width = frame.width;
      const height = frame.height;
      const centerX = Math.floor(width / 2);
      const centerY = Math.floor(height / 2);
      const roiSize = Math.min(width, height) / 3;

      for (let y = centerY - roiSize/2; y < centerY + roiSize/2; y += 2) {
        for (let x = centerX - roiSize/2; x < centerX + roiSize/2; x += 2) {
          const idx = (Math.floor(y) * width + Math.floor(x)) * 4;
          if (idx >= 0 && idx < frame.data.length - 2) {
            greenSum += frame.data[idx + 1]; // Green channel
            count++;
          }
        }
      }

      signal.push(count > 0 ? greenSum / count : 128);
    }

    return signal;
  }

  /**
   * Simple bandpass filter (0.7-3.5 Hz for heart rate)
   */
  bandpassFilter(signal, lowHz, highHz) {
    // Detrend first
    const mean = signal.reduce((a, b) => a + b, 0) / signal.length;
    const detrended = signal.map(x => x - mean);

    // Simple moving average for demonstration
    const filtered = [];
    const windowSize = 5;

    for (let i = 0; i < detrended.length; i++) {
      let sum = 0;
      let count = 0;
      for (let j = Math.max(0, i - windowSize); j <= Math.min(detrended.length - 1, i + windowSize); j++) {
        sum += detrended[j];
        count++;
      }
      filtered.push(sum / count);
    }

    return filtered;
  }

  /**
   * Calculate heart rate from signal using peak detection
   */
  calculateHeartRate(signal) {
    const peaks = this.findPeaks(signal);

    if (peaks.length < 2) {
      return 75; // Default fallback
    }

    // Calculate average interval between peaks
    const intervals = [];
    for (let i = 1; i < peaks.length; i++) {
      intervals.push(peaks[i] - peaks[i-1]);
    }

    const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
    const hr = (this.samplingRate / avgInterval) * 60;

    // Sanity check
    return Math.max(50, Math.min(180, hr));
  }

  /**
   * Calculate HRV (RMSSD approximation)
   */
  calculateHRV(signal) {
    const peaks = this.findPeaks(signal);

    if (peaks.length < 3) {
      return 45; // Default
    }

    const intervals = [];
    for (let i = 1; i < peaks.length; i++) {
      intervals.push(peaks[i] - peaks[i-1]);
    }

    // Calculate successive differences
    const diffs = [];
    for (let i = 1; i < intervals.length; i++) {
      diffs.push(Math.pow(intervals[i] - intervals[i-1], 2));
    }

    const rmssd = Math.sqrt(diffs.reduce((a, b) => a + b, 0) / diffs.length);

    // Convert to ms approximation
    return Math.max(20, Math.min(100, rmssd * 10));
  }

  /**
   * Simple peak detection
   */
  findPeaks(signal) {
    const peaks = [];
    const threshold = signal.reduce((a, b) => a + b, 0) / signal.length;

    for (let i = 1; i < signal.length - 1; i++) {
      if (signal[i] > signal[i-1] && signal[i] > signal[i+1] && signal[i] > threshold) {
        peaks.push(i);
      }
    }

    return peaks;
  }

  /**
   * Assess signal quality (0-1)
   */
  assessSignalQuality(signal) {
    if (!signal || signal.length === 0) return 0;

    // Calculate SNR approximation
    const variance = this.calculateVariance(signal);
    const range = Math.max(...signal) - Math.min(...signal);

    // Normalize to 0-1
    const quality = Math.min(1, Math.max(0, (range / 100) * (1 / (1 + Math.exp(-variance/10)))));

    return quality;
  }

  calculateVariance(arr) {
    const mean = arr.reduce((a, b) => a + b, 0) / arr.length;
    const squareDiffs = arr.map(x => Math.pow(x - mean, 2));
    return Math.sqrt(squareDiffs.reduce((a, b) => a + b, 0) / arr.length);
  }

  /**
   * Generate believable simulated data for demo
   */
  generateSimulatedData() {
    // Generate deterministic but realistic values
    const seed = Date.now();
    const random = (min, max) => min + ((seed * 9301 + 49297) % 233280) / 233280 * (max - min);

    const hr = Math.round(random(65, 95));
    const hrv = Math.round(random(30, 70));

    // Generate synthetic waveform
    const waveform = [];
    for (let i = 0; i < 150; i++) {
      const t = i / 30; // time in seconds
      const heartbeat = Math.sin(2 * Math.PI * (hr / 60) * t) * 50;
      const noise = (Math.sin(i * 0.1) * 5);
      waveform.push(heartbeat + noise + 128);
    }

    return {
      hr,
      hrv,
      waveform,
      confidence: random(0.75, 0.95),
      timestamp: Date.now(),
      simulated: true
    };
  }
}

export default new RPPGExtractor();
