import type { SuspiciousList } from 'src/types/suspicious';

import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_QWERT_API,
});

export const fetchSuspiciousFileList = async (page = 1, search = ''): Promise<SuspiciousList> => {
  try {
    const params: Record<string, any> = { page };
    if (search) params.search = search;

    const response = await api.get(`/suspicious/suspicious-files/?page=${page}`, { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching suspicious list:', error);
    throw error;
  }
};
