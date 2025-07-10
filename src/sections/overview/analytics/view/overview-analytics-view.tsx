// OverviewAnalyticsView.tsx
import type { FullLogs } from 'src/types/full-logs';

import { useState } from 'react';

import { Box, Card, Table, TableBody } from '@mui/material';

import { paths } from 'src/routes/paths';

import { useFullLogs } from 'src/service/edr-full-logs';
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

import { OrderTableRow } from '../edr-table-full-logs';
import { EdrTableToolbar } from '../edr-table-full-toolbar';

const TABLE_HEAD = [
  { id: 'id', label: 'Id' },
  { id: 'name', label: 'Qurilma nomi' },
  { id: 'risk_ball', label: 'Risk ballari' },
  { id: 'created_at', label: 'Yaratilgan sana' },
  { id: 'is_active', label: 'Holati' },
  { id: '', width: 88 },
];

export default function OverviewAnalyticsView() {
  const { tableData, page, setPage, count } = useFullLogs();
  const table = useTable({ defaultRowsPerPage: 10, defaultOrderBy: 'id' });
  const [filterName, setFilterName] = useState('');

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
    filterName,
  });
  const notFound = !dataFiltered.length;

  return (
    <DashboardContent maxWidth="xl">
      <CustomBreadcrumbs
        heading="Edr to'liq loglar"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Edr loglar', href: paths.dashboard.general.analytics },
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
                {dataFiltered
                  .slice(
                    table.page * table.rowsPerPage,
                    table.page * table.rowsPerPage + table.rowsPerPage
                  )
                  .map((row) => (
                    <OrderTableRow key={row.id} row={row} />
                  ))}

                <TableEmptyRows
                  height={table.dense ? 56 : 76}
                  emptyRows={emptyRows(table.page, table.rowsPerPage, dataFiltered.length)}
                />
                <TableNoData notFound={notFound} />
              </TableBody>
            </Table>
          </Scrollbar>
        </Box>

        <TablePaginationCustom
          page={page - 1}
          dense={table.dense}
          count={count}
          rowsPerPage={table.rowsPerPage}
          onPageChange={(_, newPage) => setPage(newPage + 1)}
          onRowsPerPageChange={table.onChangeRowsPerPage}
        />
      </Card>
    </DashboardContent>
  );
}

// applyFilter helper
function applyFilter({
  inputData,
  comparator,
  filterName,
}: {
  inputData: FullLogs[];
  comparator: (a: any, b: any) => number;
  filterName: string;
}) {
  const stabilizedThis = inputData
    .map((el, index) => [el, index] as const)
    .sort((a, b) => {
      const order = comparator(a[0], b[0]);
      return order !== 0 ? order : a[1] - b[1];
    });

  let data = stabilizedThis.map((el) => el[0]);
  if (filterName) {
    data = data.filter(
      (log) =>
        log.full_data.toLowerCase().includes(filterName.toLowerCase()) ||
        log.device.name.toLowerCase().includes(filterName.toLowerCase())
    );
  }

  return data;
}
