import React from 'react';
import { AlertCircle } from 'lucide-react';

const SafetyBanner = () => {
  return (
    <div className="bg-rose-50 border-l-4 border-rose-400 p-3 mb-4 rounded-r-lg shadow-sm">
      <div className="flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="text-sm text-rose-900 font-medium">
            Research Prototype - Not a Diagnostic Tool
          </p>
          <p className="text-xs text-rose-800 mt-1 font-light">
            All readings must be confirmed with standard clinical tools. This is a decision-support aid only.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SafetyBanner;
