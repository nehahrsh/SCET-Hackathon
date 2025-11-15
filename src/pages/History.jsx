import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, Trash2, FileText, ChevronRight, AlertCircle } from 'lucide-react';
import Layout from '../components/layout/Layout';
import localStore from '../lib/storage/localStore';
import pdfExporter from '../utils/pdfExport';

const History = () => {
  const navigate = useNavigate();
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAssessments();
  }, []);

  const loadAssessments = async () => {
    const saved = await localStore.getAllAssessments();
    // Sort by most recent first
    saved.sort((a, b) => b.savedAt - a.savedAt);
    setAssessments(saved);
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this assessment?')) {
      await localStore.deleteAssessment(id);
      loadAssessments();
    }
  };

  const handleExportPDF = (assessment) => {
    const pdf = pdfExporter.generateReport(assessment);
    const filename = `nurtura-${assessment.demographics?.name?.replace(/\s+/g, '-')}-${new Date(assessment.savedAt).toISOString().split('T')[0]}.pdf`;
    pdfExporter.download(pdf, filename);
  };

  const handleView = async (assessment) => {
    // Save to session and navigate to results
    await localStore.saveSession(assessment);
    navigate('/results');
  };

  const getRiskColor = (assessment) => {
    const risks = [
      assessment.preeclampsia?.riskLevel,
      assessment.gdm?.riskLevel,
      assessment.placentaPrevia?.triageLevel
    ];

    if (risks.includes('HIGH') || risks.includes('IMMEDIATE')) {
      return 'bg-rose-100 border-rose-300 text-rose-800';
    }
    if (risks.includes('MEDIUM') || risks.includes('URGENT')) {
      return 'bg-amber-100 border-amber-300 text-amber-800';
    }
    return 'bg-green-100 border-green-300 text-green-800';
  };

  const getRiskLabel = (assessment) => {
    const risks = [
      assessment.preeclampsia?.riskLevel,
      assessment.gdm?.riskLevel,
      assessment.placentaPrevia?.triageLevel
    ];

    if (risks.includes('HIGH') || risks.includes('IMMEDIATE')) return 'HIGH RISK';
    if (risks.includes('MEDIUM') || risks.includes('URGENT')) return 'MEDIUM RISK';
    return 'LOW RISK';
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            className="w-16 h-16 border-4 border-nurtura-200 border-t-nurtura-600 rounded-full"
          />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h2 className="text-3xl font-display font-semibold bg-gradient-to-r from-nurtura-600 to-rose-600 bg-clip-text text-transparent mb-2">
            Assessment History
          </h2>
          <p className="text-gray-600 font-light">
            View and manage your saved assessments
          </p>
        </motion.div>

        {assessments.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-sm p-12 text-center border border-nurtura-100"
          >
            <Clock className="w-16 h-16 text-nurtura-300 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-700 mb-2">No Saved Assessments</h3>
            <p className="text-gray-500 mb-6 font-light">
              Complete an assessment to see it saved here
            </p>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/patient-info')}
              className="bg-gradient-to-r from-nurtura-500 to-rose-500 text-white px-8 py-3 rounded-xl shadow-md font-medium"
            >
              Start New Assessment
            </motion.button>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {assessments.map((assessment, idx) => (
              <motion.div
                key={assessment.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-nurtura-100 overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-gray-900">
                        {assessment.demographics?.name || 'Unnamed Patient'}
                      </h3>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-500 font-light">
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {new Date(assessment.savedAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                        <span>
                          Age: {assessment.demographics?.age || 'N/A'}
                        </span>
                        <span>
                          {assessment.demographics?.gestationalWeeks || 'N/A'} weeks
                        </span>
                      </div>
                    </div>
                    <div className={`px-4 py-2 rounded-full text-xs font-medium border ${getRiskColor(assessment)}`}>
                      {getRiskLabel(assessment)}
                    </div>
                  </div>

                  {/* Risk Summary */}
                  <div className="grid md:grid-cols-3 gap-3 mb-4">
                    {assessment.preeclampsia && (
                      <div className="bg-nurtura-50 rounded-lg p-3 border border-nurtura-100">
                        <p className="text-xs text-gray-600 font-light mb-1">Preeclampsia</p>
                        <p className={`text-sm font-medium ${
                          assessment.preeclampsia.riskLevel === 'HIGH'
                            ? 'text-rose-700'
                            : assessment.preeclampsia.riskLevel === 'MEDIUM'
                            ? 'text-amber-700'
                            : 'text-green-700'
                        }`}>
                          {assessment.preeclampsia.riskLevel} ({assessment.preeclampsia.score}/100)
                        </p>
                      </div>
                    )}
                    {assessment.gdm && (
                      <div className="bg-nurtura-50 rounded-lg p-3 border border-nurtura-100">
                        <p className="text-xs text-gray-600 font-light mb-1">Gestational Diabetes</p>
                        <p className={`text-sm font-medium ${
                          assessment.gdm.riskLevel === 'HIGH'
                            ? 'text-rose-700'
                            : assessment.gdm.riskLevel === 'MEDIUM'
                            ? 'text-amber-700'
                            : 'text-green-700'
                        }`}>
                          {assessment.gdm.riskLevel} ({assessment.gdm.score}/100)
                        </p>
                      </div>
                    )}
                    {assessment.placentaPrevia && (
                      <div className="bg-nurtura-50 rounded-lg p-3 border border-nurtura-100">
                        <p className="text-xs text-gray-600 font-light mb-1">Placenta Previa</p>
                        <p className={`text-sm font-medium ${
                          assessment.placentaPrevia.triageLevel === 'IMMEDIATE'
                            ? 'text-rose-700'
                            : assessment.placentaPrevia.triageLevel === 'URGENT'
                            ? 'text-amber-700'
                            : 'text-green-700'
                        }`}>
                          {assessment.placentaPrevia.triageLevel} ({assessment.placentaPrevia.score}/100)
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleView(assessment)}
                      className="flex-1 bg-gradient-to-r from-nurtura-500 to-rose-500 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 font-medium shadow-sm"
                    >
                      View Details
                      <ChevronRight className="w-4 h-4" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleExportPDF(assessment)}
                      className="px-4 py-2 border border-nurtura-300 text-nurtura-700 rounded-lg flex items-center gap-2 font-medium hover:bg-nurtura-50"
                    >
                      <FileText className="w-4 h-4" />
                      PDF
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleDelete(assessment.id)}
                      className="px-4 py-2 border border-rose-300 text-rose-700 rounded-lg flex items-center gap-2 font-medium hover:bg-rose-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Info Box */}
        {assessments.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-8 bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3"
          >
            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-amber-800 font-light">
              <p className="font-medium mb-1">Data Privacy Notice</p>
              <p>
                All assessments are stored locally on your device. They are not uploaded to any cloud service.
                Clearing your browser data will permanently delete all saved assessments.
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </Layout>
  );
};

export default History;
