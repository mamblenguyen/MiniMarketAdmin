import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import LinearProgress from '@mui/material/LinearProgress';
import Stack from '@mui/material/Stack';
import type { SxProps } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { ListBullets as ListBulletsIcon } from '@phosphor-icons/react/dist/ssr/ListBullets';

export interface TasksProgressProps {
  sx?: SxProps;
  value: number;
  totalOrders: number;
  purchedOrders: number;
   totalRevenue: number;
  purchedRevenue: number;
}

export function TasksProgress({ value, sx, totalOrders, purchedOrders, totalRevenue,purchedRevenue  }: TasksProgressProps): React.JSX.Element {

   const formatCurrency = (amount: number) => {
    return amount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
  };
  return (
    <Card sx={sx}>
      <CardContent>
        <Stack spacing={2}>
          <Stack direction="row" sx={{ alignItems: 'flex-start', justifyContent: 'space-between' }} spacing={3}>
            <Stack spacing={1}>
              <Typography color="text.secondary" gutterBottom variant="overline">
                Số ĐH thanh toán
              </Typography>
              <Typography variant="h4">{value}%</Typography>
            </Stack>
            <Avatar sx={{ backgroundColor: 'var(--mui-palette-warning-main)', height: '56px', width: '56px' }}>
              <Typography color="text.primary" gutterBottom variant="overline">
                {purchedOrders} / {totalOrders}
              </Typography>
            </Avatar>
          </Stack>
          <div>
            <LinearProgress value={value} variant="determinate" />
          </div>
          <div>
            <Typography>Chưa thanh toán {formatCurrency(((totalRevenue) - purchedRevenue))}</Typography>
          </div>
        </Stack>
      </CardContent>
    </Card>
  );
}
