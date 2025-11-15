/**
 * Placenta Previa Triage Assessment
 *
 * This is NOT a diagnostic tool - only helps triage bleeding cases
 *
 * Key indicators:
 * - Painless vaginal bleeding (especially in 2nd/3rd trimester)
 * - Prior cesarean section
 * - Multiple previous pregnancies
 * - Bleeding photo analysis (color, volume estimate)
 * - Fundal height position
 * - Fetal presentation
 */

export class PlacentaPreviaRiskEngine {
  /**
   * Assess triage priority for placenta previa
   * @param {Object} data
   * @returns {Object} { triageLevel, urgency, explanation, contributors }
   */
  assessRisk(data) {
    const {
      vision = {},
      questionnaire = {},
      demographics = {}
    } = data;

    const factors = [];
    let urgencyScore = 0;

    // 1. Bleeding Analysis
    if (questionnaire.vaginalBleeding === true) {
      urgencyScore += 30;
      factors.push({
        factor: 'Vaginal Bleeding Present',
        contribution: 30,
        value: 'Reported',
        severity: 'high'
      });

      // Bleeding characteristics
      if (questionnaire.bleedingPainless === true) {
        urgencyScore += 15;
        factors.push({
          factor: 'Painless Bleeding (Classic Sign)',
          contribution: 15,
          value: 'Yes',
          severity: 'high'
        });
      }

      if (questionnaire.bleedingBright === true) {
        urgencyScore += 8;
        factors.push({
          factor: 'Bright Red Blood',
          contribution: 8,
          value: 'Yes',
          severity: 'medium'
        });
      }

      if (questionnaire.bleedingAmount === 'heavy') {
        urgencyScore += 20;
        factors.push({
          factor: 'Heavy Bleeding Volume',
          contribution: 20,
          value: 'Heavy',
          severity: 'high'
        });
      } else if (questionnaire.bleedingAmount === 'moderate') {
        urgencyScore += 10;
        factors.push({
          factor: 'Moderate Bleeding',
          contribution: 10,
          value: 'Moderate',
          severity: 'medium'
        });
      }
    }

    // 2. Bleeding Photo Analysis (if provided)
    if (vision.bleedingPhoto) {
      const { volumeEstimate, bloodColor } = vision.bleedingPhoto;

      if (volumeEstimate > 0.5) {
        urgencyScore += 12;
        factors.push({
          factor: 'Significant Blood Volume (Photo)',
          contribution: 12,
          value: `${(volumeEstimate * 100).toFixed(0)}% estimate`,
          severity: 'high'
        });
      }

      if (bloodColor === 'bright') {
        urgencyScore += 6;
        factors.push({
          factor: 'Bright Blood (Photo Analysis)',
          contribution: 6,
          value: 'Bright red',
          severity: 'medium'
        });
      }
    }

    // 3. Risk Factors
    if (demographics.previousCSection === true) {
      const csectionCount = demographics.numberOfCSections || 1;
      const csScore = csectionCount * 12;
      urgencyScore += csScore;
      factors.push({
        factor: 'Previous Cesarean Section',
        contribution: csScore,
        value: `${csectionCount} prior C-section(s)`,
        severity: csectionCount > 1 ? 'high' : 'medium'
      });
    }

    if (demographics.parity !== undefined && demographics.parity >= 3) {
      urgencyScore += 10;
      factors.push({
        factor: 'Multiparity (≥3 births)',
        contribution: 10,
        value: `${demographics.parity} previous births`,
        severity: 'medium'
      });
    }

    if (demographics.maternalAge >= 35) {
      urgencyScore += 8;
      factors.push({
        factor: 'Advanced Maternal Age',
        contribution: 8,
        value: `${demographics.maternalAge} years`,
        severity: 'medium'
      });
    }

    if (demographics.previousPlacentalIssue === true) {
      urgencyScore += 18;
      factors.push({
        factor: 'Previous Placenta Previa/Accreta',
        contribution: 18,
        value: 'Yes',
        severity: 'high'
      });
    }

    // 4. Gestational Age
    if (questionnaire.gestationalWeeks !== undefined) {
      const weeks = questionnaire.gestationalWeeks;

      if (weeks >= 20 && weeks < 37 && questionnaire.vaginalBleeding) {
        urgencyScore += 10;
        factors.push({
          factor: 'Bleeding in 2nd/3rd Trimester',
          contribution: 10,
          value: `${weeks} weeks`,
          severity: 'high'
        });
      }

      if (weeks >= 28 && questionnaire.vaginalBleeding) {
        urgencyScore += 8;
        factors.push({
          factor: 'Third Trimester Bleeding',
          contribution: 8,
          value: `${weeks} weeks`,
          severity: 'high'
        });
      }
    }

    // 5. Fetal Presentation
    if (questionnaire.fetalPresentation === 'breech' || questionnaire.fetalPresentation === 'transverse') {
      urgencyScore += 12;
      factors.push({
        factor: 'Abnormal Fetal Presentation',
        contribution: 12,
        value: questionnaire.fetalPresentation,
        severity: 'medium'
      });
    }

    // 6. Symptoms
    if (questionnaire.decreasedFetalMovement === true) {
      urgencyScore += 15;
      factors.push({
        factor: 'Decreased Fetal Movement',
        contribution: 15,
        value: 'Reported',
        severity: 'high'
      });
    }

    if (questionnaire.dizziness === true && questionnaire.vaginalBleeding === true) {
      urgencyScore += 10;
      factors.push({
        factor: 'Dizziness with Bleeding',
        contribution: 10,
        value: 'Reported',
        severity: 'high'
      });
    }

    // 7. Fundal Height Changes
    if (vision.fundalHeight?.abnormalChange === true) {
      urgencyScore += 8;
      factors.push({
        factor: 'Abnormal Fundal Height',
        contribution: 8,
        value: 'Detected',
        severity: 'medium'
      });
    }

    // Sort by contribution
    factors.sort((a, b) => b.contribution - a.contribution);

    // Determine triage level
    let triageLevel, urgencyColor;
    if (urgencyScore >= 50) {
      triageLevel = 'IMMEDIATE';
      urgencyColor = 'red';
    } else if (urgencyScore >= 30) {
      triageLevel = 'URGENT';
      urgencyColor = 'orange';
    } else if (urgencyScore >= 15) {
      triageLevel = 'SEMI-URGENT';
      urgencyColor = 'yellow';
    } else {
      triageLevel = 'ROUTINE';
      urgencyColor = 'green';
    }

    const topFactors = factors.slice(0, 3);
    const explanation = this.generateExplanation(triageLevel, topFactors, questionnaire.vaginalBleeding);

    return {
      condition: 'Placenta Previa (Triage)',
      triageLevel,
      urgencyColor,
      score: Math.min(100, Math.round(urgencyScore)),
      explanation,
      topContributors: topFactors,
      allFactors: factors,
      timestamp: Date.now()
    };
  }

