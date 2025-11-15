/**
 * Edema Detection using contour analysis
 * Detects swelling in hands and feet through region expansion
 */

export class EdemaDetector {
  /**
   * Detect edema from hand/foot image
   * @param {ImageData} imageData
   * @param {string} region - 'hand' or 'foot'
   * @returns {Object} { edemaScore, confidence, details }
   */
  detectEdema(imageData, region = 'hand') {
    if (!imageData || !imageData.data) {
      return this.getDefaultResult();
    }

    try {
      // Detect skin regions
      const skinMask = this.detectSkinRegion(imageData);

      // Calculate region metrics
      const metrics = this.calculateRegionMetrics(skinMask, imageData);

      // Detect swelling indicators
      const swellingScore = this.assessSwelling(metrics, region);

      return {
        edemaScore: swellingScore,
        confidence: metrics.confidence,
        details: {
          regionArea: metrics.area,
          perimeter: metrics.perimeter,
          circularity: metrics.circularity,
          puffiness: metrics.puffiness,
          region
        },
        timestamp: Date.now()
      };
    } catch (error) {
      console.warn('Edema detection failed:', error);
      return this.getDefaultResult();
    }
  }

  /**
   * Simple skin detection using color thresholding
   */
  detectSkinRegion(imageData) {
    const { width, height, data } = imageData;
    const mask = new Array(width * height).fill(0);

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];

      // Skin color detection (simple RGB thresholds)
      if (r > 95 && g > 40 && b > 20 &&
          r > g && r > b &&
          Math.abs(r - g) > 15) {
        mask[i / 4] = 1;
      }
    }

    return mask;
  }

  /**
   * Calculate region metrics from mask
   */
  calculateRegionMetrics(mask, imageData) {
    const { width, height } = imageData;
    let area = 0;
    let minX = width, maxX = 0, minY = height, maxY = 0;

    // Calculate bounding box and area
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        if (mask[y * width + x] === 1) {
          area++;
          minX = Math.min(minX, x);
          maxX = Math.max(maxX, x);
          minY = Math.min(minY, y);
          maxY = Math.max(maxY, y);
        }
      }
    }

    const boundingWidth = maxX - minX;
    const boundingHeight = maxY - minY;
    const boundingArea = boundingWidth * boundingHeight;

    // Circularity: how "puffy" the region is
    const perimeter = this.estimatePerimeter(mask, width, height);
    const circularity = boundingArea > 0 ? area / boundingArea : 0;

    // Puffiness: ratio of area to perimeter (higher = more swollen)
    const puffiness = perimeter > 0 ? area / perimeter : 0;

    const confidence = area > 1000 ? 0.8 : 0.5;

    return {
      area,
      perimeter,
      circularity,
      puffiness,
      boundingWidth,
      boundingHeight,
      confidence
    };
  }

  /**
   * Estimate perimeter using edge detection
   */
  estimatePerimeter(mask, width, height) {
    let perimeter = 0;

    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        const idx = y * width + x;
        if (mask[idx] === 1) {
          // Check if it's on the edge
          if (mask[idx - 1] === 0 || mask[idx + 1] === 0 ||
              mask[idx - width] === 0 || mask[idx + width] === 0) {
            perimeter++;
          }
        }
      }
    }

    return perimeter;
  }

  /**
   * Assess swelling from metrics
   */
  assessSwelling(metrics, region) {
    let score = 0;

    // High circularity suggests puffiness (normal hands/feet have lower values)
    const normalCircularity = region === 'hand' ? 0.6 : 0.65;
    if (metrics.circularity > normalCircularity + 0.15) {
      score += 0.4;
    } else if (metrics.circularity > normalCircularity) {
      score += 0.2 * ((metrics.circularity - normalCircularity) / 0.15);
    }

    // High puffiness ratio
    const normalPuffiness = region === 'hand' ? 2.5 : 2.8;
    if (metrics.puffiness > normalPuffiness + 0.8) {
      score += 0.3;
    } else if (metrics.puffiness > normalPuffiness) {
      score += 0.15 * ((metrics.puffiness - normalPuffiness) / 0.8);
    }

    // Large area relative to frame
    const areaRatio = metrics.area / (metrics.boundingWidth * metrics.boundingHeight * 4);
    if (areaRatio > 0.25) {
      score += 0.3;
    } else if (areaRatio > 0.18) {
      score += 0.15 * ((areaRatio - 0.18) / 0.07);
    }

    return Math.min(1, Math.max(0, score));
  }

  getDefaultResult() {
    return {
      edemaScore: 0.15,
      confidence: 0.5,
      details: {
        regionArea: 5000,
        perimeter: 800,
        circularity: 0.62,
        puffiness: 2.6
      },
      timestamp: Date.now(),
      simulated: true
    };
  }
}

export default new EdemaDetector();
