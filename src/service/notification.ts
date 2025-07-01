import type { WSNotification, NotificationList } from 'src/types/notification';

import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_QWERT_API,
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

export const fetchNotification = async (page = 1): Promise<NotificationList> => {
  try {
    const response = await api.get(`/malicious_file_detects/approve-to-run/?page=${page}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching list:', error);
    throw error;
  }
};
