'use client';

import * as React from 'react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { nestApiInstance } from '@/constant/api';
import CancelIcon from '@mui/icons-material/Cancel';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import PaymentIcon from '@mui/icons-material/Payment';
import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  MenuItem,
  Select,
} from '@mui/material';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import dayjs from 'dayjs';
import { toast } from 'react-toastify';

import { CustomerActions } from '@/components/CustomAction/CustomerActions';
import { DataTable } from '@/components/DataTable/DataTable';
import { CustomersFilters } from '@/components/Filter/filer';
import { useLoading } from '@/components/Loading/loading';

type OrderItem = {
  product: {
    name?: string;
    images?: string[];
    price?: number;
  } | null;
  quantity: number;
  price: number;
};

type Order = {
  _id: string;
  orderType: string;
  items: OrderItem[];
  totalAmount: number;
  status: string;
  paymentMethod: string;
  note?: string;
  createdAt: string;
};

export default function Page(): React.JSX.Element {
  const [orders, setOrders] = useState<Order[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [total, setTotal] = useState(0);
  const { setLoading } = useLoading();
  const router = useRouter();
  const [filterText, setFilterText] = useState('');
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [editingStatusOrderId, setEditingStatusOrderId] = useState<string | null>(null);
  const [statusToUpdate, setStatusToUpdate] = useState<{ orderId: string; newStatus: string } | null>(null);
  const [currentStatusValue, setCurrentStatusValue] = useState<string>('');

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await nestApiInstance.get('/orders', {
        params: {
          page: page + 1,
          limit: rowsPerPage,
          search: filterText,
        },
      });
      setOrders(res.data.data);
      setTotal(res.data.total);
    } catch (err) {
      toast.error('Lỗi khi tải đơn hàng');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [page, rowsPerPage, filterText]);

  const handleChangePage = (_: unknown, newPage: number) => setPage(newPage);
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const toggleExpand = (id: string) => {
    setExpandedOrderId((prev) => (prev === id ? null : id));
  };

  const getStatusChip = (status: string) => {
    switch (status) {
      case 'pending':
        return <Chip label="Đang xử lý" color="warning" />;
      case 'purched':
        return <Chip label="Đã thanh toán" color="success" />;
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

  const columnNames = [
    'Mã đơn hàng',
    'Loại đơn',
    'Sản phẩm',
    'Tổng tiền',
    'Trạng thái',
    'Thanh toán',
    'Thời gian',
    'Thao tác',
  ];

  const handleClick = () => router.push('/orders/add');

  const orderStatusOptions = [
    { value: 'pending', label: 'Đang xử lý' },
    { value: 'purched', label: 'Đã thanh toán' },
    { value: 'processing', label: 'Đang xử lý' },
    { value: 'shipped', label: 'Đã gửi hàng' },
    { value: 'delivered', label: 'Đã giao' },
    { value: 'cancelled', label: 'Đã hủy' },
    { value: 'completed', label: 'Hoàn thành' },
  ];

  // Khi người dùng chọn trạng thái mới, hiện popup confirm (modal)
  const handleSelectStatus = (orderId: string, newStatus: string) => {
    setStatusToUpdate({ orderId, newStatus });
  };

  // Xác nhận thay đổi trạng thái
  const confirmChangeStatus = async () => {
    if (!statusToUpdate) return;

    setLoading(true);
    try {
      await nestApiInstance.put(`/orders/${statusToUpdate.orderId}/status`, null, {
        params: { status: statusToUpdate.newStatus },
      });
      toast.success('Cập nhật trạng thái thành công!');
      fetchOrders();
    } catch (err) {
      toast.error('Lỗi khi cập nhật trạng thái');
    } finally {
      setLoading(false);
      setStatusToUpdate(null);
      setEditingStatusOrderId(null);
    }
  };

  // Huỷ popup confirm
  const cancelChangeStatus = () => {
    setStatusToUpdate(null);
    setEditingStatusOrderId(null);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm(`Xác nhận xoá đơn hàng với ID: ${id}?`)) {
      try {
        await nestApiInstance.delete(`/orders/${id}`);
        toast.success('Xoá đơn hàng thành công!');
        fetchOrders();
      } catch (err) {
        toast.error('Lỗi khi xoá đơn hàng');
      }
    }
  };

  const filteredOrders = orders.filter((order) => order._id.toLowerCase().includes(filterText.toLowerCase()));

  const columns = [
    {
      id: 'orderCode',
    },
    {
      id: 'orderType',
      render: (type: string) =>
        type === 'store' ? (
          <Chip label="Tại cửa hàng" color="success" />
        ) : type === 'delivery' ? (
          <Chip label="Mua online" color="warning" />
        ) : (
          <Chip label={type} />
        ),
    },
    {
      id: 'items',
      render: (items: OrderItem[], row: Order) => (
        <div>
          <button
            onClick={() => toggleExpand(row._id)}
            style={{
              cursor: 'pointer',
              color: '#1976d2',
              background: 'none',
              border: 'none',
              padding: 0,
              fontWeight: 'bold',
            }}
            aria-expanded={expandedOrderId === row._id}
          >
            {expandedOrderId === row._id ? 'Ẩn sản phẩm ▲' : 'Xem sản phẩm ▼'}
          </button>
          {expandedOrderId === row._id && (
            <Stack spacing={1} mt={1}>
              {items.map((item, idx) => (
                <div key={idx}>
                  <strong>{item.product?.name || '[Sản phẩm đã xoá]'}</strong> (
                  {item.product?.price?.toLocaleString() || item.product?.price}đ x {item.quantity} ={' '}
                  {item.price.toLocaleString()}đ)
                </div>
              ))}
            </Stack>
          )}
        </div>
      ),
    },
    {
      id: 'totalAmount',
      render: (amount: number) => `${amount.toLocaleString()}đ`,
    },
    {
      id: 'status',
      render: (status: string, row: Order) => {
        const isEditing = editingStatusOrderId === row._id;

        if (isEditing) {
          return (
            <FormControl size="small" fullWidth>
              <Select
                autoFocus
                value={status}
                onChange={(e) => handleSelectStatus(row._id, e.target.value)}
                onBlur={() => setEditingStatusOrderId(null)}
              >
                {orderStatusOptions.map((s) => (
                  <MenuItem key={s.value} value={s.value}>
                    {s.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          );
        }

        return (
          <Box onClick={() => setEditingStatusOrderId(row._id)} sx={{ cursor: 'pointer' }}>
            {getStatusChip(status)}
          </Box>
        );
      },
    },
    {
      id: 'paymentMethod',
      render: getPaymentMethodChip,
    },
    {
  id: 'createdAt',
  render: (row: string) => {
    if (!row) return '';

    const date = new Date(row);
    if (isNaN(date.getTime())) return 'Invalid Date';

    const formattedTime = date.toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
      timeZone: 'Asia/Ho_Chi_Minh',
    });

    const formattedDate = date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      timeZone: 'Asia/Ho_Chi_Minh',
    });

    return `${formattedDate} - ${formattedTime}`;
  },
}

    ,
    {
      id: '_id',
      render: (_: any, row: Order) => (
        <CustomerActions id={row._id} onDelete={handleDelete} onDetail={() => router.push(`/orders/view/${row._id}`)} />
      ),
    },
  ];

  return (
    <div>
      <Stack direction="row" justifyContent="space-between" spacing={4} mb={3}>
        <Typography variant="h4">Quản lý đơn hàng</Typography>
        <Button startIcon={<PlusIcon />} variant="contained" onClick={handleClick}>
          Thêm đơn hàng
        </Button>
      </Stack>

      <CustomersFilters
        onSearch={(value) => {
          setFilterText(value);
          setPage(0);
        }}
      />

      <DataTable
        count={total}
        rows={orders}
        page={page}
        rowsPerPage={rowsPerPage}
        columnNames={columnNames}
        columns={columns}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      {/* Modal confirm thay đổi trạng thái */}
      <Dialog open={!!statusToUpdate} onClose={cancelChangeStatus}>
        <DialogTitle>Xác nhận thay đổi trạng thái</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Bạn có chắc chắn muốn đổi trạng thái đơn hàng này sang &quot;
            {statusToUpdate ? orderStatusOptions.find((opt) => opt.value === statusToUpdate.newStatus)?.label : ''}
            &quot;?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelChangeStatus}>Huỷ</Button>
          <Button onClick={confirmChangeStatus} variant="contained" color="primary">
            Xác nhận
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
