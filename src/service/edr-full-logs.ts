import type { FullLogs, EdrDevice } from 'src/types/full-logs';

import { useState, useEffect } from 'react';

import { fetchFullLogsList } from './full-logs';

export function useFullLogs() {
  const [tableData, setTableData] = useState<FullLogs[]>([]);
  const [devices, setDevices] = useState<EdrDevice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const wsUrl = `${import.meta.env.VITE_WS_URL}ws/edr-full-logs/`;
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      console.log('WebSocket connected');
    };

    ws.onmessage = (event) => {
      try {
        const newData: FullLogs = JSON.parse(event.data);
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
        const response = await fetchFullLogsList();
        const data: FullLogs[] = Array.isArray((response as any).results)
          ? (response as any).results
          : [response as FullLogs];

        setTableData(data);

        const uniqueDevices: EdrDevice[] = [];
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
