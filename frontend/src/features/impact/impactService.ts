import api from '../../services/api';

export const impactService = {
  /**
   * Fetch statistical classification reports measuring true underlying business/operational friction.
   */
  getEvaluation: async () => {
    const response = await api.get('/evaluation');
    return response.data;
  }
};
