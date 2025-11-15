import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Play, FileText, Activity, Info } from 'lucide-react';
import Layout from '../components/layout/Layout';

const Home = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Activity,
      title: 'rPPG Analysis',
      description: 'Heart rate and variability from video'
    },
    {
      icon: FileText,
      title: 'Clinical Questionnaire',
      description: 'Symptom and history collection'
    },
    {
      icon: Info,
      title: 'Risk Stratification',
      description: 'Preeclampsia, GDM, and placenta previa'
    }
  ];

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to MamáSafe Pro
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Early risk screening tool for maternal health conditions using computer vision,
            rPPG analysis, and clinical questionnaires.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid md:grid-cols-3 gap-6 mb-12"
        >
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl p-6 shadow-md border border-gray-200 hover:shadow-lg transition-shadow"
            >
              <feature.icon className="w-10 h-10 text-medical-600 mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-sm text-gray-600">{feature.description}</p>
            </div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl p-8 shadow-xl border border-gray-200"
        >
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            How It Works
          </h3>
          <ol className="space-y-3 mb-8">
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-medical-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                1
              </span>
              <span className="text-gray-700">Enter patient demographics and information</span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-medical-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                2
              </span>
              <span className="text-gray-700">Capture video of face, hands, and feet</span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-medical-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                3
              </span>
              <span className="text-gray-700">Complete clinical questionnaire</span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-medical-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                4
              </span>
              <span className="text-gray-700">Review risk assessment and export report</span>
            </li>
          </ol>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/patient-info')}
            className="w-full bg-gradient-to-r from-medical-600 to-medical-700 text-white px-8 py-4 rounded-xl flex items-center justify-center gap-3 shadow-lg font-semibold text-lg"
          >
            <Play className="w-6 h-6" />
            Start New Assessment
          </motion.button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6"
        >
          <h4 className="font-semibold text-blue-900 mb-2">For Healthcare Providers</h4>
          <p className="text-sm text-blue-800">
            This tool is designed for use by trained healthcare providers in low-resource settings.
            It provides decision support but does not replace clinical judgment or standard
            diagnostic procedures. All high-risk cases require immediate medical evaluation.
          </p>
        </motion.div>
      </div>
    </Layout>
  );
};

export default Home;
