import React from 'react';
import { Heart } from 'lucide-react';
import SafetyBanner from '../common/SafetyBanner';

const Layout = ({ children, showBanner = true }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-medical-50 via-white to-blue-50">
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-medical-500 to-medical-600 p-2 rounded-lg">
                <Heart className="w-6 h-6 text-white" fill="white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">MamáSafe Pro</h1>
                <p className="text-xs text-gray-500">Maternal Health Screening</p>
              </div>
            </div>
            <div className="text-sm text-gray-500">
              v1.0.0
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {showBanner && <SafetyBanner />}
        {children}
      </main>

      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-sm text-gray-500">
            <p>MamáSafe Pro - Research Prototype for Maternal Health Screening</p>
            <p className="mt-1 text-xs">
              For use by trained healthcare providers only. Not for consumer use.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
