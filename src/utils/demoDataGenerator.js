/**
 * Demo Data Generator
 * Generates realistic simulated data for testing without real video capture
 */

export class DemoDataGenerator {
  /**
   * Generate complete demo session data
   */
  generateDemoSession(scenario = 'normal') {
    const scenarios = {
      normal: this.generateNormalCase(),
      preeclampsia: this.generatePreeclampsiaCase(),
      gdm: this.generateGDMCase(),
      placentaPrevia: this.generatePlacentaPreviaCase(),
      mixed: this.generateMixedRiskCase()
    };

    return scenarios[scenario] || scenarios.normal;
  }

  /**
   * Normal/low-risk case
   */
  generateNormalCase() {
    return {
      demographics: {
        name: 'Demo Patient (Low Risk)',
        age: 28,
        gestationalWeeks: 24,
        weight: 68,
        height: 165,
        bmi: 25.0,
        parity: 1,
        firstPregnancy: false,
        previousPreeclampsia: false,
        previousGDM: false,
        previousCSection: false,
        familyHistoryDiabetes: false,
        pcos: false
      },
      vision: {
        rppg: {
          hr: 78,
          hrv: 55,
          confidence: 0.85,
          simulated: true
        },
        pallor: {
          pallorScore: 0.15,
          confidence: 0.8
        },
        handEdema: {
          edemaScore: 0.10,
          confidence: 0.75
        },
        footEdema: {
          edemaScore: 0.12,
          confidence: 0.75
        },
        respiratoryRate: {
          respiratoryRate: 16,
          confidence: 0.8
        }
      },
      questionnaire: {
        headache: false,
        visualChanges: false,
        ruqPain: false,
        suddenEdema: false,
        excessiveThirst: false,
        frequentUrination: false,
        vaginalBleeding: false
      },
      vitals: {
        systolicBP: 118,
        diastolicBP: 76
      },
      timestamp: Date.now()
    };
  }

  /**
   * Preeclampsia risk case
   */
  generatePreeclampsiaCase() {
    return {
      demographics: {
        name: 'Demo Patient (Preeclampsia Risk)',
        age: 37,
        gestationalWeeks: 32,
        weight: 82,
        height: 160,
        bmi: 32.0,
        parity: 0,
        firstPregnancy: true,
        previousPreeclampsia: false,
        previousGDM: false,
        previousCSection: false,
        familyHistoryDiabetes: false,
        pcos: false
      },
      vision: {
        rppg: {
          hr: 96,
          hrv: 28,
          confidence: 0.82,
          simulated: true
        },
        pallor: {
          pallorScore: 0.45,
          confidence: 0.85
        },
        handEdema: {
          edemaScore: 0.52,
          confidence: 0.88
        },
        footEdema: {
          edemaScore: 0.58,
          confidence: 0.85
        },
        respiratoryRate: {
          respiratoryRate: 22,
          confidence: 0.75
        }
      },
      questionnaire: {
        headache: true,
        visualChanges: true,
        ruqPain: false,
        suddenEdema: true,
        excessiveThirst: false,
        frequentUrination: false,
        vaginalBleeding: false
      },
      vitals: {
        systolicBP: 152,
        diastolicBP: 98,
        bloodGlucose: 92
      },
      timestamp: Date.now()
    };
  }

  /**
   * GDM risk case
   */
  generateGDMCase() {
    return {
      demographics: {
        name: 'Demo Patient (GDM Risk)',
        age: 34,
        gestationalWeeks: 26,
        weight: 88,
        height: 162,
        bmi: 33.5,
        parity: 2,
        firstPregnancy: false,
        previousPreeclampsia: false,
        previousGDM: true,
        previousCSection: false,
        familyHistoryDiabetes: true,
        pcos: true,
        previousLargeBaby: true
      },
      vision: {
        rppg: {
          hr: 82,
          hrv: 42,
          confidence: 0.88,
          simulated: true
        },
        pallor: {
          pallorScore: 0.22,
          confidence: 0.82
        },
        handEdema: {
          edemaScore: 0.18,
          confidence: 0.78
        },
        footEdema: {
          edemaScore: 0.25,
          confidence: 0.80
        },
        respiratoryRate: {
          respiratoryRate: 18,
          confidence: 0.82
        },
        neckDarkness: {
          darknessScore: 0.58,
          confidence: 0.85
        },
        faceAdiposity: {
          adiposityScore: 0.62,
          confidence: 0.80
        }
      },
      questionnaire: {
        headache: false,
        visualChanges: false,
        ruqPain: false,
        suddenEdema: false,
        excessiveThirst: true,
        frequentUrination: true,
        unusualFatigue: true,
        blurredVision: true,
        vaginalBleeding: false
      },
      vitals: {
        systolicBP: 128,
        diastolicBP: 82,
        bloodGlucose: 156
      },
      timestamp: Date.now()
    };
  }

