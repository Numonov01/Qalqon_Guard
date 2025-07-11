import type { StackDetectionList } from 'src/types/stack-detect';

import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_QWERT_API,
});

export const fetchStackDetectionList = async (
  page = 1,
  search = ''
): Promise<StackDetectionList> => {
  try {
    const params: Record<string, any> = { page };
    if (search) params.search = search;

    const response = await api.get(`/stack-detect/stack-pivot-detect/?page=${page}`, { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching privilege list:', error);
    throw error;
  }
};
