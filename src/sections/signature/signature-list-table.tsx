import type { Signature } from 'src/types/signature';

import React from 'react';

import Table from '@mui/material/Table';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import { ListItemText } from '@mui/material';
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

import { fDate, fTime } from 'src/utils/format-time';

import { Iconify } from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { usePopover, CustomPopover } from 'src/components/custom-popover';

interface SignatureTableProps {
  signatures: Signature[];
  dense?: boolean;
  onDeleteRow: (id: string) => void;
  page: number;
  rowsPerPage: number;
  count: number;
  onPageChange: (newPage: number) => void;
  onRowsPerPageChange: (newRowsPerPage: number) => void;
  loading?: boolean;
}

export function SignatureTable({
  signatures,
  dense = false,
  onDeleteRow,
  page,
  rowsPerPage,
  count,
  onPageChange,
  onRowsPerPageChange,
  loading = false,
}: SignatureTableProps) {
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
              <TableCell>Title</TableCell>
              <TableCell>File type</TableCell>
              <TableCell>Sha256</TableCell>
              <TableCell>Md5</TableCell>
              <TableCell>Create date</TableCell>
              <TableCell>Update date</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {signatures.map((signature) => (
              <TableRow key={signature.id} hover>
                <TableCell
                  sx={{
                    maxWidth: 200,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  <Tooltip title={signature.title}>
                    <span>{signature.title}</span>
                  </Tooltip>
                </TableCell>
                <TableCell
                  sx={{
                    maxWidth: 200,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  <Tooltip title={signature.file_type}>
                    <span>{signature.file_type}</span>
                  </Tooltip>
                </TableCell>

                <TableCell
                  sx={{
                    maxWidth: 200,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  <Tooltip title={signature.sha256}>
                    <span>{signature.sha256}</span>
                  </Tooltip>
                </TableCell>

                <TableCell
                  sx={{
                    maxWidth: 200,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  <Tooltip title={signature.md5}>
                    <span>{signature.md5}</span>
                  </Tooltip>
                </TableCell>
                <TableCell>
                  <ListItemText
                    primary={fDate(signature.created_at)}
                    secondary={fTime(signature.created_at)}
                    primaryTypographyProps={{ typography: 'body2' }}
                    secondaryTypographyProps={{
                      component: 'span',
                      color: 'text.disabled',
                      mt: 0.5,
                    }}
                  />
                </TableCell>
                <TableCell>
                  <ListItemText
                    primary={fDate(signature.updated_at)}
                    secondary={fTime(signature.updated_at)}
                    primaryTypographyProps={{ typography: 'body2' }}
                    secondaryTypographyProps={{
                      component: 'span',
                      color: 'text.disabled',
                      mt: 0.5,
                    }}
                  />
                </TableCell>

                <TableCell align="right">
                  <Stack direction="row" spacing={1} justifyContent="flex-end">
                    <Tooltip title="Edit" placement="top" arrow>
                      <IconButton
                        component={RouterLink}
                        href={paths.dashboard.signature.edit(String(signature.id))}
                        color="default"
                      >
                        <Iconify icon="solar:pen-bold" />
                      </IconButton>
                    </Tooltip>

                    <IconButton
                      color={
                        popover.open && selectedId === String(signature.id) ? 'inherit' : 'default'
                      }
                      onClick={(e) => {
                        popover.onOpen(e);
                        setSelectedId(String(signature.id));
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
            href={selectedId ? paths.dashboard.signature.edit(selectedId) : '#'}
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
