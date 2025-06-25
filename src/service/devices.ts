import type { EdrInfo, DeviceList, EdrLogsList } from 'src/types/device';

import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_QWERT_API,
});

export const fetchDeviceList = async (page = 1): Promise<DeviceList> => {
  try {
    const response = await api.get<DeviceList>(`/malicious_file_detects/devices/?page=${page}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching device list:', error);
    throw error;
  }
};

export const fetchEdrInfo = async (): Promise<EdrInfo> => {
  try {
    const response = await api.get('/malicious_file_detects/edr-info/', {});
    return response.data;
  } catch (error) {
    console.error('Error fetching device list:', error);
    throw error;
  }
};

// // for ws
// export const fetchEdrLogs = async (): Promise<EdrLogs> => {
//   try {
//     const response = await api.get('/malicious_file_detects/edr-logs/', {});
//     return response.data;
//   } catch (error) {
//     console.error('Error fetching device list:', error);
//     throw error;
//   }
// };

// not ws
export const fetchEdrLogsList = async (page = 1): Promise<EdrLogsList> => {
  try {
    const response = await api.get(`/malicious_file_detects/edr-logs/?page=${page}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching edr logs list:', error);
    throw error;
  }
};
