import type { WSNotification } from 'src/types/notification';

import axios from 'axios';
import { useRef, useState, useEffect } from 'react';

const api = axios.create({
  baseURL: import.meta.env.VITE_QWERT_API,
});

export const fetchNotificationList = async (): Promise<WSNotification[]> => {
  try {
    const response = await api.get('/malicious_file_detects/approve-to-run/', {
      params: { is_viwed: false }, // faqat ko‘rilmaganlar
    });
    const results = response.data?.results || [];

    return results
      .filter((item: any) => item.is_viwed === false)
      .map((item: any) => ({
        id: item.id,
        event: 'new_approval_request',
        full_data: item.full_data,
        device_info: item.device_info,
        is_viwed: item.is_viwed,
        is_approved: item.is_approved,
      }));
  } catch (error) {
    console.error('Error fetching notification list:', error);
    return [];
  }
};

export function useWebSocketNotifications() {
  const [notifications, setNotifications] = useState<WSNotification[]>([]);
  const [newNotification, setNewNotification] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

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
            is_approved: data.is_approved,
            device_info: data.device_info,
            is_viwed: data.is_viwed || false,
          };

          setNotifications((prev) => [mapped, ...prev]);

          setNewNotification(true);
          if (timeoutRef.current) clearTimeout(timeoutRef.current);
          timeoutRef.current = setTimeout(() => setNewNotification(false), 4000);
        }
      } catch (e) {
        console.error('WebSocket parsing error:', e);
      }
    };

    ws.onerror = (e) => console.error('WebSocket error:', e);

    return () => {
      ws.close();
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return { notifications, setNotifications, newNotification, setNewNotification };
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

export const updateNotificationViewStatus = async (id: number): Promise<void> => {
  try {
    await api.patch(`/malicious_file_detects/approve-to-run/${id}/`, {
      is_viwed: true,
    });
  } catch (error) {
    console.error(`Error marking notification ${id} as viewed:`, error);
  }
};
