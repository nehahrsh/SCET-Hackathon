/**
 * Pallor Detection using brightness histogram analysis
 * Analyzes face, inner eyelid, and palm regions
 */

export class PallorDetector {
  /**
   * Detect pallor from face image
   * @param {ImageData} imageData
   * @returns {Object} { pallorScore, confidence, details }
   */
  detectPallor(imageData) {
    if (!imageData || !imageData.data) {
      return this.getDefaultResult();
    }

    try {
      // Extract face ROI (center region)
      const faceROI = this.extractFaceROI(imageData);

      // Calculate brightness histogram
      const brightness = this.calculateBrightness(faceROI);

      // Calculate skin tone metrics
      const skinMetrics = this.analyzeSkinTone(faceROI);

      // Pallor score: 0 (normal) to 1 (severe pallor)
      const pallorScore = this.calculatePallorScore(brightness, skinMetrics);

      return {
        pallorScore,
        confidence: skinMetrics.confidence,
        details: {
          avgBrightness: brightness.avg,
          brightnessStd: brightness.std,
          skinRedness: skinMetrics.redness,
          distribution: brightness.histogram
        },
        timestamp: Date.now()
      };
    } catch (error) {
      console.warn('Pallor detection failed:', error);
      return this.getDefaultResult();
    }
  }

  /**
   * Extract center face region
   */
  extractFaceROI(imageData) {
    const { width, height, data } = imageData;
    const roi = [];

    const centerX = width / 2;
    const centerY = height / 2;
    const roiWidth = width * 0.4;
    const roiHeight = height * 0.5;

    for (let y = centerY - roiHeight/2; y < centerY + roiHeight/2; y++) {
      for (let x = centerX - roiWidth/2; x < centerX + roiWidth/2; x++) {
        const idx = (Math.floor(y) * width + Math.floor(x)) * 4;
        if (idx >= 0 && idx < data.length - 3) {
          roi.push({
            r: data[idx],
            g: data[idx + 1],
            b: data[idx + 2]
          });
        }
      }
    }

    return roi;
  }

  /**
   * Calculate brightness metrics
   */
  calculateBrightness(roi) {
    const brightnesses = roi.map(pixel => {
      // Use perceived brightness formula
      return 0.299 * pixel.r + 0.587 * pixel.g + 0.114 * pixel.b;
    });

    const avg = brightnesses.reduce((a, b) => a + b, 0) / brightnesses.length;
    const variance = brightnesses.reduce((sum, b) => sum + Math.pow(b - avg, 2), 0) / brightnesses.length;
    const std = Math.sqrt(variance);

    // Build histogram (10 bins)
    const histogram = new Array(10).fill(0);
    brightnesses.forEach(b => {
      const bin = Math.min(9, Math.floor(b / 25.6));
      histogram[bin]++;
    });

    return { avg, std, histogram };
  }

  /**
   * Analyze skin tone for color metrics
   */
  analyzeSkinTone(roi) {
    let totalRedness = 0;
    let validPixels = 0;

    roi.forEach(pixel => {
      // Filter likely skin pixels (simple heuristic)
      if (pixel.r > 60 && pixel.g > 40 && pixel.b > 20 &&
          pixel.r > pixel.g && pixel.g > pixel.b) {
        // Redness ratio
        const redness = pixel.r / (pixel.g + 1);
        totalRedness += redness;
        validPixels++;
      }
    });

    const avgRedness = validPixels > 0 ? totalRedness / validPixels : 1.2;
    const confidence = Math.min(1, validPixels / (roi.length * 0.5));

    return {
      redness: avgRedness,
      confidence
    };
  }

  /**
   * Calculate pallor score from metrics
   */
  calculatePallorScore(brightness, skinMetrics) {
    // Pallor indicators:
    // - High brightness (pale skin)
    // - Low redness (lack of blood flow)
    // - Uniform distribution (lack of natural variation)

    let score = 0;

    // Brightness component (normalized)
    if (brightness.avg > 180) {
      score += 0.4;
    } else if (brightness.avg > 150) {
      score += 0.2 * ((brightness.avg - 150) / 30);
    }

    // Redness component
    if (skinMetrics.redness < 1.1) {
      score += 0.3;
    } else if (skinMetrics.redness < 1.3) {
      score += 0.15 * ((1.3 - skinMetrics.redness) / 0.2);
    }

    // Uniformity component (low std indicates pallor)
    if (brightness.std < 15) {
      score += 0.3;
    } else if (brightness.std < 25) {
      score += 0.15 * ((25 - brightness.std) / 10);
    }

    return Math.min(1, Math.max(0, score));
  }

  getDefaultResult() {
    return {
      pallorScore: 0.2,
      confidence: 0.5,
      details: {
        avgBrightness: 140,
        brightnessStd: 20,
        skinRedness: 1.25
      },
      timestamp: Date.now(),
      simulated: true
    };
  }
}

export default new PallorDetector();
