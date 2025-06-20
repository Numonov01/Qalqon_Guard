import type { FullLogs } from 'src/types/full-logs';

import axios from 'axios';

const api = axios.create({
  baseURL: 'http://192.168.0.173:8000/',
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