  /**
   * Placenta previa risk case
   */
  generatePlacentaPreviaCase() {
    return {
      demographics: {
        name: 'Demo Patient (Placenta Previa Risk)',
        age: 36,
        gestationalWeeks: 28,
        weight: 72,
        height: 168,
        bmi: 25.5,
        parity: 3,
        firstPregnancy: false,
        previousPreeclampsia: false,
        previousGDM: false,
        previousCSection: true,
        numberOfCSections: 2,
        previousPlacentalIssue: true,
        familyHistoryDiabetes: false,
        pcos: false
      },
      vision: {
        rppg: {
          hr: 88,
          hrv: 48,
          confidence: 0.80,
          simulated: true
        },
        pallor: {
          pallorScore: 0.38,
          confidence: 0.78
        },
        handEdema: {
          edemaScore: 0.15,
          confidence: 0.75
        },
        footEdema: {
          edemaScore: 0.18,
          confidence: 0.77
        },
        respiratoryRate: {
          respiratoryRate: 19,
          confidence: 0.80
        }
      },
      questionnaire: {
        headache: false,
        visualChanges: false,
        ruqPain: false,
        suddenEdema: false,
        excessiveThirst: false,
        frequentUrination: false,
        vaginalBleeding: true,
        bleedingPainless: true,
        bleedingBright: true,
        bleedingAmount: 'moderate',
        decreasedFetalMovement: false,
        dizziness: true,
        fetalPresentation: 'breech'
      },
      vitals: {
        systolicBP: 122,
        diastolicBP: 78
      },
      timestamp: Date.now()
    };
  }

  /**
   * Mixed high-risk case
   */
  generateMixedRiskCase() {
    return {
      demographics: {
        name: 'Demo Patient (Multiple Risk Factors)',
        age: 39,
        gestationalWeeks: 30,
        weight: 92,
        height: 158,
        bmi: 36.8,
        parity: 3,
        firstPregnancy: false,
        previousPreeclampsia: true,
        previousGDM: true,
        previousCSection: true,
        numberOfCSections: 1,
        familyHistoryDiabetes: true,
        pcos: true,
        previousLargeBaby: true
      },
      vision: {
        rppg: {
          hr: 102,
          hrv: 24,
          confidence: 0.78,
          simulated: true
        },
        pallor: {
          pallorScore: 0.52,
          confidence: 0.82
        },
        handEdema: {
          edemaScore: 0.62,
          confidence: 0.85
        },
        footEdema: {
          edemaScore: 0.68,
          confidence: 0.88
        },
        respiratoryRate: {
          respiratoryRate: 24,
          confidence: 0.75
        },
        neckDarkness: {
          darknessScore: 0.48,
          confidence: 0.80
        },
        faceAdiposity: {
          adiposityScore: 0.58,
          confidence: 0.82
        }
      },
      questionnaire: {
        headache: true,
        visualChanges: true,
        ruqPain: true,
        suddenEdema: true,
        excessiveThirst: true,
        frequentUrination: true,
        unusualFatigue: true,
        blurredVision: true,
        vaginalBleeding: false,
        decreasedFetalMovement: false
      },
      vitals: {
        systolicBP: 162,
        diastolicBP: 104,
        bloodGlucose: 172
      },
      timestamp: Date.now()
    };
  }

  /**
   * Generate random realistic frames for demo
   */
  generateDemoFrames(count = 300, type = 'face') {
    const frames = [];
    const width = 640;
    const height = 480;

    for (let i = 0; i < count; i++) {
      const data = new Uint8ClampedArray(width * height * 4);

      // Generate realistic-looking skin tones
      for (let j = 0; j < data.length; j += 4) {
        if (type === 'face') {
          data[j] = 200 + Math.random() * 30;     // R
          data[j + 1] = 160 + Math.random() * 30; // G
          data[j + 2] = 140 + Math.random() * 20; // B
        } else {
          data[j] = 190 + Math.random() * 40;     // R
          data[j + 1] = 150 + Math.random() * 40; // G
          data[j + 2] = 130 + Math.random() * 30; // B
        }
        data[j + 3] = 255; // A
      }

      frames.push(new ImageData(data, width, height));
    }

    return frames;
  }
}

export default new DemoDataGenerator();
