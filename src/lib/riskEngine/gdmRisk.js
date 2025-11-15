/**
 * Gestational Diabetes Mellitus (GDM) Risk Assessment
 *
 * Key indicators:
 * - Acanthosis nigricans (neck/skin darkening)
 * - Increased adiposity markers
 * - Symptoms: excessive thirst, fatigue, frequent urination
 * - Manual glucose readings
 * - BMI and weight gain
 * - Family history
 */

export class GDMRiskEngine {
  /**
   * Calculate GDM risk
   * @param {Object} data - All collected data
   * @returns {Object} { riskLevel, score, explanation, contributors }
   */
  assessRisk(data) {
    const {
      vision = {},
      vitals = {},
      questionnaire = {},
      demographics = {}
    } = data;

    const factors = [];
    let totalScore = 0;

    // 1. Acanthosis Nigricans (neck darkening - insulin resistance marker)
    if (vision.neckDarkness?.darknessScore > 0.35) {
      const anScore = vision.neckDarkness.darknessScore * 20;
      totalScore += anScore;
      factors.push({
        factor: 'Acanthosis Nigricans (Neck Darkening)',
        contribution: anScore,
        value: `${(vision.neckDarkness.darknessScore * 100).toFixed(0)}% severity`,
        severity: vision.neckDarkness.darknessScore > 0.5 ? 'high' : 'medium'
      });
    }

    // 2. Facial Adiposity (face roundness/fullness indicator)
    if (vision.faceAdiposity?.adiposityScore > 0.45) {
      const adipScore = vision.faceAdiposity.adiposityScore * 12;
      totalScore += adipScore;
      factors.push({
        factor: 'Increased Facial Adiposity',
        contribution: adipScore,
        value: `${(vision.faceAdiposity.adiposityScore * 100).toFixed(0)}% score`,
        severity: 'medium'
      });
    }

    // 3. Abdominal Measurements
    if (vision.abdominalCircumference !== undefined && vision.abdominalCircumference > 100) {
      const abdScore = (vision.abdominalCircumference - 100) * 0.3;
      totalScore += abdScore;
      factors.push({
        factor: 'Increased Abdominal Circumference',
        contribution: abdScore,
        value: `${vision.abdominalCircumference} cm`,
        severity: vision.abdominalCircumference > 110 ? 'high' : 'medium'
      });
    }

    // 4. Manual Glucose Reading
    if (vitals.bloodGlucose !== undefined) {
      if (vitals.bloodGlucose >= 140) {
        const glucoseScore = (vitals.bloodGlucose - 140) * 0.5;
        totalScore += glucoseScore;
        factors.push({
          factor: 'Elevated Blood Glucose',
          contribution: glucoseScore,
          value: `${vitals.bloodGlucose} mg/dL`,
          severity: vitals.bloodGlucose >= 200 ? 'high' : 'medium'
        });
      } else if (vitals.bloodGlucose >= 125) {
        totalScore += 10;
        factors.push({
          factor: 'Borderline Blood Glucose',
          contribution: 10,
          value: `${vitals.bloodGlucose} mg/dL`,
          severity: 'medium'
        });
      }
    }

    // 5. BMI
    if (demographics.bmi !== undefined) {
      if (demographics.bmi >= 30) {
        const bmiScore = (demographics.bmi - 30) * 1.5;
        totalScore += bmiScore;
        factors.push({
          factor: 'Obesity (BMI ≥30)',
          contribution: bmiScore,
          value: `BMI ${demographics.bmi.toFixed(1)}`,
          severity: demographics.bmi >= 35 ? 'high' : 'medium'
        });
      } else if (demographics.bmi >= 25) {
        const bmiScore = (demographics.bmi - 25) * 0.8;
        totalScore += bmiScore;
        factors.push({
          factor: 'Overweight (BMI 25-30)',
          contribution: bmiScore,
          value: `BMI ${demographics.bmi.toFixed(1)}`,
          severity: 'low'
        });
      }
    }

    // 6. Symptoms
    if (questionnaire.excessiveThirst === true) {
      totalScore += 12;
      factors.push({
        factor: 'Excessive Thirst (Polydipsia)',
        contribution: 12,
        value: 'Reported',
        severity: 'medium'
      });
    }

    if (questionnaire.frequentUrination === true) {
      totalScore += 10;
      factors.push({
        factor: 'Frequent Urination (Polyuria)',
        contribution: 10,
        value: 'Reported',
        severity: 'medium'
      });
    }

    if (questionnaire.unusualFatigue === true) {
      totalScore += 8;
      factors.push({
        factor: 'Unusual Fatigue',
        contribution: 8,
        value: 'Reported',
        severity: 'low'
      });
    }

    if (questionnaire.blurredVision === true) {
      totalScore += 9;
      factors.push({
        factor: 'Blurred Vision',
        contribution: 9,
        value: 'Reported',
        severity: 'medium'
      });
    }

    // 7. Risk Factors
    if (demographics.familyHistoryDiabetes === true) {
      totalScore += 15;
      factors.push({
        factor: 'Family History of Diabetes',
        contribution: 15,
        value: 'Yes',
        severity: 'high'
      });
    }

    if (demographics.previousGDM === true) {
      totalScore += 25;
      factors.push({
        factor: 'Previous Gestational Diabetes',
        contribution: 25,
        value: 'Yes',
        severity: 'high'
      });
    }

    if (demographics.age >= 35) {
      totalScore += 8;
      factors.push({
        factor: 'Advanced Maternal Age',
        contribution: 8,
        value: `${demographics.age} years`,
        severity: 'medium'
      });
    }

    if (demographics.pcos === true) {
      totalScore += 12;
      factors.push({
        factor: 'PCOS History',
        contribution: 12,
        value: 'Yes',
        severity: 'high'
      });
    }

    // 8. Large Baby History
    if (demographics.previousLargeBaby === true) {
      totalScore += 10;
      factors.push({
        factor: 'Previous Large Baby (>4kg)',
        contribution: 10,
        value: 'Yes',
        severity: 'medium'
      });
    }

    // Sort by contribution
    factors.sort((a, b) => b.contribution - a.contribution);

    // Determine risk level
    let riskLevel, riskColor;
    if (totalScore >= 45) {
      riskLevel = 'HIGH';
      riskColor = 'red';
    } else if (totalScore >= 25) {
      riskLevel = 'MEDIUM';
      riskColor = 'orange';
    } else {
      riskLevel = 'LOW';
      riskColor = 'green';
    }

    const topFactors = factors.slice(0, 3);
    const explanation = this.generateExplanation(riskLevel, topFactors);

    return {
      condition: 'Gestational Diabetes',
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
      return `HIGH risk for GDM detected. Key indicators: ${topFactors.map(f => f.factor).join(', ')}. Recommend immediate glucose tolerance test (OGTT). Dietary counseling and monitoring advised.`;
    } else if (riskLevel === 'MEDIUM') {
      return `MEDIUM risk for GDM. Contributing factors: ${topFactors.map(f => f.factor).join(', ')}. Schedule glucose screening test. Provide dietary guidance and lifestyle recommendations.`;
    } else {
      return `LOW risk profile for GDM. ${topFactors.length > 0 ? 'Minor factors: ' + topFactors.map(f => f.factor).join(', ') + '.' : 'No significant risk factors.'} Routine screening at 24-28 weeks as per standard protocol.`;
    }
  }
}

export default new GDMRiskEngine();
