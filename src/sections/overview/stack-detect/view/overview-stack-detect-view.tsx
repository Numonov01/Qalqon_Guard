import type { StackDetection } from 'src/types/stack-detect';

import { useState, useEffect } from 'react';

import { Box, Card, Table, TableBody } from '@mui/material';

import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';
import { fetchStackDetectionList } from 'src/service/stack-detect';

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

import { OrderTableRow } from '../stack-detect-table-logs';
import { EdrTableToolbar } from '../stack-detect-table-toolbar';

const TABLE_HEAD = [
  { id: 'name', label: 'Qurilma' },
  { id: 'event_type', label: 'Event tiplari' },
  { id: 'severity', label: 'Severity' },
  { id: 'timestamp', label: 'Vaqt stampi' },
  { id: '', width: 88 },
];

export default function OverviewStackDetectView() {
  const [stackDetectionLogs, setStackDetectionLogs] = useState<StackDetection[]>([]);
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
    const loadDetectionLogs = async () => {
      try {
        setLoading(true);
        const data = await fetchStackDetectionList(page);
        setStackDetectionLogs(data.results || []);
        setTotalCount(data.count || 0);
      } catch (error) {
        console.error('Failed to fetch stack detection logs:', error);
      } finally {
        setLoading(false);
      }
    };
    loadDetectionLogs();
  }, [page]);

  const dataFiltered = applyFilter({
    inputData: stackDetectionLogs,
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
        heading="Stack faoliyatini aniqlash"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Stack faoliyatini aniqlash', href: paths.dashboard.general.detect },
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
  inputData: StackDetection[];
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
        log.device_info.name.toLowerCase().includes(filterName.toLowerCase()) ||
        log.event_type.toLowerCase().includes(filterName.toLowerCase()) ||
        log.severity.toLowerCase().includes(filterName.toLowerCase())
    );
  }

  return data;
}
