import type { DriverLoad } from 'src/types/driver-load';

import { useState, useEffect } from 'react';

import { Box, Card, Table, TableBody } from '@mui/material';

import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';
import { fetchDriverLoadList } from 'src/service/driver-load';

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

import { DriverLoadTableRow } from '../driver-load-table-logs';
import { DriverLoadTableToolbar } from '../driver-load-table-toolbar';

const TABLE_HEAD = [
  { id: 'name', label: 'Device' },
  { id: 'bios_uuid', label: 'Bios uuid' },
  { id: 'ip_address', label: 'Ip manzili' },
  { id: 'created_at', label: 'Yaratilgan sana' },
  { id: '', width: 88 },
];

export default function OverviewDriverLoadView() {
  const [driverLoadLogs, setDriverLoadLogs] = useState<DriverLoad[]>([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [rowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');

  const table = useTable({
    defaultOrderBy: 'orderNumber',
    defaultRowsPerPage: 10,
  });

  useEffect(() => {
    const loadDriverLoadLogs = async () => {
      try {
        setLoading(true);
        const data = await fetchDriverLoadList(page, searchQuery);
        setDriverLoadLogs(data.results || []);
        setTotalCount(data.count || 0);
      } catch (error) {
        console.error('Failed to fetch suspicious logs:', error);
      } finally {
        setLoading(false);
      }
    };
    loadDriverLoadLogs();
  }, [page, searchQuery]);

  const dataFiltered = applyFilter({
    inputData: driverLoadLogs,
    comparator: getComparator(table.order, table.orderBy),
    filterName: '',
  });

  const notFound = !dataFiltered.length && !loading;

  const handlePageChange = (_: unknown, newPage: number) => {
    setPage(newPage + 1);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setPage(1);
  };

  return (
    <DashboardContent maxWidth="xl">
      <CustomBreadcrumbs
        heading="Drayverni yuklash"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Drayverni yuklash', href: paths.dashboard.general.suspicious },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <Card>
        <DriverLoadTableToolbar
          filterName={searchQuery}
          onFilterName={(e) => handleSearch(e.target.value)}
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
                  <DriverLoadTableRow key={row.id} row={row} />
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
}: {
  inputData: DriverLoad[];
  comparator: (a: any, b: any) => number;
  filterName: string;
}) {
  const stabilizedThis = inputData.map((el, index) => [el, index] as const);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  return stabilizedThis.map((el) => el[0]);
}
