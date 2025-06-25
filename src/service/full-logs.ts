import type { FullLogsResponse } from 'src/types/full-logs';

import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_QWERT_API,
});

export const fetchFullLogsList = async (page = 1): Promise<FullLogsResponse> => {
  try {
    const response = await api.get(`/malicious_file_detects/full-logs/?page=${page}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching full logs list:', error);
    throw error;
  }
};
