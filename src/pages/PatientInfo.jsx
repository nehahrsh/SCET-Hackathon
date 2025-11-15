import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, User } from 'lucide-react';
import Layout from '../components/layout/Layout';
import ProgressBar from '../components/common/ProgressBar';
import localStore from '../lib/storage/localStore';

const PatientInfo = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gestationalWeeks: '',
    weight: '',
    height: '',
    parity: '',
    firstPregnancy: false,
    previousPreeclampsia: false,
    previousGDM: false,
    previousCSection: false,
    numberOfCSections: '',
    familyHistoryDiabetes: false,
    pcos: false,
    previousLargeBaby: false,
    previousPlacentalIssue: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const calculateBMI = () => {
    const weight = parseFloat(formData.weight);
    const height = parseFloat(formData.height) / 100; // cm to m
    if (weight && height) {
      return (weight / (height * height)).toFixed(1);
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const bmi = calculateBMI();
    const sessionData = {
      demographics: {
        ...formData,
        age: parseInt(formData.age),
        gestationalWeeks: parseInt(formData.gestationalWeeks),
        bmi: bmi ? parseFloat(bmi) : null,
        parity: formData.parity ? parseInt(formData.parity) : 0,
        numberOfCSections: formData.numberOfCSections ? parseInt(formData.numberOfCSections) : 0
      },
      timestamp: Date.now()
    };

    await localStore.saveSession(sessionData);
    navigate('/capture');
  };

  const bmi = calculateBMI();

  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
        <ProgressBar
          current={1}
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
              <User className="w-6 h-6 text-nurtura-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Patient Information</h2>
              <p className="text-sm text-gray-500">Basic demographics and medical history</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Info */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Patient Name *
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nurtura-500 focus:border-transparent"
                  placeholder="Full name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Age (years) *
                </label>
                <input
                  type="number"
                  name="age"
                  required
                  min="15"
                  max="60"
                  value={formData.age}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nurtura-500 focus:border-transparent"
                  placeholder="Age"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gestational Age (weeks) *
                </label>
                <input
                  type="number"
                  name="gestationalWeeks"
                  required
                  min="4"
                  max="42"
                  value={formData.gestationalWeeks}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nurtura-500 focus:border-transparent"
                  placeholder="Weeks"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Weight (kg)
                </label>
                <input
                  type="number"
                  name="weight"
                  step="0.1"
                  value={formData.weight}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nurtura-500 focus:border-transparent"
                  placeholder="Weight"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Height (cm)
                </label>
                <input
                  type="number"
                  name="height"
                  value={formData.height}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nurtura-500 focus:border-transparent"
                  placeholder="Height"
                />
              </div>
            </div>

            {bmi && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-sm text-blue-900">
                  <span className="font-semibold">BMI:</span> {bmi} kg/m²
                </p>
              </div>
            )}

            {/* Obstetric History */}
            <div className="border-t pt-6">
              <h3 className="font-semibold text-gray-900 mb-4">Obstetric History</h3>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Previous Births (Parity)
                </label>
                <input
                  type="number"
                  name="parity"
                  min="0"
                  max="20"
                  value={formData.parity}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nurtura-500 focus:border-transparent"
                  placeholder="0 for first pregnancy"
                />
              </div>

              <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="firstPregnancy"
                    checked={formData.firstPregnancy}
                    onChange={handleChange}
                    className="w-4 h-4 text-nurtura-600 rounded focus:ring-nurtura-500"
                  />
                  <span className="text-sm text-gray-700">First pregnancy</span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="previousPreeclampsia"
                    checked={formData.previousPreeclampsia}
                    onChange={handleChange}
                    className="w-4 h-4 text-nurtura-600 rounded focus:ring-nurtura-500"
                  />
                  <span className="text-sm text-gray-700">Previous preeclampsia</span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="previousGDM"
                    checked={formData.previousGDM}
                    onChange={handleChange}
                    className="w-4 h-4 text-nurtura-600 rounded focus:ring-nurtura-500"
                  />
                  <span className="text-sm text-gray-700">Previous gestational diabetes</span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="previousCSection"
                    checked={formData.previousCSection}
                    onChange={handleChange}
                    className="w-4 h-4 text-nurtura-600 rounded focus:ring-nurtura-500"
                  />
                  <span className="text-sm text-gray-700">Previous cesarean section</span>
                </label>

                {formData.previousCSection && (
                  <div className="ml-7">
                    <input
                      type="number"
                      name="numberOfCSections"
                      min="1"
                      max="5"
                      value={formData.numberOfCSections}
                      onChange={handleChange}
                      placeholder="Number of C-sections"
                      className="w-48 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nurtura-500 text-sm"
                    />
                  </div>
                )}

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="previousLargeBaby"
                    checked={formData.previousLargeBaby}
                    onChange={handleChange}
                    className="w-4 h-4 text-nurtura-600 rounded focus:ring-nurtura-500"
                  />
                  <span className="text-sm text-gray-700">Previous baby {'>'} 4kg</span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="previousPlacentalIssue"
                    checked={formData.previousPlacentalIssue}
                    onChange={handleChange}
                    className="w-4 h-4 text-nurtura-600 rounded focus:ring-nurtura-500"
                  />
                  <span className="text-sm text-gray-700">Previous placental issue</span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="familyHistoryDiabetes"
                    checked={formData.familyHistoryDiabetes}
                    onChange={handleChange}
                    className="w-4 h-4 text-nurtura-600 rounded focus:ring-nurtura-500"
                  />
                  <span className="text-sm text-gray-700">Family history of diabetes</span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="pcos"
                    checked={formData.pcos}
                    onChange={handleChange}
                    className="w-4 h-4 text-nurtura-600 rounded focus:ring-nurtura-500"
                  />
                  <span className="text-sm text-gray-700">PCOS (Polycystic Ovary Syndrome)</span>
                </label>
              </div>
            </div>

            <div className="flex gap-4 pt-6">
              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/')}
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
                Continue to Video Capture
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </div>
          </form>
        </motion.div>
      </div>
    </Layout>
  );
};

export default PatientInfo;
