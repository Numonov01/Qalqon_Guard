import type { WSNotification } from 'src/types/notification';

import { useState, useEffect } from 'react';

import { Box, Card, Stack, Alert, Button, Divider, Collapse, Typography } from '@mui/material';
import {
  Block,
  Security,
  Computer,
  ExpandMore,
  ExpandLess,
  CheckCircle,
} from '@mui/icons-material';

import { updateNotificationViewStatus } from './ws';

export function NotificationItem({
  notification,
  onAllow,
  onBlock,
}: {
  notification: WSNotification;
  onAllow: (id: number) => void;
  onBlock: (id: number) => void;
}) {
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (!notification.is_viwed) {
      updateNotificationViewStatus(notification.id);
    }
  }, [notification.id, notification.is_viwed]);

  const data = notification.full_data.about;
  const { todo } = notification.full_data;
  const device = notification.device_info;

  const getRiskLevel = (score: number) => {
    if (score >= 8) return { level: 'high', color: 'error' as const, text: 'Yuqori' };
    if (score >= 5) return { level: 'medium', color: 'warning' as const, text: "O'rta" };
    return { level: 'low', color: 'primary' as const, text: 'Past' };
  };

  const riskInfo = getRiskLevel(data?.risk_score || 0);

  console.log('Device info:', { notification });

  return (
    <Card
      sx={{
        p: 0,
        border: '1px solid',
        borderColor:
          riskInfo.level === 'high'
            ? 'error.light'
            : riskInfo.level === 'medium'
              ? 'warning.light'
              : '#FDA94E',
        borderRadius: 2,
        overflow: 'hidden',
        transition: 'all 0.3s ease',
        '&:hover': {
          boxShadow: 4,
          transform: 'translateY(-2px)',
        },
      }}
    >
      <Box
        sx={{
          background: `linear-gradient(135deg, ${
            riskInfo.level === 'high'
              ? '#ff5252, #f44336'
              : riskInfo.level === 'medium'
                ? '#ffb74d, #FDA94E'
                : '#FDA94E, #ffcc80'
          })`,
          color: 'white',
          p: 2,
        }}
      >
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Stack direction="row" alignItems="center" spacing={2}>
            <Security fontSize="large" />
            <Box>
              <Typography variant="h6" fontWeight="bold">
                Security Event #{notification.id}
              </Typography>
              <Stack direction="row" alignItems="center" spacing={1} mt={0.5}>
                <Computer fontSize="small" />
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  {device?.bios_uuid || 'Maʼlumot mavjud emas'}
                </Typography>
              </Stack>
            </Box>
          </Stack>
        </Stack>
      </Box>

      <Box sx={{ p: 2 }}>
        <Stack spacing={2}>
          <Box>
            <Typography variant="body2" color="text.secondary">
              Name: {device?.name || 'Maʼlumot mavjud emas'}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              Ip address: {device?.ip_address || 'Maʼlumot mavjud emas'}
            </Typography>
          </Box>

          <Divider />

          <Box>
            <Button
              onClick={() => setExpanded(!expanded)}
              endIcon={expanded ? <ExpandLess /> : <ExpandMore />}
              sx={{
                mb: 1,
                color: '#FDA94E',
                '&:hover': { backgroundColor: '#FFF0D9' },
              }}
            >
              Batafsil maʼlumotlar
            </Button>

            <Collapse in={expanded}>
              <Stack spacing={2}>
                <Box>
                  <Typography variant="subtitle2" gutterBottom>
                    File maʼlumotlari:
                  </Typography>
                  <Box
                    sx={{
                      backgroundColor: '#FFF7EB',
                      borderRadius: 1,
                      p: 1,
                      maxHeight: 150,
                      overflow: 'auto',
                    }}
                  >
                    <Typography
                      variant="body2"
                      component="div"
                      sx={{
                        fontFamily: 'monospace',
                        fontSize: '0.8rem',
                        mb: 0.5,
                      }}
                    >
                      {data?.file_hash || 'Nomaʼlum'}
                    </Typography>
                    <Typography
                      variant="body2"
                      component="div"
                      sx={{
                        fontFamily: 'monospace',
                        fontSize: '0.8rem',
                        mb: 0.5,
                      }}
                    >
                      {data?.file_path || 'Nomaʼlum'}
                    </Typography>
                  </Box>
                </Box>
              </Stack>
            </Collapse>
          </Box>

          {(todo || notification.event) && (
            <>
              <Divider />
              <Box>
                {todo && (
                  <Alert
                    severity="info"
                    sx={{ mb: 1, backgroundColor: '#FFF0D9', color: '#6B4A00' }}
                  >
                    <Typography variant="body2">
                      <strong>Vazifa:</strong> {todo}
                    </Typography>
                  </Alert>
                )}
                <Typography variant="body2" color="text.secondary">
                  <strong>Event turi:</strong> {notification.event}
                </Typography>
              </Box>
            </>
          )}

          <Divider />
          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <Button
              variant="contained"
              sx={{
                backgroundColor: '#4CAF50',
                '&:hover': { backgroundColor: '#43A047' },
                minWidth: 120,
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 'bold',
              }}
              startIcon={<CheckCircle />}
              onClick={() => onAllow(notification.id)}
            >
              Ruxsat berish
            </Button>
            <Button
              variant="contained"
              sx={{
                backgroundColor: '#F44336',
                '&:hover': { backgroundColor: '#E53935' },
                minWidth: 120,
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 'bold',
              }}
              startIcon={<Block />}
              onClick={() => onBlock(notification.id)}
            >
              Bloklash
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Card>
  );
}
