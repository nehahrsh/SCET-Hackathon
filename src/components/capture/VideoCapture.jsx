import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Camera, StopCircle, CheckCircle, AlertCircle } from 'lucide-react';
import videoProcessor from '../../utils/videoProcessor';

const VideoCapture = ({
  onComplete,
  duration = 10,
  type = 'face',
  instruction
}) => {
  const videoRef = useRef(null);
  const [isRecording, setIsRecording] = useState(false);
  const [countdown, setCountdown] = useState(duration);
  const [quality, setQuality] = useState(null);
  const [stream, setStream] = useState(null);

  useEffect(() => {
    startCamera();
    return () => {
      videoProcessor.stopCamera();
    };
  }, []);

  useEffect(() => {
    if (!isRecording || !videoRef.current) return;

    const interval = setInterval(() => {
      const frame = videoProcessor.captureFrame(videoRef.current);
      const qualityCheck = videoProcessor.assessQuality(frame);
      setQuality(qualityCheck);
    }, 500);

    return () => clearInterval(interval);
  }, [isRecording]);

  const startCamera = async () => {
    try {
      const constraints = {
        video: {
          facingMode: type === 'face' ? 'user' : 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      };

      const mediaStream = await videoProcessor.requestCamera(constraints);
      setStream(mediaStream);

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (error) {
      console.error('Camera error:', error);
    }
  };

  const startRecording = async () => {
    setIsRecording(true);
    setCountdown(duration);

    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          stopRecording();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Extract frames
    setTimeout(async () => {
      if (videoRef.current) {
        const frames = await videoProcessor.extractFrames(videoRef.current, duration, 30);
        onComplete({ frames, type });
      }
    }, duration * 1000);
  };

  const stopRecording = () => {
    setIsRecording(false);
  };

  const getOverlayGuide = () => {
    if (type === 'face') {
      return (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-64 h-80 border-4 border-white rounded-full opacity-40" />
        </div>
      );
    } else if (type === 'hand' || type === 'foot') {
      return (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-72 h-48 border-4 border-white rounded-2xl opacity-40" />
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-full max-w-2xl bg-black rounded-2xl overflow-hidden shadow-2xl">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-auto"
          style={{ transform: type === 'face' ? 'scaleX(-1)' : 'none' }}
        />

        {getOverlayGuide()}

        {isRecording && (
          <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full flex items-center gap-2">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
            <span className="font-semibold">Recording</span>
          </div>
        )}

        {isRecording && (
          <div className="absolute top-4 right-4 bg-black bg-opacity-60 text-white px-4 py-2 rounded-full">
            <span className="text-2xl font-bold">{countdown}s</span>
          </div>
        )}

        {quality && isRecording && (
          <div className="absolute bottom-4 left-4 right-4">
            {quality.feedback.map((fb, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex items-center gap-2 mb-2 px-3 py-2 rounded-lg ${
                  fb.type === 'success'
                    ? 'bg-green-500 bg-opacity-90'
                    : 'bg-amber-500 bg-opacity-90'
                } text-white text-sm`}
              >
                {fb.type === 'success' ? (
                  <CheckCircle className="w-4 h-4" />
                ) : (
                  <AlertCircle className="w-4 h-4" />
                )}
                <span>{fb.message}</span>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-6 text-center">
        <p className="text-gray-600 mb-4 text-sm max-w-md">
          {instruction}
        </p>

        {!isRecording ? (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={startRecording}
            className="bg-nurtura-600 hover:bg-nurtura-700 text-white px-8 py-3 rounded-xl flex items-center gap-3 mx-auto shadow-lg font-medium"
          >
            <Camera className="w-5 h-5" />
            Start {duration}s Capture
          </motion.button>
        ) : (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={stopRecording}
            className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-xl flex items-center gap-3 mx-auto shadow-lg font-medium"
          >
            <StopCircle className="w-5 h-5" />
            Stop Recording
          </motion.button>
        )}
      </div>
    </div>
  );
};

export default VideoCapture;
