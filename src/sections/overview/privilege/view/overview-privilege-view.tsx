import type { Privilege } from 'src/types/privilege';

import { useState, useEffect } from 'react';

import { Box, Card, Table, TableBody } from '@mui/material';

import { paths } from 'src/routes/paths';

import { DashboardContent } from 'src/layouts/dashboard';
import { fetchPrivilegeList } from 'src/service/privilege';

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

import { OrderTableRow } from '../privilege-table-logs';
import { EdrTableToolbar } from '../privilege-table-toolbar';

const TABLE_HEAD = [
  { id: 'name', label: 'Name' },
  { id: 'ip_addres', label: 'Ip_addres' },
  { id: 'risk_ball', label: 'Risk ball' },
  { id: 'action_taken', label: 'Action taken' },
  { id: '', width: 88 },
];

export default function OverviewPrivilegeView() {
  const [privilegeLogs, setPrivilegeLogs] = useState<Privilege[]>([]);
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
    const loadPrivilegeLogs = async () => {
      try {
        setLoading(true);
        const data = await fetchPrivilegeList(page);
        setPrivilegeLogs(data.results || []);
        setTotalCount(data.count || 0);
      } catch (error) {
        console.error('Failed to fetch privilege logs:', error);
      } finally {
        setLoading(false);
      }
    };
    loadPrivilegeLogs();
  }, [page]);

  const dataFiltered = applyFilter({
    inputData: privilegeLogs,
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
        heading="Imtiyozlarni oshirish"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Privilege', href: paths.dashboard.general.privilege },
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
  inputData: Privilege[];
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
        log.pid.toLowerCase().includes(filterName.toLowerCase()) ||
        log.device.name.toLowerCase().includes(filterName.toLowerCase()) ||
        log.action_taken.toLowerCase().includes(filterName.toLowerCase())
    );
  }

  return data;
}
