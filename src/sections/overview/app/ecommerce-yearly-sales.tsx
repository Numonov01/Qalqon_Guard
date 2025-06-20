import type { CardProps } from '@mui/material/Card';

import { useState, useEffect } from 'react';

import Card from '@mui/material/Card';
import { useTheme } from '@mui/material/styles';
import CardHeader from '@mui/material/CardHeader';

import { fShortenNumber } from 'src/utils/format-number';

import { Chart, useChart } from 'src/components/chart';

type Props = CardProps & {
  title?: string;
  subheader?: string;
};

type LogStatsData = {
  log_stats: {
    WARNING: number;
    ERROR: number;
  };
  timestamp: string;
};

export function LogStatsChart({ title, subheader, ...other }: Props) {
  const theme = useTheme();
  const [logData, setLogData] = useState<LogStatsData[]>([]);

  useEffect(() => {
    const websocket = new WebSocket('ws://192.168.0.173:8000/ws/log-stats/');

    websocket.onmessage = (event) => {
      const data: LogStatsData = JSON.parse(event.data);
      setLogData((prev) => {
        const newData = [...prev, data];
        return newData.slice(-20);
      });
    };

    websocket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    return () => {
      websocket.close();
    };
  }, []);

  const categories = logData.map((item) => new Date(item.timestamp).toLocaleTimeString());

  const series = [
    {
      name: 'WARNING',
      data: logData.map((item) => item.log_stats.WARNING),
    },
    {
      name: 'ERROR',
      data: logData.map((item) => item.log_stats.ERROR),
    },
  ];

  const chartOptions = useChart({
    colors: [theme.palette.primary.main, theme.palette.warning.main, theme.palette.error.main],
    stroke: {
      width: 2,
    },
    xaxis: {
      categories,
      labels: {
        rotate: -45,
      },
    },
    tooltip: {
      y: {
        formatter: (value: number) => fShortenNumber(value),
      },
    },
  });

  return (
    <Card {...other}>
      <CardHeader title={title || 'Log Statistics'} />

      <Chart
        type="line"
        series={series}
        options={chartOptions}
        height={320}
        sx={{ py: 2.5, pl: 1, pr: 2.5 }}
      />
    </Card>
  );
}
