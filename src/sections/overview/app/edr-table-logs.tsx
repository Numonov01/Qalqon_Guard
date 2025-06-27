import type { EdrLogs } from 'src/types/device';

import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Collapse from '@mui/material/Collapse';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';

import { useBoolean } from 'src/hooks/use-boolean';

import { fDateTime } from 'src/utils/format-time';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';

type Props = {
  row: EdrLogs;
};

export function OrderTableRow({ row }: Props) {
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
          <Box component="span">{row.id}</Box>
        </TableCell>

        <TableCell>{row.direction}</TableCell>

        <TableCell>{row.action}</TableCell>

        <TableCell>
          <Label
            variant="soft"
            color={
              (row.log_type === 'WARNING' && 'warning') ||
              (row.log_type === 'ERROR' && 'secondary') ||
              (row.log_type === 'INFO' && 'info') ||
              'default'
            }
          >
            {row.log_type}
          </Label>
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
              {row.device && (
                <Stack
                  key={row.device.id}
                  direction="row"
                  alignItems="center"
                  sx={{
                    p: (theme) => theme.spacing(1.5, 2, 1.5, 1.5),
                    '&:not(:last-of-type)': {
                      borderBottom: (theme) => `solid 2px ${theme.vars.palette.background.neutral}`,
                    },
                  }}
                >
                  <ListItemText
                    primary={row.device.name}
                    secondary={row.device.bios_uuid}
                    primaryTypographyProps={{ typography: 'body2' }}
                    secondaryTypographyProps={{
                      component: 'span',
                      color: 'text.disabled',
                      mt: 0.5,
                    }}
                  />
                  {row.device.ip_addres}
                  <Box sx={{ width: 210, textAlign: 'right' }}>
                    {fDateTime(row.device.created_at)}
                  </Box>
                </Stack>
              )}
            </Paper>

            <Paper sx={{ m: 1.5 }}>
              {row.device && (
                <Stack
                  key={row.device.id}
                  direction="row"
                  alignItems="center"
                  sx={{
                    p: (theme) => theme.spacing(1.5, 2, 1.5, 1.5),
                    '&:not(:last-of-type)': {
                      borderBottom: (theme) => `solid 2px ${theme.vars.palette.background.neutral}`,
                    },
                  }}
                >
                  <ListItemText
                    primary="Full info"
                    secondary={row.full_info}
                    primaryTypographyProps={{ typography: 'body2' }}
                    secondaryTypographyProps={{
                      component: 'span',
                      color: 'text.disabled',
                      mt: 0.5,
                    }}
                  />
                </Stack>
              )}
            </Paper>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}
