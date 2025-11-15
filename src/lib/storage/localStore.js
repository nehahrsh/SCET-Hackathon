/**
 * Local Storage Manager
 * Handles offline data persistence with encryption-ready structure
 */

const STORAGE_PREFIX = 'mamasafe_';
const ASSESSMENTS_KEY = `${STORAGE_PREFIX}assessments`;
const CURRENT_SESSION_KEY = `${STORAGE_PREFIX}current_session`;

export class LocalStore {
  constructor() {
    this.encryptionEnabled = false; // Can be enabled in production
  }

  /**
   * Save assessment result
   */
  async saveAssessment(assessment) {
    try {
      const assessments = await this.getAllAssessments();
      assessments.push({
        ...assessment,
        id: this.generateId(),
        savedAt: Date.now()
      });

      localStorage.setItem(ASSESSMENTS_KEY, JSON.stringify(assessments));
      return true;
    } catch (error) {
      console.error('Failed to save assessment:', error);
      return false;
    }
  }

  /**
   * Get all saved assessments
   */
  async getAllAssessments() {
    try {
      const data = localStorage.getItem(ASSESSMENTS_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Failed to retrieve assessments:', error);
      return [];
    }
  }

  /**
   * Get assessment by ID
   */
  async getAssessment(id) {
    const assessments = await this.getAllAssessments();
    return assessments.find(a => a.id === id);
  }

  /**
   * Delete assessment
   */
  async deleteAssessment(id) {
    try {
      const assessments = await this.getAllAssessments();
      const filtered = assessments.filter(a => a.id !== id);
      localStorage.setItem(ASSESSMENTS_KEY, JSON.stringify(filtered));
      return true;
    } catch (error) {
      console.error('Failed to delete assessment:', error);
      return false;
    }
  }

  /**
   * Save current session data
   */
  async saveSession(sessionData) {
    try {
      localStorage.setItem(CURRENT_SESSION_KEY, JSON.stringify({
        ...sessionData,
        lastUpdated: Date.now()
      }));
      return true;
    } catch (error) {
      console.error('Failed to save session:', error);
      return false;
    }
  }

  /**
   * Get current session
   */
  async getSession() {
    try {
      const data = localStorage.getItem(CURRENT_SESSION_KEY);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Failed to retrieve session:', error);
      return null;
    }
  }

  /**
   * Clear current session
   */
  async clearSession() {
    try {
      localStorage.removeItem(CURRENT_SESSION_KEY);
      return true;
    } catch (error) {
      console.error('Failed to clear session:', error);
      return false;
    }
  }

  /**
   * Export all data as JSON
   */
  async exportData() {
    const assessments = await this.getAllAssessments();
    return {
      assessments,
      exportedAt: new Date().toISOString(),
      version: '1.0.0'
    };
  }

  /**
   * Clear all data
   */
  async clearAllData() {
    try {
      localStorage.removeItem(ASSESSMENTS_KEY);
      localStorage.removeItem(CURRENT_SESSION_KEY);
      return true;
    } catch (error) {
      console.error('Failed to clear data:', error);
      return false;
    }
  }

  /**
   * Generate unique ID
   */
  generateId() {
    return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Get storage statistics
   */
  async getStats() {
    const assessments = await this.getAllAssessments();

    return {
      totalAssessments: assessments.length,
      storageUsed: new Blob([JSON.stringify(assessments)]).size,
      oldestAssessment: assessments.length > 0 ? new Date(Math.min(...assessments.map(a => a.savedAt))) : null,
      newestAssessment: assessments.length > 0 ? new Date(Math.max(...assessments.map(a => a.savedAt))) : null
    };
  }
}

export default new LocalStore();
