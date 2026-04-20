import api from '../../services/api';

export const riskService = {
  /**
   * Submit a payload to generate a credit risk prediction.
   */
  predict: async (data: Record<string, any>) => {
    const response = await api.post('/predict', data);
    return response.data;
  },

  /**
   * Submit a payload to understand exact SHAP explanations for a prediction.
   */
  explain: async (data: Record<string, any>) => {
    const response = await api.post('/explain', data);
    return response.data;
  }
};
