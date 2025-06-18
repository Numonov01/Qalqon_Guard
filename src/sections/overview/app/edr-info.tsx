import type { EdrInfo } from 'src/types/device';
import type { BoxProps } from '@mui/material/Box';
import type { CardProps } from '@mui/material/Card';

import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Avatar from '@mui/material/Avatar';
import { CircularProgress } from '@mui/material';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';

import { varAlpha } from 'src/theme/styles';
import { fetchEdrInfo } from 'src/service/devices';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

type Props = CardProps & {
  title?: string;
  subheader?: string;
};

type EdrStatItem = {
  id: string;
  name: string;
  value: number;
  icon: string;
  color: 'primary' | 'info' | 'success' | 'warning' | 'error';
};

export function AppTopAuthors({ title, subheader, ...other }: Props) {
  const [edrInfo, setEdrInfo] = useState<EdrInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadEdrInfo = async () => {
      try {
        const data = await fetchEdrInfo();
        setEdrInfo(data);
      } catch (error) {
        console.error('Failed to load EDR info:', error);
      } finally {
        setLoading(false);
      }
    };

    loadEdrInfo();
  }, []);

  if (loading) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!edrInfo) {
    return <div>Failed to load EDR statistics</div>;
  }

  const edrStats: EdrStatItem[] = [
    {
      id: 'signatures',
      name: 'Signatures',
      value: edrInfo.signatures_count,
      icon: 'solar:shield-check-bold',
      color: 'warning',
    },
    {
      id: 'yara',
      name: 'Yara rules',
      value: edrInfo.yara_rules_count,
      icon: 'solar:shield-check-bold',
      color: 'info',
    },
    {
      id: 'devices',
      name: 'Devices',
      value: edrInfo.devices_count,
      icon: 'solar:shield-check-bold',
      color: 'success',
    },
  ];

  return (
    <Card {...other}>
      <CardHeader title={title} subheader={subheader} />

      <Box
        sx={{
          p: 3,
          gap: 3,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {edrStats.map((item) => (
          <EdrStatItemRow key={item.id} item={item} />
        ))}
      </Box>
    </Card>
  );
}

// ----------------------------------------------------------------------

type EdrStatItemProps = BoxProps & {
  item: EdrStatItem;
};

function EdrStatItemRow({ item, sx, ...other }: EdrStatItemProps) {
  return (
    <Box
      sx={{
        gap: 2,
        display: 'flex',
        alignItems: 'center',
        ...sx,
      }}
      {...other}
    >
      <Avatar
        sx={{
          color: `${item.color}.main`,
          bgcolor: (theme) => varAlpha(theme.vars.palette[item.color].mainChannel, 0.08),
        }}
      >
        <Iconify icon={item.icon} width={24} />
      </Avatar>

      <Box flexGrow={1}>
        <Typography variant="subtitle2" noWrap>
          {item.name}
        </Typography>
      </Box>

      <Typography
        variant="subtitle1"
        sx={{
          px: 1.5,
          py: 0.5,
          borderRadius: 1,
          color: `${item.color}.main`,
          bgcolor: (theme) => varAlpha(theme.vars.palette[item.color].mainChannel, 0.08),
        }}
      >
        {item.value}
      </Typography>
    </Box>
  );
}
