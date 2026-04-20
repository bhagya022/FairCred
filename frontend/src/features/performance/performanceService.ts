import api from '../../services/api';

export const performanceService = {
  /**
   * Fetch statistical performance metrics for all candidate ML models.
   */
  getMetrics: async () => {
    const response = await api.get('/metrics');
    return response.data;
  }
};
