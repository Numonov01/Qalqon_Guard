import type { EdrLogs } from 'src/types/device';

import React from 'react';

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

  return (
    <>
      <TableRow hover>
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
              'default'
            }
          >
            {row.log_type}
          </Label>
        </TableCell>

        <TableCell align="right" sx={{ px: 1, whiteSpace: 'nowrap' }}>
          <IconButton
            color={collapse.value ? 'inherit' : 'default'}
            onClick={collapse.onToggle}
            sx={{ ...(collapse.value && { bgcolor: 'action.hover' }) }}
          >
            <Iconify icon="eva:arrow-ios-downward-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      <TableRow>
        <TableCell sx={{ p: 0, border: 'none' }} colSpan={6}>
          <Collapse in={collapse.value} timeout="auto" unmountOnExit>
            <Paper sx={{ m: 1.5 }}>
              {row.device && (
                <Stack direction="row" alignItems="center" spacing={2} sx={{ p: 2 }}>
                  <ListItemText
                    primary={row.device.name || 'N/A'}
                    secondary={row.device.bios_uuid || 'N/A'}
                    primaryTypographyProps={{ typography: 'body2' }}
                    secondaryTypographyProps={{
                      component: 'span',
                      color: 'text.disabled',
                      mt: 0.5,
                    }}
                  />
                  <Box sx={{ flexGrow: 1 }} />
                  <Box>{row.device.ip_addres || 'N/A'}</Box>
                  <Box sx={{ width: 210, textAlign: 'right' }}>
                    {row.device.created_at ? fDateTime(row.device.created_at) : 'N/A'}
                  </Box>
                </Stack>
              )}
            </Paper>

            <Paper sx={{ m: 1.5 }}>
              <Stack direction="row" alignItems="center" sx={{ p: 2 }}>
                <ListItemText
                  primary="Full info"
                  secondary={row.full_info || 'No additional information'}
                  primaryTypographyProps={{ typography: 'body2' }}
                  secondaryTypographyProps={{
                    component: 'span',
                    color: 'text.disabled',
                    mt: 0.5,
                  }}
                />
              </Stack>
            </Paper>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}
