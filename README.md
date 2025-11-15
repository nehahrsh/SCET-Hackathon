# Nurtura

**Maternal Health Early-Risk Screening Tool for Low-Resource Settings**

MamáSafe Pro is a mobile/web application designed for frontline clinicians (midwives, community health workers) to perform early-risk screening for maternal health conditions during antenatal visits. It uses computer vision, remote photoplethysmography (rPPG), and clinical questionnaires to assess risk for:

- **Preeclampsia**
- **Gestational Diabetes Mellitus (GDM)**
- **Placenta Previa** (triage)

---

## ⚠️ Important Disclaimer

**This is a research prototype and NOT a diagnostic tool.** All risk indicators must be confirmed with standard clinical tools and procedures. This application provides decision-support only and does not replace clinical judgment or established diagnostic protocols.

---

## ✨ Features

### 🎥 Computer Vision Analysis
- **rPPG Extraction**: Heart rate and heart rate variability from face video
- **Pallor Detection**: Anemia indicators via brightness histogram analysis
- **Edema Detection**: Swelling assessment in hands and feet
- **Respiratory Rate**: Estimation from chest motion

### 📋 Clinical Assessment
- Comprehensive symptom questionnaire
- Medical history collection
- Optional manual vital signs entry
- Risk factor identification

### 📊 Risk Stratification
- **Preeclampsia Risk Engine**: Multi-factor assessment including BP, edema, HRV
- **GDM Risk Engine**: Acanthosis nigricans detection, BMI, family history
- **Placenta Previa Triage**: Bleeding analysis, prior C-section history

### 🎨 Beautiful UI
- Clean, medical-grade interface
- Mobile-first responsive design
- Real-time quality feedback during capture
- Animated transitions and progress indicators
- Color-coded risk visualization

### 📄 Reporting & Storage
- PDF report generation
- Local offline data storage
- Encrypted data handling (ready for production)
- Export functionality

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 16+ and npm
- Modern web browser with camera access
- HTTPS or localhost (required for camera API)

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:3000`

### Build for Production

```bash
# Create optimized production build
npm run build

# Preview production build
npm run preview
```

---

## 📱 Usage

### 1. Start New Assessment
Click "Start New Assessment" from the home screen

### 2. Enter Patient Information
- Basic demographics (name, age, gestational age)
- Weight and height (for BMI calculation)
- Obstetric history
- Risk factors

### 3. Video Capture
Capture three short videos:
- **Face** (10 seconds): For rPPG, pallor, respiratory rate
- **Hands** (5 seconds): For edema detection
- **Feet** (5 seconds): For edema detection

**Tips for good capture:**
- Ensure good lighting (not too bright or dark)
- Keep still during capture
- Follow the on-screen guides
- Allow camera permissions

**Skip option:** Use "Skip video capture" to test with simulated demo data

### 4. Complete Questionnaire
Answer clinical questions about:
- Symptoms (headache, visual changes, edema, etc.)
- Diabetes indicators
- Bleeding episodes
- Enter manual vitals if available

### 5. View Results
- Color-coded risk levels (LOW/MEDIUM/HIGH)
- Detailed explanations
- Contributing factors
- Clinical recommendations
- Export PDF report

---

## 🏗️ Project Structure

```
mamasafe-pro/
├── src/
│   ├── components/
│   │   ├── common/           # Reusable UI components
│   │   │   ├── SafetyBanner.jsx
│   │   │   ├── ProgressBar.jsx
│   │   │   └── RiskCard.jsx
│   │   ├── capture/          # Video capture components
│   │   │   └── VideoCapture.jsx
│   │   └── layout/
│   │       └── Layout.jsx
│   ├── lib/
│   │   ├── rppg/             # rPPG extraction
│   │   │   └── rppgExtractor.js
│   │   ├── vision/           # Image processing
│   │   │   ├── pallorDetection.js
│   │   │   ├── edemaDetection.js
│   │   │   └── respiratoryRate.js
│   │   ├── riskEngine/       # Risk assessment logic
│   │   │   ├── preeclampsiaRisk.js
│   │   │   ├── gdmRisk.js
│   │   │   └── placentaPreviaRisk.js
│   │   └── storage/
│   │       └── localStore.js
│   ├── pages/                # Main screens
│   │   ├── Home.jsx
│   │   ├── PatientInfo.jsx
│   │   ├── Capture.jsx
│   │   ├── Questionnaire.jsx
│   │   └── Results.jsx
│   ├── utils/                # Utilities
│   │   ├── videoProcessor.js
│   │   ├── pdfExport.js
│   │   └── demoDataGenerator.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── package.json
├── vite.config.js
├── tailwind.config.js
└── README.md
```

---

## 🔬 Technical Details

### rPPG Extraction

The rPPG module extracts heart rate and HRV from face video by:
1. Extracting green channel from face ROI
2. Detrending and bandpass filtering (0.7-3.5 Hz)
3. Peak detection for HR calculation
4. RMSSD approximation for HRV

**Fallback**: If real video processing fails, deterministic simulation provides plausible values.

### Image Heuristics

**Pallor Detection:**
- Brightness histogram analysis
- Skin tone redness ratio
- Uniformity assessment

**Edema Detection:**
- Skin region segmentation
- Contour analysis
- Circularity and puffiness metrics

**Respiratory Rate:**
- Motion detection from chest region
- Lowpass filtering (0.15-0.5 Hz)
- Peak detection for breath counting

### Risk Engines

Each condition has a dedicated risk engine that:
1. Combines multiple data sources (vision, vitals, questionnaire, demographics)
2. Assigns weighted scores to risk factors
3. Determines risk level (LOW/MEDIUM/HIGH)
4. Generates clinical explanations
5. Identifies top contributing factors

**The logic is interpretable, rule-based, and clinically informed** (not deep learning).

---

## 🎯 Demo Scenarios

For testing without real patients, use the demo data generator:

```javascript
import demoDataGenerator from './utils/demoDataGenerator';

