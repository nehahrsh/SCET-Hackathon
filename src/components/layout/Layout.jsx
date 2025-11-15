import React from 'react';
import { Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import SafetyBanner from '../common/SafetyBanner';

const Layout = ({ children, showBanner = true }) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-nurtura-50 via-white to-rose-50">
      <nav className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-nurtura-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div
              className="flex items-center gap-3 cursor-pointer"
              onClick={() => navigate('/')}
            >
              <div className="bg-gradient-to-br from-nurtura-400 to-nurtura-600 p-2 rounded-2xl shadow-md">
                <Heart className="w-6 h-6 text-white" fill="white" />
              </div>
              <div>
                <h1 className="text-xl font-display font-semibold bg-gradient-to-r from-nurtura-600 to-rose-600 bg-clip-text text-transparent">
                  Nurtura
                </h1>
                <p className="text-xs text-gray-500 font-light">Maternal Health Screening</p>
              </div>
            </div>
            <div className="text-sm text-nurtura-400 font-light">
              v1.0.0
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {showBanner && <SafetyBanner />}
        {children}
      </main>

      <footer className="bg-white/60 backdrop-blur-sm border-t border-nurtura-100 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-sm text-gray-500">
            <p className="font-light">Nurtura - Research Prototype for Maternal Health Screening</p>
            <p className="mt-1 text-xs font-light">
              For use by trained healthcare providers only. Not for consumer use.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
