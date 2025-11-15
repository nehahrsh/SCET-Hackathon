/**
 * Preeclampsia Risk Assessment Engine
 *
 * Key indicators:
 * - Elevated heart rate variability changes
 * - Pallor (anemia association)
 * - Edema (especially hands/face)
 * - Elevated respiratory rate
 * - Clinical symptoms: headache, visual changes, RUQ pain
 * - Blood pressure (if available)
 * - Maternal age and parity
 */

export class PreeclampsiaRiskEngine {
  /**
   * Calculate preeclampsia risk
   * @param {Object} data - All collected data
   * @returns {Object} { riskLevel, score, explanation, contributors }
   */
  assessRisk(data) {
    const {
      rppg = {},
      vision = {},
      vitals = {},
      questionnaire = {},
      demographics = {}
    } = data;

    const factors = [];
    let totalScore = 0;

    // 1. Heart Rate Variability (HRV changes can indicate autonomic dysfunction)
    if (rppg.hrv !== undefined) {
      if (rppg.hrv < 30) {
        // Low HRV = higher risk
        const hrvScore = 20;
        totalScore += hrvScore;
        factors.push({
          factor: 'Low Heart Rate Variability',
          contribution: hrvScore,
          value: `${rppg.hrv} ms`,
          severity: 'high'
        });
      } else if (rppg.hrv < 40) {
        const hrvScore = 10;
        totalScore += hrvScore;
        factors.push({
          factor: 'Reduced Heart Rate Variability',
          contribution: hrvScore,
          value: `${rppg.hrv} ms`,
          severity: 'medium'
        });
      }
    }

    // 2. Elevated Heart Rate
    if (rppg.hr !== undefined && rppg.hr > 90) {
      const hrScore = (rppg.hr - 90) * 0.5;
      totalScore += hrScore;
      factors.push({
        factor: 'Elevated Heart Rate',
        contribution: hrScore,
        value: `${rppg.hr} bpm`,
        severity: rppg.hr > 100 ? 'high' : 'medium'
      });
    }

    // 3. Facial Edema
    if (vision.faceEdema?.edemaScore > 0.3) {
      const edemaScore = vision.faceEdema.edemaScore * 15;
      totalScore += edemaScore;
      factors.push({
        factor: 'Facial Edema',
        contribution: edemaScore,
        value: `${(vision.faceEdema.edemaScore * 100).toFixed(0)}% severity`,
        severity: vision.faceEdema.edemaScore > 0.5 ? 'high' : 'medium'
      });
    }

    // 4. Hand Edema (significant indicator)
    if (vision.handEdema?.edemaScore > 0.25) {
      const handScore = vision.handEdema.edemaScore * 18;
      totalScore += handScore;
      factors.push({
        factor: 'Hand Edema',
        contribution: handScore,
        value: `${(vision.handEdema.edemaScore * 100).toFixed(0)}% severity`,
        severity: vision.handEdema.edemaScore > 0.4 ? 'high' : 'medium'
      });
    }

    // 5. Pallor (may indicate anemia, common with preeclampsia)
    if (vision.pallor?.pallorScore > 0.4) {
      const pallorScore = vision.pallor.pallorScore * 10;
      totalScore += pallorScore;
      factors.push({
        factor: 'Pallor/Anemia Indicator',
        contribution: pallorScore,
        value: `${(vision.pallor.pallorScore * 100).toFixed(0)}% severity`,
        severity: 'medium'
      });
    }

    // 6. Blood Pressure (if manually entered)
    if (vitals.systolicBP !== undefined && vitals.systolicBP >= 140) {
      const bpScore = (vitals.systolicBP - 140) * 0.8;
      totalScore += bpScore;
      factors.push({
        factor: 'Elevated Blood Pressure',
        contribution: bpScore,
        value: `${vitals.systolicBP}/${vitals.diastolicBP || '?'} mmHg`,
        severity: vitals.systolicBP >= 160 ? 'high' : 'medium'
      });
    }

    if (vitals.diastolicBP !== undefined && vitals.diastolicBP >= 90) {
      const dbpScore = (vitals.diastolicBP - 90) * 0.6;
      totalScore += dbpScore;
      factors.push({
        factor: 'Elevated Diastolic BP',
        contribution: dbpScore,
        value: `${vitals.diastolicBP} mmHg`,
        severity: vitals.diastolicBP >= 110 ? 'high' : 'medium'
      });
    }

    // 7. Symptoms
    if (questionnaire.headache === true) {
      totalScore += 12;
      factors.push({
        factor: 'Severe Headache',
        contribution: 12,
        value: 'Reported',
        severity: 'high'
      });
    }

    if (questionnaire.visualChanges === true) {
      totalScore += 15;
      factors.push({
        factor: 'Visual Changes',
        contribution: 15,
        value: 'Reported',
        severity: 'high'
      });
    }

    if (questionnaire.ruqPain === true) {
      totalScore += 13;
      factors.push({
        factor: 'Right Upper Quadrant Pain',
        contribution: 13,
        value: 'Reported',
        severity: 'high'
      });
    }

    if (questionnaire.suddenEdema === true) {
      totalScore += 10;
      factors.push({
        factor: 'Sudden Edema (reported)',
        contribution: 10,
        value: 'Reported',
        severity: 'medium'
      });
    }

    // 8. Demographic Risk Factors
    if (demographics.age !== undefined) {
      if (demographics.age >= 35 || demographics.age < 20) {
        totalScore += 8;
        factors.push({
          factor: 'Age Risk Factor',
          contribution: 8,
          value: `${demographics.age} years`,
          severity: 'medium'
        });
      }
    }

    if (demographics.firstPregnancy === true) {
      totalScore += 5;
      factors.push({
        factor: 'First Pregnancy',
        contribution: 5,
        value: 'Yes',
        severity: 'low'
      });
    }

    if (demographics.previousPreeclampsia === true) {
      totalScore += 25;
      factors.push({
        factor: 'Previous Preeclampsia',
        contribution: 25,
        value: 'Yes',
        severity: 'high'
      });
    }

    // 9. Respiratory Rate
    if (vision.respiratoryRate?.respiratoryRate > 20) {
      const rrScore = (vision.respiratoryRate.respiratoryRate - 20) * 0.8;
      totalScore += rrScore;
      factors.push({
        factor: 'Elevated Respiratory Rate',
        contribution: rrScore,
        value: `${vision.respiratoryRate.respiratoryRate} breaths/min`,
        severity: 'medium'
      });
    }

    // Sort factors by contribution
    factors.sort((a, b) => b.contribution - a.contribution);

    // Determine risk level
    let riskLevel, riskColor;
    if (totalScore >= 50) {
      riskLevel = 'HIGH';
      riskColor = 'red';
    } else if (totalScore >= 25) {
      riskLevel = 'MEDIUM';
      riskColor = 'orange';
    } else {
      riskLevel = 'LOW';
      riskColor = 'green';
    }

    // Generate explanation
    const topFactors = factors.slice(0, 3);
    const explanation = this.generateExplanation(riskLevel, topFactors);

    return {
      condition: 'Preeclampsia',
      riskLevel,
      riskColor,
      score: Math.min(100, Math.round(totalScore)),
      explanation,
      topContributors: topFactors,
      allFactors: factors,
      timestamp: Date.now()
    };
  }

  generateExplanation(riskLevel, topFactors) {
    if (riskLevel === 'HIGH') {
      return `HIGH risk indicators detected. Primary concerns: ${topFactors.map(f => f.factor).join(', ')}. IMMEDIATE clinical assessment recommended. Check blood pressure, urine protein, and liver enzymes.`;
    } else if (riskLevel === 'MEDIUM') {
      return `MEDIUM risk indicators present. Key factors: ${topFactors.map(f => f.factor).join(', ')}. Increased monitoring recommended. Schedule follow-up within 48-72 hours.`;
    } else {
      return `LOW risk profile. ${topFactors.length > 0 ? 'Minor indicators: ' + topFactors.map(f => f.factor).join(', ') + '.' : 'No significant risk factors detected.'} Continue routine antenatal care.`;
    }
  }
}

export default new PreeclampsiaRiskEngine();
