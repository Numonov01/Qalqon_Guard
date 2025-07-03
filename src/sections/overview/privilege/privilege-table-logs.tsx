import type { Privilege } from 'src/types/privilege';

import React from 'react';

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
  row: Privilege;
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
        </TableCell>

        <TableCell>{row.device.ip_addres}</TableCell>
        <TableCell>{row.device.risk_ball}</TableCell>

        <TableCell>{row.action_taken}</TableCell>

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
                <Stack direction="row" alignItems="center" spacing={2} sx={{ p: 2 }}>
                  <ListItemText
                    primary={row.commandline}
                    secondary={row.parent}
                    primaryTypographyProps={{ typography: 'body2' }}
                    secondaryTypographyProps={{
                      component: 'span',
                      color: 'text.disabled',
                      mt: 0.5,
                    }}
                  />
                  <Box sx={{ flexGrow: 1 }} />
                  <Box sx={{ width: 210, textAlign: 'center' }}>{row.pid}</Box>
                  <Box>{row.detected}</Box>
                  <Box sx={{ width: 210, textAlign: 'right' }}>
                    <ListItemText
                      primary={fDate(row.time)}
                      secondary={fTime(row.time)}
                      primaryTypographyProps={{ typography: 'body2' }}
                      secondaryTypographyProps={{
                        component: 'span',
                        color: 'text.disabled',
                        mt: 0.5,
                      }}
                    />
                  </Box>
                </Stack>
              )}
            </Paper>

            <Paper sx={{ m: 1.5 }}>
              <Stack direction="row" alignItems="center" sx={{ p: 2 }}>
                <Box>
                  <Typography variant="subtitle2" gutterBottom>
                    Privileges
                  </Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap">
                    {row.privileges.map((privileges) => (
                      <Label key={privileges} variant="soft" color="info">
                        {privileges}
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