  generateExplanation(level, topFactors, hasBleeding) {
    if (level === 'IMMEDIATE') {
      return `IMMEDIATE referral required. Critical indicators: ${topFactors.map(f => f.factor).join(', ')}. DO NOT perform vaginal examination. Arrange immediate ultrasound and hospital transfer. Patient should NOT travel alone.`;
    } else if (level === 'URGENT') {
      return `URGENT evaluation needed. Key concerns: ${topFactors.map(f => f.factor).join(', ')}. Arrange ultrasound within 24 hours. Advise pelvic rest and monitoring. Consider hospital referral.`;
    } else if (level === 'SEMI-URGENT') {
      return `SEMI-URGENT assessment recommended. Factors: ${topFactors.map(f => f.factor).join(', ')}. Schedule ultrasound within 3-5 days. Provide precautionary advice: pelvic rest, monitor bleeding.`;
    } else {
      if (hasBleeding) {
        return `Lower urgency but bleeding present. Schedule routine ultrasound. Monitor symptoms and provide patient education on warning signs.`;
      } else {
        return `ROUTINE monitoring appropriate. ${topFactors.length > 0 ? 'Risk factors present: ' + topFactors.map(f => f.factor).join(', ') : 'No significant triage indicators.'}`;
      }
    }
  }
}

export default new PlacentaPreviaRiskEngine();
