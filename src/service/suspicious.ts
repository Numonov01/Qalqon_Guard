import type { SuspiciousList } from 'src/types/suspicious';

import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_QWERT_API,
});

export const fetchSuspiciousFileList = async (page = 1): Promise<SuspiciousList> => {
  try {
    const response = await api.get(`/suspicious/suspicious-files/?page=${page}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching suspicious list:', error);
    throw error;
  }
};
