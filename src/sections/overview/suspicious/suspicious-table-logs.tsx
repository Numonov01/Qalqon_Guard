import type { Suspicious } from 'src/types/suspicious';

import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import { Tooltip } from '@mui/material';
import Collapse from '@mui/material/Collapse';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';

import { useBoolean } from 'src/hooks/use-boolean';

import { fTime, fDate } from 'src/utils/format-time';

import { Iconify } from 'src/components/iconify';

type Props = {
  row: Suspicious;
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

        <TableCell
          sx={{
            maxWidth: 300,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          <Tooltip title={row.file_name}>
            <span>{row.file_name}</span>
          </Tooltip>
        </TableCell>
        <TableCell>{row.risk_score}</TableCell>

        {/* <TableCell>
          <Label
            variant="soft"
            color={
              (row.is_quarantined === true && 'success') ||
              (row.is_quarantined === false && 'error') ||
              'default'
            }
          >
            {row.is_quarantined ? 'Yes' : 'No'}
          </Label>
        </TableCell> */}

        <TableCell>
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
                  primary={row.file_path}
                  secondary={row.t}
                  primaryTypographyProps={{ typography: 'body2' }}
                  secondaryTypographyProps={{
                    component: 'span',
                    color: 'text.disabled',
                    mt: 0.5,
                  }}
                />
                <Box sx={{ width: 210, textAlign: 'right' }}>
                  <ListItemText
                    primary={fDate(row.detected_time)}
                    secondary={fTime(row.detected_time)}
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
              <Stack direction="row" alignItems="center" sx={{ p: 2 }}>
                <ListItemText
                  primary="Reason"
                  secondary={row.reason}
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
