// src/components/UserTable.tsx
import type { Device } from 'src/types/device';

import React, { useState, useEffect } from 'react';

import {
  Table,
  Paper,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  TableContainer,
  TablePagination,
} from '@mui/material';

import { fetchDeviceList } from 'src/service/devices';

import { Label } from 'src/components/label';

interface UserTableProps {
  dense?: boolean;
  page: number;
  rowsPerPage: number;
  onPageChange: (newPage: number) => void;
  onRowsPerPageChange: (newRowsPerPage: number) => void;
}

export function UserTable({
  dense = false,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
}: UserTableProps) {
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);
  const [count, setCount] = useState(0);
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [connectionAttempts, setConnectionAttempts] = useState(0);

  useEffect(() => {
    const loadDevices = async () => {
      setLoading(true);
      try {
        const data = await fetchDeviceList(page + 1);
        setDevices(data.results);
        setCount(data.count);
      } catch (error) {
        console.error('Failed to load devices:', error);
      } finally {
        setLoading(false);
      }
    };
    loadDevices();
  }, [page, rowsPerPage]);

  useEffect(() => {
    const connectWebSocket = () => {
      try {
        const wsUrl = `${import.meta.env.VITE_WS_URL}ws/frontend/devices/`;
        const ws = new WebSocket(wsUrl);

        ws.onopen = () => {
          console.log('WebSocket connected device table');
          setConnectionAttempts(0);
        };
        ws.onmessage = (event) => {
          try {
            const updateData = JSON.parse(event.data);
            setDevices((prevDevices) =>
              prevDevices.map((device) =>
                device.bios_uuid === updateData.bios_uuid
                  ? { ...device, is_active: updateData.is_active, ip_addres: updateData.ip }
                  : device
              )
            );
          } catch (parseError) {
            console.error('Error parsing WebSocket message:', parseError);
          }
        };
        ws.onerror = (error) => {
          console.error('WebSocket error:', error);
          ws.close();
        };
        ws.onclose = () => {
          console.log('WebSocket closed, attempting to reconnect...');
          const delay = Math.min(1000 * 2 ** connectionAttempts, 30000);
          setTimeout(() => {
            setConnectionAttempts((prev) => prev + 1);
            connectWebSocket();
          }, delay);
        };
        setSocket(ws);
      } catch (error) {
        console.error('WebSocket initialization error:', error);
      }
    };
    connectWebSocket();
  }, [connectionAttempts]);

  useEffect(() => () => socket?.close(), [socket]);

  return (
    <>
      <TableContainer component={Paper} sx={{ borderRadius: 0 }}>
        <Table size={dense ? 'small' : 'medium'}>
          <TableHead>
            <TableRow>
              <TableCell>Id</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Bios</TableCell>
              <TableCell>IP Address</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : (
              devices.map((device) => (
                <TableRow key={device.id} hover>
                  <TableCell>{device.id}</TableCell>
                  <TableCell>{device.name}</TableCell>
                  <TableCell>{device.bios_uuid}</TableCell>
                  <TableCell>{device.ip_addres}</TableCell>
                  <TableCell>
                    <Label variant="soft" color={device.is_active ? 'success' : 'warning'}>
                      {device.is_active ? 'Active' : 'Inactive'}
                    </Label>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={count}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={(_, newPage) => onPageChange(newPage)}
        onRowsPerPageChange={(e) => onRowsPerPageChange(parseInt(e.target.value, 10))}
      />
    </>
  );
}
