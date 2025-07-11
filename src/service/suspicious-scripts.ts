import type { SuspiciousScriptsList } from 'src/types/suspicious-scripts';

import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_QWERT_API,
});

export const fetchSuspiciousScriptsList = async (
  page = 1,
  search = ''
): Promise<SuspiciousScriptsList> => {
  try {
    const params: Record<string, any> = { page };
    if (search) params.search = search;

    const response = await api.get(`/suspicious-scripts/suspicious-scripts/?page=${page}`, {
      params,
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching privilege list:', error);
    throw error;
  }
};
