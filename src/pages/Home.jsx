import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Play, FileText, Activity, Info, History } from 'lucide-react';
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
          <h2 className="text-5xl font-display font-semibold bg-gradient-to-r from-nurtura-600 via-rose-500 to-nurtura-600 bg-clip-text text-transparent mb-4">
            Welcome to Nurtura
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto font-light">
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
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-nurtura-100 hover:shadow-md transition-all hover:border-nurtura-200"
            >
              <feature.icon className="w-10 h-10 text-nurtura-500 mb-4" />
              <h3 className="font-medium text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-sm text-gray-600 font-light">{feature.description}</p>
            </div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-md border border-nurtura-100"
        >
          <h3 className="text-xl font-display font-semibold text-gray-900 mb-4">
            How It Works
          </h3>
          <ol className="space-y-3 mb-8">
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-gradient-to-r from-nurtura-500 to-rose-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
                1
              </span>
              <span className="text-gray-700 font-light">Enter patient demographics and information</span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-gradient-to-r from-nurtura-500 to-rose-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
                2
              </span>
              <span className="text-gray-700 font-light">Capture video of face, hands, and feet</span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-gradient-to-r from-nurtura-500 to-rose-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
                3
              </span>
              <span className="text-gray-700 font-light">Complete clinical questionnaire</span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-gradient-to-r from-nurtura-500 to-rose-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
                4
              </span>
              <span className="text-gray-700 font-light">Review risk assessment and export report</span>
            </li>
          </ol>

          <div className="flex gap-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/patient-info')}
              className="flex-1 bg-gradient-to-r from-nurtura-500 to-rose-500 text-white px-8 py-4 rounded-xl flex items-center justify-center gap-3 shadow-md font-medium text-lg"
            >
              <Play className="w-6 h-6" />
              Start New Assessment
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/history')}
              className="px-6 py-4 border-2 border-nurtura-300 text-nurtura-700 rounded-xl flex items-center gap-3 font-medium hover:bg-nurtura-50"
            >
              <History className="w-6 h-6" />
              View History
            </motion.button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-8 bg-nurtura-50/50 backdrop-blur-sm border border-nurtura-200 rounded-2xl p-6"
        >
          <h4 className="font-medium text-nurtura-900 mb-2">For Healthcare Providers</h4>
          <p className="text-sm text-gray-700 font-light">
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
