'use client';

import * as React from 'react';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  Grid,
  Stack,
  Typography,
  Button,
} from '@mui/material';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import PaymentIcon from '@mui/icons-material/Payment';
import CancelIcon from '@mui/icons-material/Cancel';
import PhoneInTalkIcon from '@mui/icons-material/PhoneInTalk';
import { toast } from 'react-toastify';

import { nestApiInstance } from '@/constant/api';

interface Product {
  _id: string;
  name: string;
  description?: string;
  price: number;
  stock?: number;
  images?: string[];
  barcodeImage?: string;
}

interface Item {
  _id: string;
  product: Product;
  quantity: number;
  price: number;
}

interface ShippingAddress {
  recipientName: string;
  phone: string;
  address?: string;
  addressLine?: string;
  city?: string;
  postalCode?: string;
  _id?: string;
}

interface Order {
  _id: string;
  orderType: 'store' | 'delivery';
  user?: any;
  items: Item[];
  totalAmount: number;
  orderCode:string;
  status: string;
  paymentMethod: string;
  note?: string;
  shippingAddress?: ShippingAddress;
  createdAt: string;
  updatedAt: string;
}

export default function OrderDetails() {
  const router = useRouter();
  const params = useParams();
  const orderId = params?.id as string | undefined;

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!orderId) {
      toast.error('Không có ID đơn hàng');
      router.push('/orders');
      return;
    }

    const fetchOrder = async () => {
      setLoading(true);
      try {
        const response = await nestApiInstance.get(`/orders/${orderId}`);
        setOrder(response.data);
      } catch (error) {
        toast.error('Lỗi khi tải dữ liệu đơn hàng');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId, router]);

  // Trạng thái hiển thị
