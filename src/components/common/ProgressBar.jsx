import React from 'react';
import { motion } from 'framer-motion';

const ProgressBar = ({ current, total, labels = [] }) => {
  const percentage = (current / total) * 100;

  return (
    <div className="w-full mb-8">
      <div className="flex justify-between mb-2">
        {labels.map((label, idx) => (
          <div
            key={idx}
            className={`text-xs font-medium ${
              idx < current
                ? 'text-medical-600'
                : idx === current
                ? 'text-medical-700 font-semibold'
                : 'text-gray-400'
            }`}
          >
            {label}
          </div>
        ))}
      </div>
      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-medical-500 to-medical-600"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>
      <div className="flex justify-between mt-1">
        <span className="text-xs text-gray-500">
          Step {current} of {total}
        </span>
        <span className="text-xs text-gray-500">{Math.round(percentage)}%</span>
      </div>
    </div>
  );
};

export default ProgressBar;
