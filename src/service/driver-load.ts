import type { DriverLoadList } from 'src/types/driver-load';

import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_QWERT_API,
});

export const fetchDriverLoadList = async (page = 1, search = ''): Promise<DriverLoadList> => {
  try {
    const params: Record<string, any> = { page };
    if (search) params.search = search;

    const response = await api.get(`/driver-load/suspicious-drivers/?page=${page}`, { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching suspicious driver list:', error);
    throw error;
  }
};
