import type { EdrLogs } from 'src/types/device';

import { useMemo, useState } from 'react';

import { useTheme } from '@mui/material/styles';
import {
  Box,
  Card,
  Grid,
  Stack,
  Table,
  Select,
  MenuItem,
  TextField,
  TableBody,
  InputLabel,
  FormControl,
  InputAdornment,
} from '@mui/material';

import { useBoolean } from 'src/hooks/use-boolean';

import { useEdrLogs } from 'src/service/edr-logs';
import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';
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

import { AppTopAuthors } from '../edr-info';
import { OrderTableRow } from '../edr-table-logs';
import { UserTable } from '../overview-device-table';
import { EdrTableToolbar } from '../edr-table-toolbar';
import { AppWidgetSummary } from '../app-widget-summary';
import { LogStatsChart } from '../ecommerce-yearly-sales';

const TABLE_HEAD = [
  { id: 'id', label: 'Id' },
  { id: 'direction', label: 'Direction' },
  { id: 'action', label: 'Action' },
  { id: 'log_type', label: 'Log type' },
  { id: '', width: 88 },
];

export default function OverviewAppView() {
  const dense = useBoolean(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchQuery, setSearchQuery] = useState('');
  const [deviceFilter, setDeviceFilter] = useState('all');
  const { tableData, devices } = useEdrLogs();

  const table = useTable({ defaultOrderBy: 'orderNumber' });
  const [filterName, setFilterName] = useState('');

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
    filterName,
  });

  const notFound = !dataFiltered.length;

  const availableDevice = useMemo(() => {
    const deviceSet = new Set(devices.map((d) => d.name));
    return Array.from(deviceSet).sort();
  }, [devices]);

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setPage(0);
  };

  const handleDeviceFilterChange = (device: string) => {
    setDeviceFilter(device);
    setPage(0);
  };

  const theme = useTheme();
  return (
    <DashboardContent maxWidth="xl">
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <AppWidgetSummary
            title="All"
            percent={-2.6}
            total={tableData.length}
            chart={{
              colors: [theme.vars.palette.info.dark],
              categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
              series: [15, 12, 12, 51, 28, 11, 79, 37],
            }}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <AppWidgetSummary
            title="Low"
            percent={2.6}
            total={tableData.filter((log) => log.log_type === 'INFO').length}
            chart={{
              categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
              series: [15, 18, 12, 51, 68, 11, 39, 37],
            }}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <AppWidgetSummary
            title="Medium"
            percent={0.2}
            total={tableData.filter((log) => log.log_type === 'WARNING').length}
            chart={{
              colors: [theme.vars.palette.info.main],
              categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
              series: [20, 41, 63, 33, 28, 35, 50, 46],
            }}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <AppWidgetSummary
            title="High"
            percent={-0.1}
            total={tableData.filter((log) => log.log_type === 'ERROR').length}
            chart={{
              colors: [theme.vars.palette.error.main],
              categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
              series: [18, 19, 31, 8, 16, 37, 12, 33],
            }}
          />
        </Grid>
      </Grid>

      <Card sx={{ mb: 3 }}>
        <Stack spacing={2} sx={{ px: 2, mt: 3, mb: 2 }}>
          <Stack direction="row" spacing={2} alignItems="center">
            <FormControl size="small" sx={{ minWidth: 280 }}>
              <InputLabel>Pc</InputLabel>
              <Select
                value={deviceFilter}
                onChange={(e) => handleDeviceFilterChange(e.target.value as string)}
                label="Device"
              >
                <MenuItem value="all">All Pc</MenuItem>
                {availableDevice.map((device) => (
                  <MenuItem key={device} value={device}>
                    {device}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              fullWidth
              size="small"
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Search devices..."
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

        <UserTable
          dense={dense.value}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={(newPage) => setPage(newPage)}
          onRowsPerPageChange={(newRowsPerPage) => {
            setRowsPerPage(newRowsPerPage);
            setPage(0);
          }}
        />
      </Card>

      <Grid xs={12} md={6} lg={4}>
        <AppTopAuthors title="Edr info" />
      </Grid>

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

      <Grid container spacing={2} sx={{ mt: 3 }}>
        <Grid item xs={12} md={12} lg={12}>
          <LogStatsChart title="Real-time Edr Logs" />
        </Grid>
      </Grid>
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
