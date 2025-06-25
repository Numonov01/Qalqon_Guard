// src/service/edr-logs.ts
import type { Device, EdrLogs } from 'src/types/device';

import { useState, useEffect } from 'react';

import { fetchEdrLogsList } from './devices';

export function useEdrLogs(
  page: number,
  rowsPerPage: number,
  filterName: string,
  deviceFilter: string
) {
  const [tableData, setTableData] = useState<EdrLogs[]>([]);
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);
  const [count, setCount] = useState(0);
  const [next, setNext] = useState<string | null>(null);
  const [previous, setPrevious] = useState<string | null>(null);

  useEffect(() => {
    const loadLogs = async () => {
      setLoading(true);
      try {
        const response = await fetchEdrLogsList(page + 1);
        setTableData(response.results || []);
        setCount(response.count || 0);
        setNext(response.next);
        setPrevious(response.previous);

        const uniqueDevices: Device[] = [];
        const seen = new Set<number>();
        response.results.forEach((log) => {
          if (log.device && !seen.has(log.device.id)) {
            uniqueDevices.push(log.device);
            seen.add(log.device.id);
          }
        });
        setDevices(uniqueDevices);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };
    loadLogs();
  }, [page, rowsPerPage]);

  useEffect(() => {
    const wsUrl = `${import.meta.env.VITE_WS_URL}ws/edr-logs/`;
    const ws = new WebSocket(wsUrl);

    ws.onmessage = (event) => {
      try {
        const newData: EdrLogs = JSON.parse(event.data);
        setTableData((prev) => [newData, ...prev].slice(0, 100));
      } catch (err) {
        console.error('WebSocket parse error:', err);
      }
    };
    return () => ws.close();
  }, []);

  const filteredData = tableData.filter((log) => {
    const matchesText =
      log.action.toLowerCase().includes(filterName.toLowerCase()) ||
      log.direction.toLowerCase().includes(filterName.toLowerCase()) ||
      log.device?.name?.toLowerCase().includes(filterName.toLowerCase());

    const matchesDevice = deviceFilter === 'all' || log.device?.name === deviceFilter;

    return matchesText && matchesDevice;
  });

  return { tableData: filteredData, devices, loading, count, next, previous };
}
