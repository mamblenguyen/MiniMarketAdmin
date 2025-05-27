'use client';

import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Stack from '@mui/material/Stack';
import { useTheme } from '@mui/material/styles';
import type { SxProps } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import type { Icon } from '@phosphor-icons/react/dist/lib/types';
import { Desktop as DesktopIcon } from '@phosphor-icons/react/dist/ssr/Desktop';
import { DeviceTablet as DeviceTabletIcon } from '@phosphor-icons/react/dist/ssr/DeviceTablet';
import { Phone as PhoneIcon } from '@phosphor-icons/react/dist/ssr/Phone';
import type { ApexOptions } from 'apexcharts';

import { Chart } from '@/components/core/chart';

const iconMapping = {
  Desktop: DesktopIcon,
  Tablet: DeviceTabletIcon,
  Phone: PhoneIcon
} as Record<string, Icon>;

export interface TrafficProps {
  chartSeries: number[];
  labels: string[];
  colors?: string[];
  sx?: SxProps;
}

export function Traffic({ chartSeries, labels, colors, sx }: TrafficProps): React.JSX.Element {
  const chartOptions = useChartOptions(labels, colors);

  return (
    <Card sx={sx}>
      <CardHeader title="Trạng thái đơn hàng" />
      <CardContent>
        <Stack spacing={2}>
          <Chart height={300} options={chartOptions} series={chartSeries} type="donut" width="100%" />

          <Stack
            direction="row"
            spacing={3}
            sx={{
              alignItems: 'center',
              justifyContent: 'center',
              flexWrap: 'wrap',
              mt: 2
            }}
          >
            {chartSeries.map((item, index) => {
              const label = labels[index];
              const Icon = iconMapping[label];
              const color = colors ? colors[index] : undefined;

              return (
                <Stack
                  key={label}
                  direction="row"
                  spacing={1}
                  sx={{
                    alignItems: 'center',
                    color: color ?? 'inherit',
                    minWidth: 130,
                    cursor: 'default',
                    userSelect: 'none'
                  }}
                >
                  {/* {Icon ? <Icon fontSize="var(--icon-fontSize-lg)" style={{ color }} /> : null} */}
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color }}>
                    {label}
                  </Typography>
                  {/* <Typography color="text.secondary" variant="body2" sx={{ minWidth: 35, textAlign: 'right' }}>
                    {item}%
                  </Typography> */}
                </Stack>
              );
            })}
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}

function useChartOptions(labels: string[], colors?: string[]): ApexOptions {
  const theme = useTheme();

  return {
    chart: { background: 'transparent' },
    colors: colors || [theme.palette.primary.main, theme.palette.success.main, theme.palette.warning.main],
    dataLabels: { enabled: false },
    labels,
    legend: { show: false },
    plotOptions: { pie: { expandOnClick: false } },
    states: { active: { filter: { type: 'none' } }, hover: { filter: { type: 'none' } } },
    stroke: { width: 0 },
    theme: { mode: theme.palette.mode },
    tooltip: { fillSeriesColor: false }
  };
}
