import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import PatientInfo from './pages/PatientInfo';
import Capture from './pages/Capture';
import Questionnaire from './pages/Questionnaire';
import Results from './pages/Results';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/patient-info" element={<PatientInfo />} />
        <Route path="/capture" element={<Capture />} />
        <Route path="/questionnaire" element={<Questionnaire />} />
        <Route path="/results" element={<Results />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
