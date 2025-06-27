import type { StackDetection } from 'src/types/stack-detect';

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
  row: StackDetection;
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

        <TableCell>{row.event_type}</TableCell>
        <TableCell>
          <Label
            variant="soft"
            color={
              (row.severity === 'low' && 'success') ||
              (row.severity === 'medium' && 'warning') ||
              (row.severity === 'high' && 'error') ||
              'default'
            }
          >
            {row.severity}
          </Label>
        </TableCell>

        <TableCell>
          <ListItemText
            primary={fDate(row.timestamp)}
            secondary={fTime(row.timestamp)}
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
                  primary={row.tactics}
                  secondary={row.technique_descriptions}
                  primaryTypographyProps={{ typography: 'body2' }}
                  secondaryTypographyProps={{
                    component: 'span',
                    color: 'text.disabled',
                    mt: 0.5,
                  }}
                />
                <Box sx={{ flexGrow: 1 }} />
                <Box>{row.risk_assessment}</Box>
                <Box sx={{ width: 210, textAlign: 'right' }}>
                  <ListItemText
                    primary={fDate(row.created_at)}
                    secondary={fTime(row.created_at)}
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
                <Box>
                  <Typography variant="subtitle2" gutterBottom>
                    Mitre attack mapping
                  </Typography>
                  <Stack spacing={1}>
                    {Object.entries(row.mitre_attack_mapping).map(([key, value]) => (
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
                    {row.indicators.map((indicator) => (
                      <Label key={indicator} variant="soft" color="info">
                        {indicator}
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