const getStatusChip = (status: string) => {
  switch (status) {
    case 'pending':
      return <Chip label="Đang xử lý" color="warning" />;
    case 'purched':  // nếu bạn muốn dùng 'purched' nghĩa là đã thanh toán
      return <Chip label="Đã thanh toán" color="warning" />;
    case 'processing':
      return <Chip label="Đang xử lý" color="info" />;
    case 'shipped':
      return <Chip label="Đã gửi hàng" color="info" icon={<LocalShippingIcon />} />;
    case 'delivered':
      return <Chip label="Đã giao" color="success" />;
    case 'cancelled':
      return <Chip label="Đã hủy" color="error" icon={<CancelIcon />} />;
    case 'completed':
      return <Chip label="Hoàn thành" color="success" />;
    default:
      return <Chip label={status} />;
  }
};

  // Trạng thái thanh toán (dựa trên paymentMethod tạm)
  // Có thể bạn muốn hiện trực tiếp paymentMethod (cash, momo,...)
  // hoặc trạng thái thanh toán riêng biệt nếu có.
  const getPaymentMethodChip = (method: string) => {
    switch (method) {
      case 'cash':
        return <Chip label="Tiền mặt" color="primary" icon={<PaymentIcon />} />;
     case 'card':
        return <Chip label="Chuyển khoản" color="secondary" icon={<PaymentIcon />} />;
      default:
        return <Chip label={method} />;
    }
  };

  if (loading)
    return (
      <Stack alignItems="center" justifyContent="center" sx={{ height: '70vh' }}>
        <CircularProgress />
      </Stack>
    );

  if (!order)
    return (
      <Typography variant="h6" color="text.secondary" textAlign="center" sx={{ mt: 5 }}>
        Không tìm thấy đơn hàng.
      </Typography>
    );

  return (
    <Box sx={{ maxWidth: 900, margin: 'auto', p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Chi tiết đơn hàng #{order.orderCode.toUpperCase()}
      </Typography>

      <Card variant="outlined" sx={{ mb: 3 }}>
        <CardContent>
          <Stack direction="row" spacing={2} flexWrap="wrap" alignItems="center" mb={2}>
            <Typography variant="subtitle1" sx={{ minWidth: 140 }}>
              Loại đơn hàng:
            </Typography>
            <Chip
              label={order.orderType === 'store' ? 'Tại cửa hàng' : 'Giao hàng'}
              color={order.orderType === 'store' ? 'info' : 'success'}
              icon={order.orderType === 'delivery' ? <LocalShippingIcon /> : undefined}
            />
          </Stack>

          <Stack direction="row" spacing={2} flexWrap="wrap" alignItems="center" mb={2}>
            <Typography variant="subtitle1" sx={{ minWidth: 140 }}>
              Trạng thái đơn hàng:
            </Typography>
            {getStatusChip(order.status)}
          </Stack>

          <Stack direction="row" spacing={2} flexWrap="wrap" alignItems="center" mb={2}>
            <Typography variant="subtitle1" sx={{ minWidth: 140 }}>
              Phương thức thanh toán:
            </Typography>
            {getPaymentMethodChip(order.paymentMethod)}
          </Stack>

          <Typography variant="body2" color="text.secondary">
            Ngày đặt hàng: {new Date(order.createdAt).toLocaleString()}
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={2}>
            Cập nhật cuối: {new Date(order.updatedAt).toLocaleString()}
          </Typography>

          <Divider />

          {/* Nếu là đơn giao hàng thì hiển thị địa chỉ giao */}
          {order.orderType === 'delivery' && order.shippingAddress && (
            <Box mt={2}>
              <Typography variant="h6" gutterBottom>
                Địa chỉ giao hàng
              </Typography>
              <Typography>
                <b>Người nhận:</b> {order.shippingAddress.recipientName}
              </Typography>
              <Typography>
                <b>Điện thoại:</b> {order.shippingAddress.phone}
              </Typography>
              <Typography>
                <b>Địa chỉ:</b>{' '}
                {order.shippingAddress.address ||
                  order.shippingAddress.addressLine ||
                  ''}{' '}
                {order.shippingAddress.city ? `, ${order.shippingAddress.city}` : ''}{' '}
                {order.shippingAddress.postalCode ? `- ${order.shippingAddress.postalCode}` : ''}
              </Typography>
            </Box>
          )}

          {/* Ghi chú */}
          {order.note && (
            <Box mt={2}>
              <Typography variant="subtitle1" gutterBottom>
                Ghi chú
              </Typography>
              <Typography>{order.note}</Typography>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Danh sách sản phẩm */}
      <Card variant="outlined" sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Sản phẩm trong đơn ({order.items.length})
          </Typography>

          <Stack spacing={2}>
            {order.items.map((item) => {
              const img = item.product.images && item.product.images.length > 0 ? item.product.images[0] : '';
              return (
                <Grid container spacing={2} key={item._id} alignItems="center">
                  <Grid item xs={3} sm={2}>
                    <Avatar variant="rounded" src={img} alt={item.product.name} sx={{ width: 56, height: 56 }} />
                  </Grid>
                  <Grid item xs={9} sm={10}>
                    <Typography variant="subtitle1">{item.product.name}</Typography>
                    <Typography variant="body2" color="text.secondary" noWrap>
                      {item.product.description ? (item.product.description.replace(/<\/?[^>]+(>|$)/g, "")) : ''}
                    </Typography>
                    <Typography variant="body2" mt={0.5}>
                      Số lượng: <b>{item.quantity}</b> &nbsp;|&nbsp; Giá: <b>{item.price.toLocaleString()} VNĐ</b>
                    </Typography>
                  </Grid>
                </Grid>
              );
            })}
          </Stack>
          <Divider sx={{ my: 2 }} />
          <Typography variant="h6" textAlign="right">
            Tổng tiền: {order.totalAmount.toLocaleString()} VNĐ
          </Typography>
        </CardContent>
      </Card>

      {/* Nút hủy đơn - ví dụ */}
      <Box textAlign="center" mt={3}>
        <Button
          variant="contained"
          color="error"
          onClick={() => toast.info('Tính năng hủy đơn chưa triển khai')}
        >
          Hủy đơn hàng
        </Button>
      </Box>
    </Box>
  );
}
