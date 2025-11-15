/**
 * Video Processing Utilities
 * Handles video capture and frame extraction
 */

export class VideoProcessor {
  constructor() {
    this.stream = null;
    this.mediaRecorder = null;
    this.recordedChunks = [];
  }

  /**
   * Request camera access
   */
  async requestCamera(constraints = { video: { facingMode: 'user' }, audio: false }) {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia(constraints);
      return this.stream;
    } catch (error) {
      console.error('Camera access denied:', error);
      throw new Error('Camera access required for screening');
    }
  }

  /**
   * Stop camera stream
   */
  stopCamera() {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
  }

  /**
   * Extract frames from video element
   */
  async extractFrames(videoElement, duration = 10, fps = 30) {
    const frames = [];
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    canvas.width = videoElement.videoWidth || 640;
    canvas.height = videoElement.videoHeight || 480;

    const totalFrames = duration * fps;
    const interval = 1000 / fps;

    return new Promise((resolve) => {
      let frameCount = 0;
      const captureFrame = () => {
        if (frameCount >= totalFrames) {
          resolve(frames);
          return;
        }

        ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        frames.push(imageData);

        frameCount++;
        setTimeout(captureFrame, interval);
      };

      captureFrame();
    });
  }

  /**
   * Capture single frame from video
   */
  captureFrame(videoElement) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    canvas.width = videoElement.videoWidth || 640;
    canvas.height = videoElement.videoHeight || 480;

    ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
    return ctx.getImageData(0, 0, canvas.width, canvas.height);
  }

  /**
   * Convert canvas to blob
   */
  async canvasToBlob(canvas, type = 'image/jpeg', quality = 0.8) {
    return new Promise((resolve) => {
      canvas.toBlob(resolve, type, quality);
    });
  }

  /**
   * Assess video quality (lighting, focus, etc.)
   */
  assessQuality(imageData) {
    const { data } = imageData;
    let brightness = 0;
    let contrast = 0;
    let pixelCount = data.length / 4;

    // Calculate average brightness
    for (let i = 0; i < data.length; i += 4) {
      const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
      brightness += avg;
    }
    brightness /= pixelCount;

    // Simple contrast estimation
    let variance = 0;
    for (let i = 0; i < data.length; i += 4) {
      const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
      variance += Math.pow(avg - brightness, 2);
    }
    contrast = Math.sqrt(variance / pixelCount);

    // Quality feedback
    const feedback = [];
    if (brightness < 60) {
      feedback.push({ type: 'warning', message: 'Too dark - move to brighter area' });
    } else if (brightness > 200) {
      feedback.push({ type: 'warning', message: 'Too bright - reduce direct light' });
    } else {
      feedback.push({ type: 'success', message: 'Good lighting' });
    }

    if (contrast < 20) {
      feedback.push({ type: 'warning', message: 'Low contrast - adjust position' });
    } else {
      feedback.push({ type: 'success', message: 'Good clarity' });
    }

    return {
      brightness,
      contrast,
      quality: (brightness > 60 && brightness < 200 && contrast > 20) ? 'good' : 'poor',
      feedback
    };
  }

  /**
   * Start recording
   */
  async startRecording(stream, options = {}) {
    this.recordedChunks = [];

    const defaultOptions = {
      mimeType: 'video/webm;codecs=vp9',
      videoBitsPerSecond: 2500000
    };

    try {
      this.mediaRecorder = new MediaRecorder(stream, { ...defaultOptions, ...options });

      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          this.recordedChunks.push(event.data);
        }
      };

      this.mediaRecorder.start(100);
      return true;
    } catch (error) {
      console.error('Failed to start recording:', error);
      return false;
    }
  }

  /**
   * Stop recording and get blob
   */
  async stopRecording() {
    return new Promise((resolve) => {
      if (!this.mediaRecorder) {
        resolve(null);
        return;
      }

      this.mediaRecorder.onstop = () => {
        const blob = new Blob(this.recordedChunks, { type: 'video/webm' });
        this.recordedChunks = [];
        resolve(blob);
      };

      this.mediaRecorder.stop();
    });
  }
}

export default new VideoProcessor();
