import type { StackDetectionList } from 'src/types/stack-detect';

import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_QWERT_API,
});

export const fetchStackDetectionList = async (page = 1): Promise<StackDetectionList> => {
  try {
    const response = await api.get(`/stack-detect/stack-pivot-detect/?page=${page}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching privilege list:', error);
    throw error;
  }
};
