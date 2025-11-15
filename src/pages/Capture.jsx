import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle, Video } from 'lucide-react';
import Layout from '../components/layout/Layout';
import ProgressBar from '../components/common/ProgressBar';
import VideoCapture from '../components/capture/VideoCapture';
import localStore from '../lib/storage/localStore';
import rppgExtractor from '../lib/rppg/rppgExtractor';
import pallorDetector from '../lib/vision/pallorDetection';
import edemaDetector from '../lib/vision/edemaDetection';
import respiratoryEstimator from '../lib/vision/respiratoryRate';

const Capture = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [capturedData, setCapturedData] = useState({});
  const [processing, setProcessing] = useState(false);

  const captureSteps = [
    {
      type: 'face',
      title: 'Face Video',
      instruction: 'Position your face in the circle. Keep still and maintain good lighting.',
      duration: 10
    },
    {
      type: 'hand',
      title: 'Hand Video',
      instruction: 'Show your palm in the frame. Keep your hand steady.',
      duration: 5
    },
    {
      type: 'foot',
      title: 'Foot Video',
      instruction: 'Show your foot in the frame. Ensure good lighting.',
      duration: 5
    }
  ];

  const currentCapture = captureSteps[currentStep];

  const handleCaptureComplete = async (data) => {
    setProcessing(true);

    try {
      let processedData = {};

      if (data.type === 'face') {
        // Process rPPG
        const rppgData = await rppgExtractor.extractFromFrames(data.frames);

        // Process pallor
        const pallorData = pallorDetector.detectPallor(data.frames[0]);

        // Process respiratory rate
        const rrData = respiratoryEstimator.estimateRespiratoryRate(data.frames);

        processedData = {
          rppg: rppgData,
          pallor: pallorData,
          respiratoryRate: rrData
        };
      } else if (data.type === 'hand') {
        // Process hand edema
        const edemaData = edemaDetector.detectEdema(data.frames[0], 'hand');
        processedData = {
          handEdema: edemaData
        };
      } else if (data.type === 'foot') {
        // Process foot edema
        const edemaData = edemaDetector.detectEdema(data.frames[0], 'foot');
        processedData = {
          footEdema: edemaData
        };
      }

      setCapturedData(prev => ({
        ...prev,
        ...processedData
      }));

      setProcessing(false);

      // Move to next step or proceed
      if (currentStep < captureSteps.length - 1) {
        setTimeout(() => setCurrentStep(currentStep + 1), 1000);
      } else {
        // All captures complete
        setTimeout(() => handleAllCapturesComplete(processedData), 1000);
      }
    } catch (error) {
      console.error('Processing error:', error);
      setProcessing(false);
    }
  };

  const handleAllCapturesComplete = async (finalData) => {
    const session = await localStore.getSession();
    await localStore.saveSession({
      ...session,
      vision: {
        ...capturedData,
        ...finalData
      }
    });
    navigate('/questionnaire');
  };

  const handleSkipCapture = () => {
    // Skip to questionnaire with demo data
    navigate('/questionnaire');
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <ProgressBar
          current={2}
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
              <Video className="w-6 h-6 text-nurtura-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {currentCapture.title}
              </h2>
              <p className="text-sm text-gray-500">
                Step {currentStep + 1} of {captureSteps.length}
              </p>
            </div>
          </div>

          {/* Progress indicators */}
          <div className="flex gap-2 mb-8">
            {captureSteps.map((step, idx) => (
              <div
                key={idx}
                className="flex-1 flex items-center gap-2"
              >
                <div
                  className={`flex-1 h-2 rounded-full ${
                    idx < currentStep
                      ? 'bg-green-500'
                      : idx === currentStep
                      ? 'bg-nurtura-500'
                      : 'bg-gray-200'
                  }`}
                />
                {idx < currentStep && (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                )}
              </div>
            ))}
          </div>

          {!processing ? (
            <VideoCapture
              type={currentCapture.type}
              duration={currentCapture.duration}
              instruction={currentCapture.instruction}
              onComplete={handleCaptureComplete}
            />
          ) : (
            <div className="text-center py-12">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                className="w-16 h-16 border-4 border-nurtura-200 border-t-nurtura-600 rounded-full mx-auto mb-4"
              />
              <p className="text-lg font-medium text-gray-900">Processing video...</p>
              <p className="text-sm text-gray-500 mt-2">
                Extracting biometric features
              </p>
            </div>
          )}

          <div className="mt-8 pt-6 border-t flex justify-between">
            <button
              onClick={handleSkipCapture}
              className="px-6 py-3 text-sm text-gray-600 hover:text-gray-900 font-medium"
            >
              Skip video capture (use demo data)
            </button>

            {currentStep > 0 && (
              <button
                onClick={() => setCurrentStep(currentStep - 1)}
                className="px-6 py-3 border border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50"
              >
                Previous
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default Capture;
