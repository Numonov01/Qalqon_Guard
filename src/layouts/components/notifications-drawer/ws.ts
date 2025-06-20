// src/ws.ts
import type { WSNotification } from 'src/types/notification';

import axios from 'axios';
import { useState, useEffect } from 'react';

const api = axios.create({
  baseURL: 'http://192.168.0.173:8000/',
});

// Fetch API dan ro‘yxat olish
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

// WebSocket dan jonli ma’lumot olish
export function useWebSocketNotifications() {
  const [notifications, setNotifications] = useState<WSNotification[]>([]);

  useEffect(() => {
    // Step 1: Fetch initial list
    fetchNotificationList().then(setNotifications);

    // Step 2: WebSocket ulanish
    const ws = new WebSocket('ws://192.168.0.173:8000/ws/approve-frontend/');

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
