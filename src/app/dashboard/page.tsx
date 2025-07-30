'use client';

import * as React from 'react';
import { useEffect, useState } from 'react';
import { nestApiInstance } from '@/constant/api';
import { Box, FormControl, InputLabel, MenuItem, Select, Typography } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import dayjs from 'dayjs';

import { Budget } from '@/components/dashboard/overview/budget';
import { Sales } from '@/components/dashboard/overview/sales';
import { TasksProgress } from '@/components/dashboard/overview/tasks-progress';
import { TotalProfit } from '@/components/dashboard/overview/total-profit';
import { Traffic } from '@/components/dashboard/overview/traffic';
import { useLoading } from '@/components/Loading/loading';

// export const metadata = { title: `Overview | Dashboard | ${config.site.name}` } satisfies Metadata;

type ReportByDaily = {
  day: number;
  totalAmount: number;
};

type todayReport = {
  totalToday: number;
  totalYesterday: number;
  percentChange: number;
  trend: string;
};

type MonthReport = {
  totalThisMonth: number;
  totalLastMonth: number;
  percentChange: number;
  trend: string;
};

type OrderPurched = {
  totalOrders: number;
  purchedOrders: number;
  percentPurchedOrders: number;
  totalRevenue: number;
  purchedRevenue: number;
  percentPurchedRevenue: number;
};

type TopProduct  = {
   totalQuantity: number,
    name: string
}

type StatusPercent = {
  title: string;
  percent: number;
};

type StatusPercentagesResponse = Record<
  string,
  StatusPercent
