# MamáSafe Pro - Quick Start Guide 🚀

## Installation & Setup

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev

# 3. Open browser to http://localhost:3000
```

That's it! The app should now be running.

---

## Testing the Demo

### Option 1: Use Demo Data (Fastest)
1. Click "Start New Assessment"
2. Fill in patient info (use any test values)
3. Click "Continue to Video Capture"
4. Click **"Skip video capture (use demo data)"**
5. Fill out questionnaire
6. View results!

### Option 2: Use Real Camera
1. Allow camera permissions when prompted
2. Follow on-screen guides for each capture:
   - Face (10 seconds)
   - Hands (5 seconds)
   - Feet (5 seconds)
3. Complete questionnaire
4. View results and export PDF

---

## Pre-built Demo Scenarios

To test different risk levels, you can load pre-built scenarios in the browser console:

```javascript
// Open browser console (F12)
import('./src/utils/demoDataGenerator.js').then(m => {
  const demo = m.default;

  // Available scenarios:
  const data = demo.generateDemoSession('preeclampsia'); // or 'gdm', 'placentaPrevia', 'mixed', 'normal'

  console.log(data);
});
```

---

## Key Features to Demo

### 1. Beautiful UI
- Medical-grade design with blue/white theme
- Smooth animations and transitions
- Mobile-responsive layout
- Clear progress indicators

### 2. Video Capture
- Real-time quality feedback
- Overlay guides for positioning
- Countdown timer
- Skip option for testing

### 3. Risk Assessment
- Three conditions: Preeclampsia, GDM, Placenta Previa
- Color-coded risk levels (RED/ORANGE/GREEN)
- Top contributing factors
- Clinical explanations

### 4. Biometric Extraction
- Heart rate from face video (rPPG)
- Heart rate variability (HRV)
- Respiratory rate from motion
- Pallor detection
- Edema detection (hands/feet)

### 5. PDF Export
- Professional report generation
- All risk assessments included
- Patient demographics
- Clinical recommendations
- Safety disclaimers

---

## Troubleshooting

### Camera not working?
- Ensure you're on HTTPS or localhost
- Grant camera permissions
- Check browser compatibility (Chrome/Firefox/Safari)
- Try "Skip video capture" for demo

### Build errors?
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Port 3000 already in use?
Edit `vite.config.js` to change the port:
```javascript
server: {
  port: 3001, // Change to any available port
}
```

---

## Project Structure Overview

```
src/
├── lib/              # Core logic
│   ├── rppg/        # Heart rate extraction
│   ├── vision/      # Image processing
│   ├── riskEngine/  # Risk scoring
│   └── storage/     # Local data persistence
├── components/       # UI components
├── pages/           # Main screens
└── utils/           # Helpers
```

---

## Demo Flow

1. **Home** → Click "Start New Assessment"
2. **Patient Info** → Enter demographics & history
3. **Video Capture** → Record face/hands/feet (or skip)
4. **Questionnaire** → Answer clinical questions
5. **Results** → View risk assessment & export PDF

---

## Safety & Ethics

⚠️ **This is a research prototype, NOT a diagnostic tool**

Every screen includes safety disclaimers:
- Not for diagnostic use
- Results must be confirmed with standard tools
- For decision-support only
- Requires professional medical interpretation

---

## Production Considerations

Before deploying to real clinical settings:

- [ ] Clinical validation studies
- [ ] Regulatory approvals (FDA, CE, etc.)
- [ ] Production-grade security
- [ ] HIPAA/GDPR compliance
- [ ] Encrypted data storage
- [ ] User authentication
- [ ] Audit logging
- [ ] Error reporting
- [ ] Performance optimization
- [ ] Comprehensive testing

---

## Next Steps

1. **Test the demo**: Run through all screens
2. **Try different scenarios**: Use demo data generator
3. **Export a PDF**: Check report quality
4. **Test on mobile**: Verify responsive design
5. **Review code**: Explore modular architecture

---

## Support

Questions? Check:
- `README.md` - Full documentation
- Code comments - Detailed explanations
- Browser console - Debug info

---

**Happy testing! 🎉**
