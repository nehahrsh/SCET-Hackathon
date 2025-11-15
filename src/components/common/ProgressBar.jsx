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
            className={`text-xs font-light ${
              idx < current
                ? 'text-nurtura-600'
                : idx === current
                ? 'text-nurtura-700 font-medium'
                : 'text-gray-400'
            }`}
          >
            {label}
          </div>
        ))}
      </div>
      <div className="h-2 bg-nurtura-50 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-nurtura-400 to-rose-500"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>
      <div className="flex justify-between mt-1">
        <span className="text-xs text-gray-500 font-light">
          Step {current} of {total}
        </span>
        <span className="text-xs text-gray-500 font-light">{Math.round(percentage)}%</span>
      </div>
    </div>
  );
};

export default ProgressBar;