// Available scenarios:
const scenarios = [
  'normal',           // Low risk case
  'preeclampsia',     // High preeclampsia risk
  'gdm',              // High GDM risk
  'placentaPrevia',   // High placenta previa risk
  'mixed'             // Multiple high-risk factors
];

const demoData = demoDataGenerator.generateDemoSession('preeclampsia');
```

Or simply click **"Skip video capture"** during the capture phase to use demo data automatically.

---

## 🔐 Data Privacy & Security

- **Local-first**: All data stored in browser localStorage
- **No cloud sync** unless explicitly enabled
- **Encryption-ready**: Structure supports encryption in production
- **GDPR-compatible**: Clear data export and deletion
- **Session-based**: Temporary storage during assessment
- **Persistent storage**: Saved assessments for record-keeping

---

## 🎨 UI/UX Highlights

- **Medical-grade design**: Clean blue/white palette
- **Accessibility**: WCAG-compliant contrast ratios
- **Mobile-optimized**: Touch-friendly, responsive
- **Real-time feedback**: Quality checks during video capture
- **Progress tracking**: Clear multi-step flow
- **Animated transitions**: Smooth, professional animations
- **Safety-first**: Prominent disclaimers on every screen

---

## 🛠️ Development

### Tech Stack

- **React 18**: Modern hooks-based architecture
- **Vite**: Lightning-fast build tool
- **TailwindCSS**: Utility-first styling
- **Framer Motion**: Smooth animations
- **React Router**: Client-side routing
- **jsPDF**: PDF report generation
- **LocalForage**: Enhanced localStorage

### Browser Compatibility

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers with camera support

### Camera Requirements

- HTTPS connection (or localhost for development)
- User permission for camera access
- Minimum 640x480 resolution

---

## 📈 Future Enhancements

- [ ] Offline PWA support
- [ ] Multi-language support
- [ ] Integration with EHR systems
- [ ] Advanced ML models for improved accuracy
- [ ] Ultrasound image analysis
- [ ] Cloud sync with encrypted storage
- [ ] SMS/WhatsApp result sharing
- [ ] Longitudinal tracking across visits

---

## 🤝 Contributing

This is a hackathon prototype. For production use:

1. Conduct clinical validation studies
2. Obtain regulatory approvals (FDA, CE, etc.)
3. Implement production-grade security
4. Add comprehensive error handling
5. Perform accessibility audits
6. Conduct user testing with clinicians

---

## 📄 License

MIT License - See LICENSE file

---

## 🙏 Acknowledgments

Built for low-resource maternal healthcare settings. Inspired by:
- WHO guidelines on maternal health
- Research on rPPG and computer vision in healthcare
- Frontline healthcare workers worldwide

---

## 📞 Support

For questions, issues, or feature requests:
- Open an issue on GitHub
- Contact: [Your contact info]

---

**Remember: This is a decision-support tool, not a diagnostic device. All findings must be confirmed with standard clinical procedures.**

---

Made with ❤️ for maternal health
