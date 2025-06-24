import type { FullLogs } from 'src/types/full-logs';

import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_QWERT_API,
});

export const fetchFullLogsList = async (): Promise<FullLogs> => {
  try {
    const response = await api.get('/malicious_file_detects/full-logs/', {});
    return response.data;
  } catch (error) {
    console.error('Error fetching device list:', error);
    throw error;
  }
};
