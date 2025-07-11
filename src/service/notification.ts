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

export const fetchNotification = async (
  page = 1,
  full_data_search = ''
): Promise<NotificationList> => {
  try {
    const params: Record<string, any> = { page };
    if (full_data_search) params.full_data_search = full_data_search;

    const response = await api.get(`/malicious_file_detects/approve-to-run/?page=${page}`, {
      params,
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching list:', error);
    throw error;
  }
};
