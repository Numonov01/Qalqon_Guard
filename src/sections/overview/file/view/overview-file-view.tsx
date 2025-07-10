// src/sections/overview/file/view/overview-file-view.tsx
import type { EdrLogs } from 'src/types/device';

import { useState, useEffect } from 'react';

import { Box, Card, Table, TableBody } from '@mui/material';

import { paths } from 'src/routes/paths';

import { fetchEdrLogsList } from 'src/service/devices';
import { DashboardContent } from 'src/layouts/dashboard';

import { Scrollbar } from 'src/components/scrollbar';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import {
  useTable,
  emptyRows,
  TableNoData,
  getComparator,
  TableEmptyRows,
  TableHeadCustom,
  TablePaginationCustom,
} from 'src/components/table';

import { OrderTableRow } from '../edr-table-logs';
import { EdrTableToolbar } from '../edr-table-toolbar';

const TABLE_HEAD = [
  { id: 'id', label: 'Id' },
  { id: 'direction', label: 'Joylashuvi' },
  { id: 'action', label: 'Action' },
  { id: 'log_type', label: 'Log tiplari' },
  { id: '', width: 88 },
];

export default function OverviewFileView() {
  const [edrLogs, setEdrLogs] = useState<EdrLogs[]>([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [rowsPerPage] = useState(10);

  const table = useTable({
    defaultOrderBy: 'orderNumber',
    defaultRowsPerPage: 10,
  });

  const [filterName, setFilterName] = useState('');

  useEffect(() => {
    const loadEdrLogs = async () => {
      try {
        setLoading(true);
        const data = await fetchEdrLogsList(page);
        setEdrLogs(data.results || []);
        setTotalCount(data.count || 0);
      } catch (error) {
        console.error('Failed to fetch edr logs:', error);
      } finally {
        setLoading(false);
      }
    };
    loadEdrLogs();
  }, [page]);

  const dataFiltered = applyFilter({
    inputData: edrLogs,
    comparator: getComparator(table.order, table.orderBy),
    filterName,
  });

  const notFound = !dataFiltered.length && !loading;

  const handlePageChange = (_: unknown, newPage: number) => {
    setPage(newPage + 1);
  };

  return (
    <DashboardContent maxWidth="xl">
      <CustomBreadcrumbs
        heading="Edr loglar"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Edr loglar', href: paths.dashboard.general.file },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />
      <Card>
        <EdrTableToolbar
          filterName={filterName}
          onFilterName={(e) => setFilterName(e.target.value)}
        />

        <Box sx={{ position: 'relative' }}>
          <Scrollbar sx={{ minHeight: 444 }}>
            <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
              <TableHeadCustom
                order={table.order}
                orderBy={table.orderBy}
                headLabel={TABLE_HEAD}
                rowCount={dataFiltered.length}
                onSort={table.onSort}
              />

              <TableBody>
                {dataFiltered.map((row) => (
                  <OrderTableRow key={row.id} row={row} />
                ))}

                <TableEmptyRows
                  height={table.dense ? 56 : 56 + 20}
                  emptyRows={emptyRows(table.page, table.rowsPerPage, dataFiltered.length)}
                />

                {notFound && <TableNoData notFound={notFound} />}
              </TableBody>
            </Table>
          </Scrollbar>
        </Box>

        <TablePaginationCustom
          page={page - 1}
          dense={table.dense}
          count={totalCount}
          rowsPerPage={rowsPerPage}
          onPageChange={handlePageChange}
          onRowsPerPageChange={table.onChangeRowsPerPage}
        />
      </Card>
    </DashboardContent>
  );
}

function applyFilter({
  inputData,
  comparator,
  filterName,
}: {
  inputData: EdrLogs[];
  comparator: (a: any, b: any) => number;
  filterName: string;
}) {
  const stabilizedThis = inputData.map((el, index) => [el, index] as const);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  let data = stabilizedThis.map((el) => el[0]);

  if (filterName) {
    data = data.filter(
      (log) =>
        log.action.toLowerCase().includes(filterName.toLowerCase()) ||
        log.full_info.toLowerCase().includes(filterName.toLowerCase()) ||
        log.device?.name?.toLowerCase().includes(filterName.toLowerCase())
    );
  }

  return data;
}
