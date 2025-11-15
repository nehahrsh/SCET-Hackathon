import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, CheckCircle, AlertCircle, Info } from 'lucide-react';

const RiskCard = ({ risk }) => {
  const { condition, riskLevel, triageLevel, score, explanation, topContributors, riskColor, urgencyColor } = risk;

  const level = riskLevel || triageLevel;
  const color = riskColor || urgencyColor;

  const colorClasses = {
    red: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      text: 'text-red-900',
      badge: 'bg-red-500',
      icon: 'text-red-500'
    },
    orange: {
      bg: 'bg-orange-50',
      border: 'border-orange-200',
      text: 'text-orange-900',
      badge: 'bg-orange-500',
      icon: 'text-orange-500'
    },
    yellow: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      text: 'text-yellow-900',
      badge: 'bg-yellow-500',
      icon: 'text-yellow-600'
    },
    green: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      text: 'text-green-900',
      badge: 'bg-green-500',
      icon: 'text-green-500'
    }
  };

  const classes = colorClasses[color] || colorClasses.green;

  const Icon = level === 'HIGH' || level === 'IMMEDIATE'
    ? AlertTriangle
    : level === 'MEDIUM' || level === 'URGENT'
    ? AlertCircle
    : level === 'LOW' || level === 'ROUTINE'
    ? CheckCircle
    : Info;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`${classes.bg} ${classes.border} border-2 rounded-xl p-5 shadow-lg mb-4`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <Icon className={`w-6 h-6 ${classes.icon}`} />
          <h3 className={`text-lg font-semibold ${classes.text}`}>{condition}</h3>
        </div>
        <div className="flex items-center gap-2">
          <div className={`${classes.badge} text-white px-3 py-1 rounded-full text-sm font-bold`}>
            {level}
          </div>
          <div className="bg-white px-3 py-1 rounded-full text-sm font-semibold text-gray-700 border border-gray-300">
            {score}/100
          </div>
        </div>
      </div>

      <div className={`${classes.text} text-sm mb-4 leading-relaxed`}>
        {explanation}
      </div>

      {topContributors && topContributors.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <h4 className="text-xs font-semibold text-gray-700 uppercase mb-2">
            Key Contributing Factors
          </h4>
          <div className="space-y-2">
            {topContributors.map((factor, idx) => (
              <div key={idx} className="flex items-start gap-2">
                <div className={`w-1.5 h-1.5 rounded-full ${classes.badge} mt-1.5 flex-shrink-0`} />
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <span className="text-sm font-medium text-gray-800">{factor.factor}</span>
                    <span className="text-xs text-gray-600 ml-2">{factor.value}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default RiskCard;
