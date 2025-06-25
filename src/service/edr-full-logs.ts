import type { FullLogs, EdrDevice, FullLogsResponse } from 'src/types/full-logs';

import { useState, useEffect, useCallback } from 'react';

import { fetchFullLogsList } from './full-logs';

export function useFullLogs() {
  const [tableData, setTableData] = useState<FullLogs[]>([]);
  const [devices, setDevices] = useState<EdrDevice[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const [nextUrl, setNextUrl] = useState<string | null>(null);
  const [previousUrl, setPreviousUrl] = useState<string | null>(null);

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

  const loadLogs = useCallback(
    async (pageNum = page) => {
      setLoading(true);
      try {
        const response: FullLogsResponse = await fetchFullLogsList(pageNum);

        setTableData(response.results || []);
        setCount(response.count);
        setNextUrl(response.next);
        setPreviousUrl(response.previous);

        const uniqueDevices: EdrDevice[] = [];
        const seen = new Set<number>();
        response.results.forEach((log) => {
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
    },
    [page]
  );

  useEffect(() => {
    loadLogs();
  }, [loadLogs]);

  return {
    tableData,
    devices,
    loading,
    page,
    count,
    nextUrl,
    previousUrl,
    setPage,
  };
}
