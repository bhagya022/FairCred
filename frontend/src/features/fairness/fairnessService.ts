import api from '../../services/api';

export const fairnessService = {
  /**
   * Fetch fairness analytics and report from the backend.
   */
  getFairnessReport: async () => {
    const response = await api.get('/fairness');
    return response.data;
  }
};
