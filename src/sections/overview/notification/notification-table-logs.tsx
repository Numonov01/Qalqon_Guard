import type { WSNotification } from 'src/types/notification';

import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Collapse from '@mui/material/Collapse';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import { Tooltip, Typography } from '@mui/material';
import ListItemText from '@mui/material/ListItemText';

import { useBoolean } from 'src/hooks/use-boolean';

import {
  updateNotification,
  useWebSocketNotifications,
} from 'src/layouts/components/notifications-drawer/ws';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';

type Props = {
  row: WSNotification;
};

export function NotificationTableRow({ row }: Props) {
  const collapse = useBoolean();
  const { setNotifications } = useWebSocketNotifications();

  const handleToggle = (e: React.MouseEvent) => {
    if ((e.target as Element).closest('button')) {
      return;
    }
    collapse.onToggle();
  };

  const handleAllow = async (id: number) => {
    try {
      await updateNotification(id, 'APPROVE');
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    } catch (error) {
      console.error('Failed to allow notification:', error);
    }
  };

  const handleBlock = async (id: number) => {
    try {
      await updateNotification(id, 'REJECT');
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    } catch (error) {
      console.error('Failed to block notification:', error);
    }
  };

  return (
    <>
      <TableRow hover onClick={handleToggle} sx={{ cursor: 'pointer' }}>
        <TableCell>
          <ListItemText
            primary={row.device_info?.name}
            secondary={row.device_info?.bios_uuid}
            primaryTypographyProps={{ typography: 'body2' }}
            secondaryTypographyProps={{
              component: 'span',
              color: 'text.disabled',
              mt: 0.5,
            }}
          />
        </TableCell>

        <TableCell>{row.full_data.description}</TableCell>

        <TableCell>{row.full_data.todo}</TableCell>
        <TableCell>
          <Label
            variant="inverted"
            color={
              (row.is_approved === 'REJECT' && 'success') ||
              (row.is_approved === 'WAITING' && 'warning') ||
              (row.is_approved === 'APPROVE' && 'error') ||
              'default'
            }
          >
            {row.is_approved}
          </Label>
        </TableCell>
        <TableCell align="right">
          <Stack direction="row" spacing={0.5} alignItems="center">
            <Tooltip title="Allow">
              <IconButton
                color="success"
                onClick={(e) => {
                  e.stopPropagation();
                  handleAllow(row.id);
                }}
                sx={{
                  '&:hover': {
                    backgroundColor: 'success.light',
                    color: 'success.contrastText',
                  },
                }}
              >
                <Iconify icon="eva:checkmark-fill" width={20} />
              </IconButton>
            </Tooltip>

            <Tooltip title="Block">
              <IconButton
                color="error"
                onClick={(e) => {
                  e.stopPropagation();
                  handleBlock(row.id);
                }}
                sx={{
                  '&:hover': {
                    backgroundColor: 'error.light',
                    color: 'error.contrastText',
                  },
                }}
              >
                <Iconify icon="eva:close-fill" width={20} />
              </IconButton>
            </Tooltip>
          </Stack>
        </TableCell>

        <TableCell align="right" sx={{ px: 1, whiteSpace: 'nowrap' }}>
          <IconButton
            color={collapse.value ? 'inherit' : 'default'}
            onClick={(e) => {
              e.stopPropagation();
              collapse.onToggle();
            }}
            sx={{ ...(collapse.value && { bgcolor: 'action.hover' }) }}
          >
            <Iconify icon="eva:arrow-ios-downward-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      <TableRow>
        <TableCell sx={{ p: 0, border: 'none' }} colSpan={6}>
          <Collapse
            in={collapse.value}
            timeout="auto"
            unmountOnExit
            sx={{ bgcolor: 'background.neutral' }}
          >
            <Paper sx={{ m: 1.5 }}>
              <Stack direction="row" alignItems="center" spacing={2} sx={{ p: 2 }}>
                <Box>
                  <ListItemText
                    primary="File Hash"
                    secondary={row.full_data.about.file_hash}
                    primaryTypographyProps={{ typography: 'body2' }}
                    secondaryTypographyProps={{
                      component: 'span',
                      color: 'text.disabled',
                      mt: 0.5,
                    }}
                  />
                </Box>
              </Stack>
            </Paper>

            <Paper sx={{ m: 1.5 }}>
              <Stack spacing={2} sx={{ p: 2 }}>
                <ListItemText
                  primary="File Path"
                  secondary={row.full_data.about.file_path}
                  primaryTypographyProps={{ typography: 'body2' }}
                  secondaryTypographyProps={{
                    component: 'span',
                    color: 'text.disabled',
                    mt: 0.5,
                  }}
                />
              </Stack>
            </Paper>

            <Paper sx={{ m: 1.5 }}>
              <Stack direction="row" alignItems="center" sx={{ p: 2 }}>
                <Box>
                  <Typography variant="subtitle2" gutterBottom>
                    Reason
                  </Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap">
                    {Array.isArray(row.full_data.about.reason) ? (
                      row.full_data.about.reason.map((reason: string) => (
                        <Label key={reason} variant="soft" color="info">
                          {reason}
                        </Label>
                      ))
                    ) : (
                      <Label variant="soft" color="info">
                        {row.full_data.about.reason}
                      </Label>
                    )}
                  </Stack>
                </Box>
              </Stack>
            </Paper>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}
