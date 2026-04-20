import api from '../../services/api';

export const historyService = {
  /**
   * Fetch recent prediction logs from the backend.
   */
  getLogs: async (limit: number = 20) => {
    const response = await api.get(`/logs?limit=${limit}`);
    return response.data;
  }
};
