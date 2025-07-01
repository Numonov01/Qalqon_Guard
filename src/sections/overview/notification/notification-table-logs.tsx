import type { WSNotification } from 'src/types/notification';

import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import { Typography } from '@mui/material';
import Collapse from '@mui/material/Collapse';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';

import { useBoolean } from 'src/hooks/use-boolean';

import { fTime, fDate } from 'src/utils/format-time';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';

type Props = {
  row: WSNotification;
};

export function NotificationTableRow({ row }: Props) {
  const collapse = useBoolean();

  const handleToggle = (e: React.MouseEvent) => {
    if ((e.target as Element).closest('button')) {
      return;
    }
    collapse.onToggle();
  };

  return (
    <>
      <TableRow hover onClick={handleToggle} sx={{ cursor: 'pointer' }}>
        <TableCell>
          <ListItemText
            primary={row.device_info.name}
            secondary={row.device_info.bios_uuid}
            primaryTypographyProps={{ typography: 'body2' }}
            secondaryTypographyProps={{
              component: 'span',
              color: 'text.disabled',
              mt: 0.5,
            }}
          />
        </TableCell>

        <TableCell>{row.full_data.full_data.name}</TableCell>
        <TableCell>
          <Label
            variant="soft"
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

        <TableCell>
          <ListItemText
            primary={fDate(row.full_data.full_data.timestamp)}
            secondary={fTime(row.full_data.full_data.timestamp)}
            primaryTypographyProps={{ typography: 'body2' }}
            secondaryTypographyProps={{
              component: 'span',
              color: 'text.disabled',
              mt: 0.5,
            }}
          />
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
                <ListItemText
                  primary={row.full_data.full_data.cwd}
                  secondary={row.full_data.todo}
                  primaryTypographyProps={{ typography: 'body2' }}
                  secondaryTypographyProps={{
                    component: 'span',
                    color: 'text.disabled',
                    mt: 0.5,
                  }}
                />
                <Box sx={{ px: 5 }}>PID: {row.full_data.full_data.pid}</Box>
                <Box>Parent PID: {row.full_data.full_data.parent_pid}</Box>
                {/* <Box sx={{ width: 210, textAlign: 'right' }}>
                  <ListItemText
                    primary={fDate(row.full_data.full_data.timestamp)}
                    secondary={fTime(row.full_data.full_data.timestamp)}
                    primaryTypographyProps={{ typography: 'body2' }}
                    secondaryTypographyProps={{
                      component: 'span',
                      color: 'text.disabled',
                      mt: 0.5,
                    }}
                  />
                </Box> */}
              </Stack>
            </Paper>

            <Paper sx={{ m: 1.5 }}>
              <Stack spacing={2} sx={{ p: 2 }}>
                <Box>
                  <Typography variant="subtitle2" gutterBottom>
                    CMD line
                  </Typography>
                  <Stack spacing={1}>
                    {Object.entries(row.full_data.full_data.cmdline).map(([key, value]) => (
                      <Box key={key} sx={{ display: 'flex', gap: 1 }}>
                        <Typography variant="body2" fontWeight="bold">
                          {key}:
                        </Typography>
                        <Typography variant="body2">{value}</Typography>
                      </Box>
                    ))}
                  </Stack>
                </Box>

                <Box>
                  <Typography variant="subtitle2" gutterBottom>
                    Indicators
                  </Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap">
                    {row.full_data.full_data.mitre_ids.map((mitre_ids) => (
                      <Label key={mitre_ids} variant="soft" color="info">
                        {mitre_ids}
                      </Label>
                    ))}
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
