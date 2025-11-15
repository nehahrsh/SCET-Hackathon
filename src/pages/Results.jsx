import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Download, Home, Activity, TrendingUp } from 'lucide-react';
import Layout from '../components/layout/Layout';
import ProgressBar from '../components/common/ProgressBar';
import RiskCard from '../components/common/RiskCard';
import localStore from '../lib/storage/localStore';
import preeclampsiaEngine from '../lib/riskEngine/preeclampsiaRisk';
import gdmEngine from '../lib/riskEngine/gdmRisk';
import placentaPreviaEngine from '../lib/riskEngine/placentaPreviaRisk';
import pdfExporter from '../utils/pdfExport';

const Results = () => {
  const navigate = useNavigate();
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sessionData, setSessionData] = useState(null);

  useEffect(() => {
    processResults();
  }, []);

  const processResults = async () => {
    try {
      const session = await localStore.getSession();
      setSessionData(session);

      if (!session) {
        navigate('/');
        return;
      }

      // Calculate all risk assessments
      const preeclampsiaRisk = preeclampsiaEngine.assessRisk(session);
      const gdmRisk = gdmEngine.assessRisk(session);
      const placentaPreviaRisk = placentaPreviaEngine.assessRisk(session);

      const assessment = {
        preeclampsia: preeclampsiaRisk,
        gdm: gdmRisk,
        placentaPrevia: placentaPreviaRisk,
        demographics: session.demographics,
        questionnaire: session.questionnaire,
        vitals: session.vitals,
        vision: session.vision,
        timestamp: Date.now()
      };

      setResults(assessment);

      // Save assessment
      await localStore.saveAssessment(assessment);

      setLoading(false);
    } catch (error) {
      console.error('Error processing results:', error);
      setLoading(false);
    }
  };

  const handleExportPDF = () => {
    if (!results) return;

    const pdf = pdfExporter.generateReport(results);
    const filename = `mamasafe-${results.demographics?.name?.replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.pdf`;
    pdfExporter.download(pdf, filename);
  };

  const handleNewAssessment = async () => {
    await localStore.clearSession();
    navigate('/');
  };

  const getOverallRiskLevel = () => {
    if (!results) return 'LOW';

    const risks = [
      results.preeclampsia?.riskLevel,
      results.gdm?.riskLevel,
      results.placentaPrevia?.triageLevel
    ];

    if (risks.includes('HIGH') || risks.includes('IMMEDIATE')) return 'HIGH';
    if (risks.includes('MEDIUM') || risks.includes('URGENT')) return 'MEDIUM';
    return 'LOW';
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            className="w-16 h-16 border-4 border-medical-200 border-t-medical-600 rounded-full"
          />
          <p className="ml-4 text-lg font-medium text-gray-900">
            Calculating risk assessment...
          </p>
        </div>
      </Layout>
    );
  }

  if (!results) {
    return (
      <Layout>
        <div className="text-center py-12">
          <p className="text-gray-600">No assessment data found.</p>
          <button
            onClick={() => navigate('/')}
            className="mt-4 text-medical-600 hover:text-medical-700 font-medium"
          >
            Return to Home
          </button>
        </div>
      </Layout>
    );
  }

  const overallRisk = getOverallRiskLevel();

  return (
    <Layout>
      <div className="max-w-5xl mx-auto">
        <ProgressBar
          current={4}
          total={4}
          labels={['Patient Info', 'Video Capture', 'Questionnaire', 'Results']}
        />

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl p-8 mb-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Risk Assessment Complete</h2>
              <p className="text-gray-500 mt-1">
                Patient: {results.demographics?.name} | {new Date(results.timestamp).toLocaleString()}
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleExportPDF}
              className="bg-medical-600 hover:bg-medical-700 text-white px-6 py-3 rounded-xl flex items-center gap-2 shadow-lg font-medium"
            >
              <Download className="w-5 h-5" />
              Export PDF Report
            </motion.button>
          </div>

          {/* Overall Summary */}
          <div className={`rounded-xl p-6 ${
            overallRisk === 'HIGH'
              ? 'bg-red-50 border-2 border-red-200'
              : overallRisk === 'MEDIUM'
              ? 'bg-orange-50 border-2 border-orange-200'
              : 'bg-green-50 border-2 border-green-200'
          }`}>
            <div className="flex items-center gap-3 mb-3">
              <TrendingUp className={`w-6 h-6 ${
                overallRisk === 'HIGH'
                  ? 'text-red-600'
                  : overallRisk === 'MEDIUM'
                  ? 'text-orange-600'
                  : 'text-green-600'
              }`} />
              <h3 className="text-xl font-semibold">
                Overall Risk Level: <span className={
                  overallRisk === 'HIGH'
                    ? 'text-red-700'
                    : overallRisk === 'MEDIUM'
                    ? 'text-orange-700'
                    : 'text-green-700'
                }>{overallRisk}</span>
              </h3>
            </div>
            <p className={`text-sm ${
              overallRisk === 'HIGH'
                ? 'text-red-800'
                : overallRisk === 'MEDIUM'
                ? 'text-orange-800'
                : 'text-green-800'
            }`}>
              {overallRisk === 'HIGH'
                ? '⚠️ HIGH RISK DETECTED: Immediate clinical assessment required. Refer to physician or facility with advanced maternal care capabilities.'
                : overallRisk === 'MEDIUM'
                ? '⚡ MEDIUM RISK: Increased monitoring recommended. Schedule follow-up within 48-72 hours and consider additional testing.'
                : '✓ LOW RISK: No immediate concerns detected. Continue routine antenatal care and standard monitoring schedule.'}
            </p>
          </div>
        </motion.div>

        {/* Vital Signs Summary */}
        {sessionData?.vision?.rppg && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl shadow-xl p-6 mb-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <Activity className="w-6 h-6 text-medical-600" />
              <h3 className="text-xl font-semibold text-gray-900">Biometric Readings</h3>
            </div>
            <div className="grid md:grid-cols-4 gap-4">
              <div className="bg-medical-50 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-1">Heart Rate</p>
                <p className="text-2xl font-bold text-medical-700">
                  {sessionData.vision.rppg.hr} <span className="text-sm font-normal">bpm</span>
                </p>
              </div>
              <div className="bg-medical-50 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-1">HRV</p>
                <p className="text-2xl font-bold text-medical-700">
                  {sessionData.vision.rppg.hrv} <span className="text-sm font-normal">ms</span>
                </p>
              </div>
              {sessionData.vision.respiratoryRate && (
                <div className="bg-medical-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">Respiratory Rate</p>
                  <p className="text-2xl font-bold text-medical-700">
                    {sessionData.vision.respiratoryRate.respiratoryRate} <span className="text-sm font-normal">/min</span>
                  </p>
                </div>
              )}
              {sessionData.vitals?.systolicBP && (
                <div className="bg-medical-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">Blood Pressure</p>
                  <p className="text-2xl font-bold text-medical-700">
                    {sessionData.vitals.systolicBP}/{sessionData.vitals.diastolicBP}
                    <span className="text-sm font-normal ml-1">mmHg</span>
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Risk Cards */}
        <div className="space-y-4 mb-8">
          <RiskCard risk={results.preeclampsia} />
          <RiskCard risk={results.gdm} />
          <RiskCard risk={results.placentaPrevia} />
        </div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex gap-4"
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleNewAssessment}
            className="flex-1 bg-gradient-to-r from-medical-600 to-medical-700 text-white px-8 py-4 rounded-xl flex items-center justify-center gap-3 shadow-lg font-semibold"
          >
            <Home className="w-5 h-5" />
            New Assessment
          </motion.button>
        </motion.div>

        {/* Clinical Recommendations */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-8 bg-amber-50 border border-amber-200 rounded-xl p-6"
        >
          <h4 className="font-semibold text-amber-900 mb-3">Clinical Recommendations</h4>
          <ul className="space-y-2 text-sm text-amber-800">
            <li className="flex gap-2">
              <span>•</span>
              <span>Verify all findings with standard clinical tools and laboratory tests</span>
            </li>
            <li className="flex gap-2">
              <span>•</span>
              <span>Document all risk factors in patient medical record</span>
            </li>
            <li className="flex gap-2">
              <span>•</span>
              <span>For HIGH risk cases: Consider immediate referral to higher-level facility</span>
            </li>
            <li className="flex gap-2">
              <span>•</span>
              <span>Provide patient education on warning signs and when to seek immediate care</span>
            </li>
            <li className="flex gap-2">
              <span>•</span>
              <span>Schedule appropriate follow-up based on risk level and local protocols</span>
            </li>
          </ul>
        </motion.div>
      </div>
    </Layout>
  );
};

export default Results;
