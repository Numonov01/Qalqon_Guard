import type { DriverLoadList } from 'src/types/driver-load';

import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_QWERT_API,
});

export const fetchDriverLoadList = async (page = 1): Promise<DriverLoadList> => {
  try {
    const response = await api.get(`/driver-load/suspicious-drivers/?page=${page}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching suspicious driver list:', error);
    throw error;
  }
};
