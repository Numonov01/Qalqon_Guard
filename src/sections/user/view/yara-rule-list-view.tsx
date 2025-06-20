import type { YaraRule } from 'src/types/yara-rule';

import { useMemo, useState, useEffect } from 'react';

import { Card } from '@mui/material';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { useBoolean } from 'src/hooks/use-boolean';

import { DashboardContent } from 'src/layouts/dashboard';
import { deleteRule, fetchYaraRuleList } from 'src/service/yara-rule';

import { Iconify } from 'src/components/iconify';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { YaraRuleTable } from '../yara-rule-list-table';

export function YaraRuleListView() {
  const dense = useBoolean(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchQuery, setSearchQuery] = useState('');
  const [rules, setRules] = useState<YaraRule[]>([]);
  const [loading, setLoading] = useState(true);

  const loadRules = async () => {
    try {
      setLoading(true);
      const data = await fetchYaraRuleList();
      setRules(Array.isArray(data) ? data : [data]);
    } catch (error) {
      console.error('Failed to load rules:', error);
      setRules([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRules();
  }, []);

  const filteredRules = useMemo(
    () =>
      rules.filter((rule) => {
        const fullName = `${rule.name} ${rule.file}`.toLowerCase();
        return fullName.includes(searchQuery.toLowerCase());
      }),
    [rules, searchQuery]
  );

  const paginatedRules = useMemo(
    () => filteredRules.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [filteredRules, page, rowsPerPage]
  );

  const handleDeleteRow = async (id: string) => {
    try {
      setLoading(true);
      await deleteRule(Number(id));
      setRules((prev) => prev.filter((rule) => String(rule.id) !== id));
    } catch (error) {
      console.error('Failed to delete rule:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setPage(0);
  };

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Yara rule"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Rule', href: paths.dashboard.user.root },
          { name: 'List' },
        ]}
        action={
          <Button
            component={RouterLink}
            href={paths.dashboard.user.new}
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
          >
            New rule
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
              placeholder="Search rules..."
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

        <YaraRuleTable
          rules={paginatedRules}
          dense={dense.value}
          onDeleteRow={handleDeleteRow}
          page={page}
          rowsPerPage={rowsPerPage}
          count={filteredRules.length}
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
