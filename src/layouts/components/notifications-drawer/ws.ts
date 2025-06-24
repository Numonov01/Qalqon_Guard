// src/ws.ts
import type { WSNotification } from 'src/types/notification';

import axios from 'axios';
import { useState, useEffect } from 'react';

const api = axios.create({
  baseURL: import.meta.env.VITE_QWERT_API,
});

export const fetchNotificationList = async (): Promise<WSNotification[]> => {
  try {
    const response = await api.get('/malicious_file_detects/approve-to-run/');
    const results = response.data?.results || [];

    return results.map((item: any) => ({
      id: item.id,
      event: 'new_approval_request',
      full_data: item.full_data,
      device: item.device_info?.bios_uuid || '',
    }));
  } catch (error) {
    console.error('Error fetching notification list:', error);
    return [];
  }
};

export function useWebSocketNotifications() {
  const [notifications, setNotifications] = useState<WSNotification[]>([]);

  useEffect(() => {
    fetchNotificationList().then(setNotifications);

    const wsUrl = `${import.meta.env.VITE_WS_URL}ws/approve-frontend/`;
    const ws = new WebSocket(wsUrl);

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        if (data.event === 'new_approval_request') {
          const mapped: WSNotification = {
            id: data.id,
            event: data.event,
            full_data: data.full_data,
            device: data.device,
          };
          setNotifications((prev) => [mapped, ...prev]);
        }
      } catch (e) {
        console.error('WebSocket parsing error:', e);
      }
    };

    ws.onerror = (e) => console.error('WebSocket error:', e);

    return () => {
      ws.close();
    };
  }, []);

  return { notifications, setNotifications };
}

export const updateNotification = async (
  id: number,
  action: 'APPROVE' | 'REJECT'
): Promise<void> => {
  try {
    await api.patch(`malicious_file_detects/approve-to-run/${id}/`, {
      is_approved: action,
    });
  } catch (error) {
    console.error(`Error updating notification ${id}:`, error);
    throw error;
  }
};
