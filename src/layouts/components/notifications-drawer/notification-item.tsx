import type { WSNotification } from 'src/types/notification';

import { useState } from 'react';

import {
  Block,
  Security,
  Computer,
  ExpandMore,
  ExpandLess,
  CheckCircle,
} from '@mui/icons-material';
import {
  Box,
  Card,
  Chip,
  Stack,
  Alert,
  Button,
  Divider,
  Collapse,
  Typography,
} from '@mui/material';

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
  const data = notification.full_data.full_data;
  const { todo } = notification.full_data;

  const getRiskLevel = (score: number) => {
    if (score >= 8) return { level: 'high', color: 'error' as const, text: 'Yuqori' };
    if (score >= 5) return { level: 'medium', color: 'warning' as const, text: "O'rta" };
    return { level: 'low', color: 'success' as const, text: 'Past' };
  };

  const riskInfo = getRiskLevel(data.risk_score);

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
              : 'success.light',
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
              ? '#ff5252 0%, #f44336 100%'
              : riskInfo.level === 'medium'
                ? '#ff9800 0%, #f57c00 100%'
                : '#4caf50 0%, #388e3c 100%'
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
                  {notification.device}
                </Typography>
              </Stack>
            </Box>
          </Stack>

          <Chip
            label={`${riskInfo.text} Xavf`}
            size="small"
            sx={{
              backgroundColor: 'rgba(255,255,255,0.2)',
              color: 'white',
              fontWeight: 'bold',
            }}
          />
        </Stack>
      </Box>

      <Box sx={{ p: 2 }}>
        <Stack spacing={2}>
          <Box>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              Process Malumotlari
            </Typography>
            <Stack direction="row" flexWrap="wrap" gap={1} mb={1}>
              <Chip
                icon={<Security />}
                label={`PID: ${data.pid}`}
                size="small"
                variant="outlined"
              />
              <Chip label={`Parent PID: ${data.parent_pid}`} size="small" variant="outlined" />
              <Chip
                label={`Risk: ${data.risk_score}/10`}
                size="small"
                color={riskInfo.color}
                sx={{ fontWeight: 'bold' }}
              />
            </Stack>
            <Typography variant="body2" color="text.secondary">
              <strong>Nom:</strong> {data.name}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              <strong>Ishchi katalog:</strong> {data.cwd}
            </Typography>
          </Box>

          <Divider />

          <Box>
            <Button
              onClick={() => setExpanded(!expanded)}
              endIcon={expanded ? <ExpandLess /> : <ExpandMore />}
              sx={{ mb: 1 }}
            >
              Batafsil malumotlar
            </Button>

            <Collapse in={expanded}>
              <Stack spacing={2}>
                {data.cmdline && data.cmdline.length > 0 && (
                  <Box>
                    <Typography variant="subtitle2" gutterBottom>
                      Buyruq qatori:
                    </Typography>
                    <Box
                      sx={{
                        backgroundColor: 'grey.100',
                        borderRadius: 1,
                        p: 1,
                        maxHeight: 150,
                        overflow: 'auto',
                      }}
                    >
                      {data.cmdline.map((cmd: string, idx: number) => (
                        <Typography
                          key={idx}
                          variant="body2"
                          component="div"
                          sx={{
                            fontFamily: 'monospace',
                            fontSize: '0.8rem',
                            mb: 0.5,
                          }}
                        >
                          {cmd}
                        </Typography>
                      ))}
                    </Box>
                  </Box>
                )}

                {data.mitre_ids && data.mitre_ids.length > 0 && (
                  <Box>
                    <Typography variant="subtitle2" gutterBottom>
                      MITRE ATT&CK Texnikalari:
                    </Typography>
                    <Stack direction="row" flexWrap="wrap" gap={0.5}>
                      {data.mitre_ids.map((id: string, idx: number) => (
                        <Chip
                          key={idx}
                          label={id}
                          size="small"
                          color="warning"
                          variant="outlined"
                        />
                      ))}
                    </Stack>
                  </Box>
                )}
              </Stack>
            </Collapse>
          </Box>

          {(todo || notification.event) && (
            <>
              <Divider />
              <Box>
                {todo && (
                  <Alert severity="info" sx={{ mb: 1 }}>
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
              color="success"
              startIcon={<CheckCircle />}
              onClick={() => onAllow(notification.id)}
              sx={{
                minWidth: 120,
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 'bold',
              }}
            >
              Ruxsat berish
            </Button>
            <Button
              variant="contained"
              color="error"
              startIcon={<Block />}
              onClick={() => onBlock(notification.id)}
              sx={{
                minWidth: 120,
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 'bold',
              }}
            >
              Bloklash
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Card>
  );
}
