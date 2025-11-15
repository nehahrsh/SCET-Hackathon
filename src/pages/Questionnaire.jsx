import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, ClipboardList } from 'lucide-react';
import Layout from '../components/layout/Layout';
import ProgressBar from '../components/common/ProgressBar';
import localStore from '../lib/storage/localStore';

const Questionnaire = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    // General symptoms
    headache: false,
    visualChanges: false,
    ruqPain: false,
    suddenEdema: false,
    decreasedFetalMovement: false,
    dizziness: false,

    // GDM symptoms
    excessiveThirst: false,
    frequentUrination: false,
    unusualFatigue: false,
    blurredVision: false,

    // Bleeding/Placenta Previa
    vaginalBleeding: false,
    bleedingPainless: false,
    bleedingBright: false,
    bleedingAmount: '',

    // Vitals (optional manual entry)
    systolicBP: '',
    diastolicBP: '',
    bloodGlucose: '',

    // Additional info
    fetalPresentation: '',
    notes: ''
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const session = await localStore.getSession();

    // Convert string values to numbers where appropriate
    const vitals = {};
    if (formData.systolicBP) vitals.systolicBP = parseInt(formData.systolicBP);
    if (formData.diastolicBP) vitals.diastolicBP = parseInt(formData.diastolicBP);
    if (formData.bloodGlucose) vitals.bloodGlucose = parseInt(formData.bloodGlucose);

    const updatedSession = {
      ...session,
      questionnaire: formData,
      vitals
    };

    await localStore.saveSession(updatedSession);
    navigate('/results');
  };

  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
        <ProgressBar
          current={3}
          total={4}
          labels={['Patient Info', 'Video Capture', 'Questionnaire', 'Results']}
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl p-8"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-nurtura-100 p-3 rounded-lg">
              <ClipboardList className="w-6 h-6 text-nurtura-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Clinical Questionnaire</h2>
              <p className="text-sm text-gray-500">Symptoms and vital signs</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Preeclampsia Symptoms */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Preeclampsia Indicators</h3>
              <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="headache"
                    checked={formData.headache}
                    onChange={handleChange}
                    className="w-4 h-4 text-nurtura-600 rounded focus:ring-nurtura-500"
                  />
                  <span className="text-sm text-gray-700">Severe or persistent headache</span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="visualChanges"
                    checked={formData.visualChanges}
                    onChange={handleChange}
                    className="w-4 h-4 text-nurtura-600 rounded focus:ring-nurtura-500"
                  />
                  <span className="text-sm text-gray-700">Visual changes (blurred vision, spots, flashing lights)</span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="ruqPain"
                    checked={formData.ruqPain}
                    onChange={handleChange}
                    className="w-4 h-4 text-nurtura-600 rounded focus:ring-nurtura-500"
                  />
                  <span className="text-sm text-gray-700">Right upper quadrant pain</span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="suddenEdema"
                    checked={formData.suddenEdema}
                    onChange={handleChange}
                    className="w-4 h-4 text-nurtura-600 rounded focus:ring-nurtura-500"
                  />
                  <span className="text-sm text-gray-700">Sudden swelling (face, hands, feet)</span>
                </label>
              </div>
            </div>

            {/* GDM Symptoms */}
            <div className="border-t pt-6">
              <h3 className="font-semibold text-gray-900 mb-4">Diabetes Indicators</h3>
              <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="excessiveThirst"
                    checked={formData.excessiveThirst}
                    onChange={handleChange}
                    className="w-4 h-4 text-nurtura-600 rounded focus:ring-nurtura-500"
                  />
                  <span className="text-sm text-gray-700">Excessive thirst</span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="frequentUrination"
                    checked={formData.frequentUrination}
                    onChange={handleChange}
                    className="w-4 h-4 text-nurtura-600 rounded focus:ring-nurtura-500"
                  />
                  <span className="text-sm text-gray-700">Frequent urination (more than usual)</span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="unusualFatigue"
                    checked={formData.unusualFatigue}
                    onChange={handleChange}
                    className="w-4 h-4 text-nurtura-600 rounded focus:ring-nurtura-500"
                  />
                  <span className="text-sm text-gray-700">Unusual fatigue</span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="blurredVision"
                    checked={formData.blurredVision}
                    onChange={handleChange}
                    className="w-4 h-4 text-nurtura-600 rounded focus:ring-nurtura-500"
                  />
                  <span className="text-sm text-gray-700">Blurred vision</span>
                </label>
              </div>
            </div>

            {/* Bleeding/Placenta Symptoms */}
            <div className="border-t pt-6">
              <h3 className="font-semibold text-gray-900 mb-4">Bleeding & Fetal Status</h3>
              <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="vaginalBleeding"
                    checked={formData.vaginalBleeding}
                    onChange={handleChange}
                    className="w-4 h-4 text-nurtura-600 rounded focus:ring-nurtura-500"
                  />
                  <span className="text-sm text-gray-700">Vaginal bleeding</span>
                </label>

                {formData.vaginalBleeding && (
                  <div className="ml-7 space-y-3">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        name="bleedingPainless"
                        checked={formData.bleedingPainless}
                        onChange={handleChange}
                        className="w-4 h-4 text-nurtura-600 rounded focus:ring-nurtura-500"
                      />
                      <span className="text-sm text-gray-700">Painless bleeding</span>
                    </label>

                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        name="bleedingBright"
                        checked={formData.bleedingBright}
                        onChange={handleChange}
                        className="w-4 h-4 text-nurtura-600 rounded focus:ring-nurtura-500"
                      />
                      <span className="text-sm text-gray-700">Bright red blood</span>
                    </label>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Bleeding Amount
                      </label>
                      <select
                        name="bleedingAmount"
                        value={formData.bleedingAmount}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nurtura-500"
                      >
                        <option value="">Select amount</option>
                        <option value="spotting">Spotting</option>
                        <option value="light">Light</option>
                        <option value="moderate">Moderate</option>
                        <option value="heavy">Heavy</option>
                      </select>
                    </div>
                  </div>
                )}

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="decreasedFetalMovement"
                    checked={formData.decreasedFetalMovement}
                    onChange={handleChange}
                    className="w-4 h-4 text-nurtura-600 rounded focus:ring-nurtura-500"
                  />
                  <span className="text-sm text-gray-700">Decreased fetal movement</span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="dizziness"
                    checked={formData.dizziness}
                    onChange={handleChange}
                    className="w-4 h-4 text-nurtura-600 rounded focus:ring-nurtura-500"
                  />
                  <span className="text-sm text-gray-700">Dizziness or lightheadedness</span>
                </label>
              </div>
            </div>

            {/* Manual Vitals */}
            <div className="border-t pt-6">
              <h3 className="font-semibold text-gray-900 mb-4">Manual Vital Signs (Optional)</h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Systolic BP (mmHg)
                  </label>
                  <input
                    type="number"
                    name="systolicBP"
                    value={formData.systolicBP}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nurtura-500"
                    placeholder="120"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Diastolic BP (mmHg)
                  </label>
                  <input
                    type="number"
                    name="diastolicBP"
                    value={formData.diastolicBP}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nurtura-500"
                    placeholder="80"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Blood Glucose (mg/dL)
                  </label>
                  <input
                    type="number"
                    name="bloodGlucose"
                    value={formData.bloodGlucose}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nurtura-500"
                    placeholder="100"
                  />
                </div>
              </div>
            </div>

            {/* Fetal Presentation */}
            <div className="border-t pt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fetal Presentation (if known)
              </label>
              <select
                name="fetalPresentation"
                value={formData.fetalPresentation}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nurtura-500"
              >
                <option value="">Unknown/Not assessed</option>
                <option value="cephalic">Cephalic (head down)</option>
                <option value="breech">Breech</option>
                <option value="transverse">Transverse</option>
              </select>
            </div>

            {/* Notes */}
            <div className="border-t pt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Additional Notes
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows="3"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nurtura-500"
                placeholder="Any additional observations or concerns..."
              />
            </div>

            <div className="flex gap-4 pt-6">
              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/capture')}
                className="px-6 py-3 border border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50"
              >
                Back
              </motion.button>

              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 bg-gradient-to-r from-nurtura-600 to-nurtura-700 text-white px-6 py-3 rounded-xl flex items-center justify-center gap-2 font-semibold shadow-lg"
              >
                Generate Risk Assessment
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </div>
          </form>
        </motion.div>
      </div>
    </Layout>
  );
};

export default Questionnaire;
