import type { YaraRule } from 'src/types/yara-rule';

import React from 'react';

import Table from '@mui/material/Table';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import IconButton from '@mui/material/IconButton';
import TableContainer from '@mui/material/TableContainer';
import LinearProgress from '@mui/material/LinearProgress';
import TablePagination from '@mui/material/TablePagination';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { useBoolean } from 'src/hooks/use-boolean';

import { Iconify } from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { usePopover, CustomPopover } from 'src/components/custom-popover';

interface YaraRuleTableProps {
  rules: YaraRule[];
  dense?: boolean;
  onDeleteRow: (id: string) => void;
  page: number;
  rowsPerPage: number;
  count: number;
  onPageChange: (newPage: number) => void;
  onRowsPerPageChange: (newRowsPerPage: number) => void;
  loading?: boolean;
}

export function YaraRuleTable({
  rules,
  dense = false,
  onDeleteRow,
  page,
  rowsPerPage,
  count,
  onPageChange,
  onRowsPerPageChange,
  loading = false,
}: YaraRuleTableProps) {
  const confirm = useBoolean();
  const popover = usePopover();
  const [selectedId, setSelectedId] = React.useState<string | null>(null);

  const handleOpenConfirm = (id: string) => {
    setSelectedId(id);
    confirm.onTrue();
    popover.onClose();
  };

  const handleDeleteRow = () => {
    if (selectedId) {
      onDeleteRow(selectedId);
      confirm.onFalse();
    }
  };

  return (
    <>
      <TableContainer component={Paper} sx={{ borderRadius: 0 }}>
        {loading && <LinearProgress />}
        <Table size={dense ? 'small' : 'medium'}>
          <TableHead>
            <TableRow>
              <TableCell>Id</TableCell>
              <TableCell sx={{ px: 10 }}>Name</TableCell>
              <TableCell>File</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rules.map((rule) => (
              <TableRow key={rule.id} hover>
                <TableCell>{rule.id}</TableCell>
                <TableCell sx={{ px: 10 }}>{rule.name}</TableCell>
                <TableCell>
                  <a
                    href={rule.file}
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      textDecoration: 'none',
                      color: 'inherit',
                    }}
                  >
                    <Stack direction="row" spacing={1} alignItems="center">
                      <span>{rule.file}</span>
                      <Tooltip title="Download file" arrow>
                        <IconButton>
                          <Iconify icon="mdi:download" />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </a>
                </TableCell>

                <TableCell align="right">
                  <Stack direction="row" spacing={1} justifyContent="flex-end">
                    <Tooltip title="Edit" placement="top" arrow>
                      <IconButton
                        component={RouterLink}
                        href={paths.dashboard.user.edit(String(rule.id))}
                        color="default"
                      >
                        <Iconify icon="solar:pen-bold" />
                      </IconButton>
                    </Tooltip>

                    <IconButton
                      color={popover.open && selectedId === String(rule.id) ? 'inherit' : 'default'}
                      onClick={(e) => {
                        popover.onOpen(e);
                        setSelectedId(String(rule.id));
                      }}
                    >
                      <Iconify icon="eva:more-vertical-fill" />
                    </IconButton>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={count}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={(event, newPage) => onPageChange(newPage)}
        onRowsPerPageChange={(event) => onRowsPerPageChange(parseInt(event.target.value, 10))}
      />

      <CustomPopover
        open={popover.open}
        anchorEl={popover.anchorEl}
        onClose={popover.onClose}
        sx={{ width: 140 }}
      >
        <Stack spacing={0.5}>
          <Button
            fullWidth
            color="inherit"
            component={RouterLink}
            href={selectedId ? paths.dashboard.user.edit(selectedId) : '#'}
            startIcon={<Iconify icon="solar:pen-bold" />}
            sx={{ justifyContent: 'flex-start' }}
          >
            Edit
          </Button>

          <Button
            fullWidth
            color="error"
            startIcon={<Iconify icon="solar:trash-bin-trash-bold" />}
            onClick={() => selectedId && handleOpenConfirm(selectedId)}
            sx={{ justifyContent: 'flex-start' }}
          >
            Delete
          </Button>
        </Stack>
      </CustomPopover>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content="Are you sure want to delete?"
        action={
          <Button variant="contained" color="error" onClick={handleDeleteRow}>
            Delete
          </Button>
        }
      />
    </>
  );
}