>;
export default function Page(): React.JSX.Element {
  const [todayReport, setTodayReport] = useState<todayReport>();
  const [MonthReport, setMonthReport] = useState<MonthReport>();
  const [orderReport, setOrderReport] = useState<OrderPurched>();
    const [topProduct, setTopProduct] = useState<TopProduct>();
  const [statusPercent, setStatusPercent] = useState<StatusPercentagesResponse | null>(null);
  const [brands, setBrands] = useState<ReportByDaily[]>([]);
  const { setLoading } = useLoading();
  const [selectedMonth, setSelectedMonth] = useState(dayjs().month() + 1); // Tháng bắt đầu từ 0
  const [selectedYear, setSelectedYear] = useState(dayjs().year());

  // Hàm chuyển brands thành mảng dữ liệu đủ 31 ngày, giá trị 0 nếu thiếu
  const mapBrandsToDailyData = (data?: ReportByDaily[]) => {
    const daysInMonth = 31; // hoặc lấy theo tháng thực tế
    const dailyData = Array(daysInMonth).fill(0);

    if (!Array.isArray(data)) {
      return dailyData;
    }

    data.forEach((item) => {
      if (item.day >= 1 && item.day <= daysInMonth) {
        dailyData[item.day - 1] = item.totalAmount;
      }
    });

    return dailyData;
  };
  const fetchReportByToday = async () => {
    try {
      setLoading(true);
      const res = await nestApiInstance.get(`orders/stats/daily-sales`);
      setTodayReport(res.data);
    } catch (err) {
      console.error('Lỗi khi tải dữ liệu brand:', err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchReportByToday();
  }, []);

  const fetchReportByThisMonth = async () => {
    try {
      setLoading(true);
      const res = await nestApiInstance.get(`orders/stats/monthly-sales`);
      setMonthReport(res.data);
    } catch (err) {
      console.error('Lỗi khi tải dữ liệu brand:', err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchReportByThisMonth();
  }, []);

  const fetchReportByOrder = async () => {
    try {
      setLoading(true);
      const res = await nestApiInstance.get(`orders/stats/monthly-purched`);
      setOrderReport(res.data);
    } catch (err) {
      console.error('Lỗi khi tải dữ liệu brand:', err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchReportByOrder();
  }, []);

const fetchTopProduct = async () => {
    try {
      setLoading(true);
      const res = await nestApiInstance.get(`orders/stats/monthly-top-product`);
      setTopProduct(res.data.topSoldProduct);
    } catch (err) {
      console.error('Lỗi khi tải dữ liệu brand:', err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchTopProduct();
  }, []);

const fetchStatusPercent = async () => {
    try {
      setLoading(true);
      const res = await nestApiInstance.get(`orders/stats/monthly-status`);
      setStatusPercent(res.data.statusPercentages);
    } catch (err) {
      console.error('Lỗi khi tải dữ liệu brand:', err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchStatusPercent();
  }, []);
  const labels: string[] = [];
  const series: number[] = [];
  const colors: string[] = [];

  // Màu cho từng trạng thái (bạn có thể đổi màu theo ý)
  const colorMap: Record<string, string> = {
    pending: '#facc15',    // vàng
    purched: '#22c55e',    // xanh lá (đã thanh toán)
    shipped: '#0ea5e9',    // xanh biển nhạt
    delivered: '#6366f1',  // tím
    cancelled: '#ef4444',  // đỏ
    completed: '#8b5cf6',  // tím nhạt
  };

  if (statusPercent) {
    // Lặp theo đúng thứ tự các trạng thái bạn muốn hiển thị (để đồng bộ màu và label)
    const orderedKeys = ['pending', 'purched', 'shipped', 'delivered', 'cancelled', 'completed'];

    orderedKeys.forEach((key) => {
      const item = statusPercent[key];
      if (item) {
        labels.push(item.title);
        series.push(Number(item.percent.toFixed(2))); // giữ 2 chữ số thập phân
        colors.push(colorMap[key] || '#64748b'); // fallback màu xám nếu chưa có map
      }
    });
  }
  useEffect(() => {
    fetchReportByDaily(selectedYear, selectedMonth);
  }, [selectedMonth, selectedYear]);
  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
  };

  const fetchReportByDaily = async (year: number, month: number) => {
    try {
      setLoading(true);
      const res = await nestApiInstance.get(`/orders/stats/daily-sales/${year}/${month}`);
      setBrands(res.data);
    } catch (err) {
      console.error('Lỗi khi tải dữ liệu brand:', err);
    } finally {
      setLoading(false);
    }
  };

  const salesDataThisYear = mapBrandsToDailyData(brands ?? []);
  return (
    <Grid container spacing={3}>
      <Grid lg={3} sm={6} xs={12}>
        <Budget
          diff={todayReport?.percentChange}
          trend={todayReport?.trend ?? 'down'} // Fallback to 'down' if undefined
          sx={{ height: '100%' }}
          value={todayReport ? formatCurrency(todayReport.totalToday) : ''}
          title="Doanh thu hôm nay"
          description="So với hôm qua"
        />
      </Grid>

      <Grid lg={3} sm={6} xs={12}>
        <Budget
          diff={MonthReport?.percentChange}
          trend={MonthReport?.trend ?? 'down'} // Fallback to 'down' if undefined
          sx={{ height: '100%' }}
          value={MonthReport ? formatCurrency(MonthReport.totalThisMonth) : ''}
          title="Doanh thu tháng"
          description="So với tháng trước"
        />
      </Grid>
      <Grid lg={3} sm={6} xs={12}>
        <TasksProgress 
        sx={{ height: '100%' }} 
        value={orderReport?.percentPurchedOrders ?? 0}
        purchedOrders={orderReport?.purchedOrders ?? 0}
        totalOrders={orderReport?.totalOrders ?? 0}
        purchedRevenue={orderReport?.purchedRevenue ?? 0}
        totalRevenue={orderReport?.totalRevenue ?? 0}
        />
      </Grid>
      <Grid lg={3} sm={6} xs={12}>
        <TotalProfit 
        sx={{ height: '100%' }} 
        value={topProduct?.name ?? ''}
        quantity={topProduct?.totalQuantity ?? 0}
        />
      </Grid>

      {/* Biểu đồ doanh thu theo tháng */}
      <Grid lg={8} xs={12}>
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          {/* Chọn Năm */}
          <FormControl fullWidth size="small">
            <InputLabel id="select-year-label">Năm</InputLabel>
            <Select
              labelId="select-year-label"
              id="select-year"
              value={selectedYear}
              label="Năm"
              onChange={(e) => setSelectedYear(Number(e.target.value))}
            >
              {Array.from({ length: 5 }, (_, i) => {
                const year = dayjs().year() - 2 + i;
                return (
                  <MenuItem key={year} value={year}>
                    Năm {year}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>

          {/* Chọn Tháng */}
          <FormControl fullWidth size="small">
            <InputLabel id="select-month-label">Tháng</InputLabel>
            <Select
              labelId="select-month-label"
              id="select-month"
              value={selectedMonth}
              label="Tháng"
              onChange={(e) => setSelectedMonth(Number(e.target.value))}
            >
              {Array.from({ length: 12 }, (_, i) => (
                <MenuItem key={i + 1} value={i + 1}>
                  Tháng {i + 1}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        <Sales chartSeries={[{ name: 'Doanh thu', data: salesDataThisYear }]} sx={{ height: '100%' }} />
      </Grid>

      {/* <Grid lg={4} md={6} xs={12}>
        <Traffic chartSeries={[63, 15, 22]} labels={['Desktop', 'Tablet', 'Phone']} sx={{ height: '100%' }} />
      </Grid> */}
       <Grid  lg={4} md={6} xs={12}>
        <Traffic chartSeries={series} labels={labels} colors={colors} sx={{ height: '100%' }} />
      </Grid>
      {/* <Grid lg={4} md={6} xs={12}>
        <LatestProducts
          products={[
            {
              id: 'PRD-005',
              name: 'Soja & Co. Eucalyptus',
              image: '/assets/product-5.png',
              updatedAt: dayjs().subtract(18, 'minutes').subtract(5, 'hour').toDate(),
            },
            {
              id: 'PRD-004',
              name: 'Necessaire Body Lotion',
              image: '/assets/product-4.png',
              updatedAt: dayjs().subtract(41, 'minutes').subtract(3, 'hour').toDate(),
            },
            {
              id: 'PRD-003',
              name: 'Ritual of Sakura',
              image: '/assets/product-3.png',
              updatedAt: dayjs().subtract(5, 'minutes').subtract(3, 'hour').toDate(),
            },
            {
              id: 'PRD-002',
              name: 'Lancome Rouge',
              image: '/assets/product-2.png',
              updatedAt: dayjs().subtract(23, 'minutes').subtract(2, 'hour').toDate(),
            },
            {
              id: 'PRD-001',
              name: 'Erbology Aloe Vera',
              image: '/assets/product-1.png',
              updatedAt: dayjs().subtract(10, 'minutes').toDate(),
            },
          ]}
          sx={{ height: '100%' }}
        />
      </Grid>
      <Grid lg={8} md={12} xs={12}>
        <LatestOrders
          orders={[
            {
              id: 'ORD-007',
              customer: { name: 'Ekaterina Tankova' },
              amount: 30.5,
              status: 'pending',
              createdAt: dayjs().subtract(10, 'minutes').toDate(),
            },
            {
              id: 'ORD-006',
              customer: { name: 'Cao Yu' },
              amount: 25.1,
              status: 'delivered',
              createdAt: dayjs().subtract(10, 'minutes').toDate(),
            },
            {
              id: 'ORD-004',
              customer: { name: 'Alexa Richardson' },
              amount: 10.99,
              status: 'refunded',
              createdAt: dayjs().subtract(10, 'minutes').toDate(),
            },
            {
              id: 'ORD-003',
              customer: { name: 'Anje Keizer' },
              amount: 96.43,
              status: 'pending',
              createdAt: dayjs().subtract(10, 'minutes').toDate(),
            },
            {
              id: 'ORD-002',
              customer: { name: 'Clarke Gillebert' },
              amount: 32.54,
              status: 'delivered',
              createdAt: dayjs().subtract(10, 'minutes').toDate(),
            },
            {
              id: 'ORD-001',
              customer: { name: 'Adam Denisov' },
              amount: 16.76,
              status: 'delivered',
              createdAt: dayjs().subtract(10, 'minutes').toDate(),
            },
          ]}
          sx={{ height: '100%' }}
        />
      </Grid> */}
    </Grid>
  );
}
