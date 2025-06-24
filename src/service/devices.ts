import type { Device, EdrInfo, EdrLogs, DeviceList } from 'src/types/device';

import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_QWERT_API,
});

export const fetchDeviceList = async (): Promise<Device[]> => {
  try {
    const response = await api.get<DeviceList>('/malicious_file_detects/devices/', {});
    return response.data.results;
  } catch (error) {
    console.error('Error fetching device list:', error);
    throw error;
  }
};
//  try {
//     await axios.get('http://192.168.0.173:8000/malicious_file_detects/devices/').then((res) => {
//       console.log('sdkfhsaiodjfdiusdjdsjudsijoadwio');
//       console.log(res);
//     });
//   } catch (e) {
//     console.log(e.message);
//     console.log('erroooooooor');
//   }

export const fetchEdrInfo = async (): Promise<EdrInfo> => {
  try {
    const response = await api.get('/malicious_file_detects/edr-info/', {});
    return response.data;
  } catch (error) {
    console.error('Error fetching device list:', error);
    throw error;
  }
};

export const fetchEdrLogs = async (): Promise<EdrLogs> => {
  try {
    const response = await api.get('/malicious_file_detects/edr-logs/', {});
    return response.data;
  } catch (error) {
    console.error('Error fetching device list:', error);
    throw error;
  }
};
