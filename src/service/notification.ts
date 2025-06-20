import type { WSNotification } from 'src/types/notification';

import axios from 'axios';

const api = axios.create({
  baseURL: 'http://192.168.0.173:8000/',
});

export const fetchNotificationList = async (): Promise<WSNotification> => {
  try {
    const response = await api.get('/malicious_file_detects/approve-to-run/', {});
    return response.data;
  } catch (error) {
    console.error('Error fetching list:', error);
    throw error;
  }
};
