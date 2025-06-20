// src/notification-item.tsx
import type { WSNotification } from 'src/types/notification';

import { Card, Stack, Button, Typography } from '@mui/material';

export function NotificationItem({
  notification,
  onAllow,
  onBlock,
}: {
  notification: WSNotification;
  onAllow: (id: number) => void;
  onBlock: (id: number) => void;
}) {
  const data = notification.full_data.full_data;
  const { todo } = notification.full_data;

  return (
    <Card sx={{ p: 2 }}>
      <Stack spacing={1}>
        <Typography variant="subtitle2">ID: {notification.id}</Typography>
        <Typography variant="body2">Event: {notification.event}</Typography>
        <Typography variant="body2">Device: {notification.device}</Typography>

        <Typography variant="body2">Name: {data.name}</Typography>
        <Typography variant="body2">PID: {data.pid}</Typography>
        <Typography variant="body2">Parent PID: {data.parent_pid}</Typography>
        <Typography variant="body2">Risk Score: {data.risk_score}</Typography>
        <Typography variant="body2">CWD: {data.cwd}</Typography>

        <Typography variant="body2">
          Command Line:
          <ul style={{ margin: '4px 0 0 16px' }}>
            {data.cmdline?.map((cmd: string, idx: number) => <li key={idx}>{cmd}</li>)}
          </ul>
        </Typography>

        <Typography variant="body2">
          MITRE IDs:
          <ul style={{ margin: '4px 0 0 16px' }}>
            {data.mitre_ids?.map((id: string, idx: number) => <li key={idx}>{id}</li>)}
          </ul>
        </Typography>

        <Typography variant="body2">Todo: {todo}</Typography>

        <Stack direction="row" spacing={2} mt={1}>
          <Button variant="contained" size="small" onClick={() => onAllow(notification.id)}>
            Allow
          </Button>
          <Button variant="outlined" size="small" onClick={() => onBlock(notification.id)}>
            Block
          </Button>
        </Stack>
      </Stack>
    </Card>
  );
}
