import type { Device, EdrLogs } from 'src/types/device';

import { useState, useEffect } from 'react';

import { fetchEdrLogs } from 'src/service/devices';

export function useEdrLogs() {
  const [tableData, setTableData] = useState<EdrLogs[]>([]);
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const wsUrl = `${import.meta.env.VITE_WS_URL}ws/edr-logs/`;
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      console.log('WebSocket connected');
    };

    ws.onmessage = (event) => {
      try {
        const newData: EdrLogs = JSON.parse(event.data);
        setTableData((prev) => [newData, ...prev].slice(0, 100));

        if (newData.device) {
          setDevices((prevDevices) => {
            const exists = prevDevices.some((d) => d.id === newData.device?.id);
            return exists ? prevDevices : [...prevDevices, newData.device];
          });
        }
      } catch (err) {
        console.error('WebSocket parse error:', err);
      }
    };

    ws.onerror = (err) => console.error('WebSocket error:', err);
    ws.onclose = () => console.log('WebSocket closed');

    return () => ws.close();
  }, []);

  useEffect(() => {
    const loadLogs = async () => {
      try {
        const response = await fetchEdrLogs();
        const data: EdrLogs[] = Array.isArray((response as any).results)
          ? (response as any).results
          : [response as EdrLogs];

        setTableData(data);

        const uniqueDevices: Device[] = [];
        const seen = new Set<number>();
        data.forEach((log) => {
          if (log.device && !seen.has(log.device.id)) {
            uniqueDevices.push(log.device);
            seen.add(log.device.id);
          }
        });
        setDevices(uniqueDevices);
      } catch (err) {
        console.error('Failed to load logs:', err);
      } finally {
        setLoading(false);
      }
    };

    loadLogs();
  }, []);

  return { tableData, devices, loading };
}
