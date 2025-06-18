import type { Device } from 'src/types/device';

import { useMemo, useState } from 'react';

import { useTheme } from '@mui/material/styles';
import {
  Card,
  Grid,
  Stack,
  Select,
  MenuItem,
  TextField,
  InputLabel,
  FormControl,
  InputAdornment,
} from '@mui/material';

import { useBoolean } from 'src/hooks/use-boolean';

import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';

import { AppTopAuthors } from '../edr-info';
import { UserTable } from '../overview-device-table';
import { AppWidgetSummary } from '../app-widget-summary';
import { EcommerceYearlySales } from '../ecommerce-yearly-sales';
import { AnalyticsCurrentVisits } from '../analytics-current-visits';

// ----------------------------------------------------------------------

export default function OverviewAppView() {
  const dense = useBoolean(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchQuery, setSearchQuery] = useState('');
  const [deviceFilter, setDeviceFilter] = useState('all');
  const [devices] = useState<Device[]>([]);

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
            total={24765}
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
            total={18765}
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
            total={4876}
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
            total={678}
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

      <Grid container spacing={2} sx={{ mt: 3 }}>
        <Grid item xs={12} md={6} lg={4}>
          <AnalyticsCurrentVisits
            title="Current visits"
            chart={{
              series: [
                { label: 'sardor', value: 3500 },
                { label: 'msi', value: 2500 },
                { label: 'pc', value: 1500 },
                { label: 'HP', value: 500 },
              ],
            }}
          />
        </Grid>

        <Grid item xs={12} md={6} lg={8}>
          <EcommerceYearlySales
            title="Yearly sales"
            subheader="(+43%) than last year"
            chart={{
              categories: [
                'Jan',
                'Feb',
                'Mar',
                'Apr',
                'May',
                'Jun',
                'Jul',
                'Aug',
                'Sep',
                'Oct',
                'Nov',
                'Dec',
              ],
              series: [
                {
                  name: '2022',
                  data: [
                    {
                      name: 'Total income',
                      data: [10, 41, 35, 51, 49, 62, 69, 91, 148, 35, 51, 49],
                    },
                    {
                      name: 'Total expenses',
                      data: [10, 34, 13, 56, 77, 88, 99, 77, 45, 13, 56, 77],
                    },
                  ],
                },
                {
                  name: '2023',
                  data: [
                    {
                      name: 'Total income',
                      data: [51, 35, 41, 10, 91, 69, 62, 148, 91, 69, 62, 49],
                    },
                    {
                      name: 'Total expenses',
                      data: [56, 13, 34, 10, 77, 99, 88, 45, 77, 99, 88, 77],
                    },
                  ],
                },
              ],
            }}
          />
        </Grid>
      </Grid>
    </DashboardContent>
  );
}
