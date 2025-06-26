import type { SuspiciousScriptsList } from 'src/types/suspicious-scripts';

import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_QWERT_API,
});

export const fetchSuspiciousScriptsList = async (page = 1): Promise<SuspiciousScriptsList> => {
  try {
    const response = await api.get(`/suspicious-scripts/suspicious-scripts/?page=${page}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching privilege list:', error);
    throw error;
  }
};
