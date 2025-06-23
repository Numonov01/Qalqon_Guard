import type { Signature } from 'src/types/signature';

import { useMemo, useState, useEffect } from 'react';

import Button from '@mui/material/Button';
import { Card, Stack, TextField, InputAdornment } from '@mui/material';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { useBoolean } from 'src/hooks/use-boolean';

import { DashboardContent } from 'src/layouts/dashboard';
import { deleteSignature, fetchSignatureList } from 'src/service/signature';

import { Iconify } from 'src/components/iconify';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { SignatureTable } from '../signature-list-table';

export function SignatureListView() {
  const dense = useBoolean(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchQuery, setSearchQuery] = useState('');
  const [signatures, setSignatures] = useState<Signature[]>([]);
  const [loading, setLoading] = useState(true);

  const loadSignatures = async () => {
    try {
      setLoading(true);
      const data = await fetchSignatureList();
      setSignatures(Array.isArray(data) ? data : [data]);
    } catch (error) {
      console.error('Failed to load signatures:', error);
      setSignatures([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSignatures();
  }, []);

  const filteredSignatures = useMemo(
    () =>
      signatures.filter((signature) => {
        const searchString =
          `${signature.title} ${signature.file_type} ${signature.sha256} ${signature.md5}`.toLowerCase();
        return searchString.includes(searchQuery.toLowerCase());
      }),
    [signatures, searchQuery]
  );

  const paginatedSignatures = useMemo(
    () => filteredSignatures.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [filteredSignatures, page, rowsPerPage]
  );

  const handleDeleteRow = async (id: string) => {
    try {
      setLoading(true);
      await deleteSignature(Number(id));
      await loadSignatures(); // Refresh the list after deletion
    } catch (error) {
      console.error('Failed to delete signature:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setPage(0);
  };

  return (
    <DashboardContent maxWidth="xl">
      <CustomBreadcrumbs
        heading="Signatures"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Signatures', href: paths.dashboard.signature.root },
          { name: 'List' },
        ]}
        action={
          <Button
            component={RouterLink}
            href={paths.dashboard.signature.new}
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
          >
            New Signature
          </Button>
        }
        sx={{ mb: { xs: 3, md: 5 } }}
      />
      <Card>
        <Stack spacing={2} sx={{ p: 3 }}>
          <Stack direction="row" spacing={2} alignItems="center">
            <TextField
              fullWidth
              size="small"
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Search signatures..."
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Iconify icon="eva:search-fill" />
                  </InputAdornment>
                ),
              }}
              sx={{ maxWidth: 450 }}
            />
          </Stack>
        </Stack>

        <SignatureTable
          signatures={paginatedSignatures}
          dense={dense.value}
          onDeleteRow={handleDeleteRow}
          page={page}
          rowsPerPage={rowsPerPage}
          count={filteredSignatures.length}
          onPageChange={(newPage) => setPage(newPage)}
          onRowsPerPageChange={(newRowsPerPage) => {
            setRowsPerPage(newRowsPerPage);
            setPage(0);
          }}
          loading={loading}
        />
      </Card>
    </DashboardContent>
  );
}
