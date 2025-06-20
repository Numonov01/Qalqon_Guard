import type { EdrLogs } from 'src/types/device';

import { useState } from 'react';

import { Box, Card, Table, TableBody } from '@mui/material';

import { useEdrLogs } from 'src/service/edr-logs';
import { DashboardContent } from 'src/layouts/dashboard';

import { Scrollbar } from 'src/components/scrollbar';
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
  { id: 'direction', label: 'Direction' },
  { id: 'action', label: 'Action' },
  { id: 'log_type', label: 'Log type' },
  { id: '', width: 88 },
];

export default function OverviewFileView() {
  const { tableData } = useEdrLogs();

  const table = useTable({ defaultOrderBy: 'orderNumber' });
  const [filterName, setFilterName] = useState('');

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
    filterName,
  });

  const notFound = !dataFiltered.length;

  return (
    <DashboardContent maxWidth="xl">
      <Card sx={{ mt: 3 }}>
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
                  height={table.dense ? 56 : 56 + 20}
                  emptyRows={emptyRows(table.page, table.rowsPerPage, dataFiltered.length)}
                />

                <TableNoData notFound={notFound} />
              </TableBody>
            </Table>
          </Scrollbar>
        </Box>

        <TablePaginationCustom
          page={table.page}
          dense={table.dense}
          count={dataFiltered.length}
          rowsPerPage={table.rowsPerPage}
          onPageChange={table.onChangePage}
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
      (order) =>
        order.action.toLowerCase().includes(filterName.toLowerCase()) ||
        order.direction.toLowerCase().includes(filterName.toLowerCase()) ||
        (order.device?.name.toLowerCase().includes(filterName.toLowerCase()) ?? false)
    );
  }

  return data;
}
