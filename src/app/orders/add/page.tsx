'use client';

import React, { useEffect, useState } from 'react';
import { nestApiInstance } from '@/constant/api';
import {
  Box,
  Button,
  CircularProgress,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { toast } from 'react-toastify';
import Image from 'next/image';

interface Product {
  _id: string;
  name: string;
  price: number;
  stock: number;
  barcode: string;
  images : string[]
}

interface SelectedItem {
  product: Product;
  quantity: number;
}

interface ShippingAddress {
  recipientName: string;
  phone: string;
  address: string;
}

// const allProducts: Product[] = [
//   { _id: '1', name: 'Sản phẩm A', price: 100000, stock: 10 },
//   { _id: '2', name: 'Sản phẩm B', price: 200000, stock: 5 },
//   { _id: '3', name: 'Sản phẩm C', price: 150000, stock: 8 },
// ];

export default function OrderPage() {
  const [tab, setTab] = useState<'store' | 'delivery'>('store');
  const [selectedItems, setSelectedItems] = useState<SelectedItem[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'momo' | 'card'>('cash');
  const [note, setNote] = useState('');
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    recipientName: '',
    phone: '',
    address: '',
  });
  const [products, setProducts] = useState<Product[]>([]);

  const [loading, setLoading] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [paymentStep, setPaymentStep] = useState<'init' | 'qr_displayed' | 'order_created'>('init');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProducts = products.filter((product) => {
    const lowerQuery = searchQuery.toLowerCase();
    return (
      product.name.toLowerCase().includes(lowerQuery) || product.barcode.toLowerCase().includes(lowerQuery) // giả sử barcode là _id
    );
  });
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await nestApiInstance.get('/product/');
      setProducts(res.data.data);
    } catch (err) {
      console.error('Lỗi khi tải dữ liệu brand:', err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchProducts();
  }, []);
  // Thêm sản phẩm vào giỏ
  function addProduct(product: Product) {
    const found = selectedItems.find((item) => item.product._id === product._id);
    if (found) {
      setSelectedItems((prev) =>
        prev.map((item) =>
          item.product._id === product._id && item.quantity < product.stock
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setSelectedItems((prev) => [...prev, { product, quantity: 1 }]);
    }
  }

  // Thay đổi số lượng
  function updateQuantity(productId: string, quantity: number) {
    if (quantity < 1) return;
    const product = products.find((p) => p._id === productId);
    if (!product) return;

    if (quantity > product.stock) {
      toast.warning('Số lượng vượt quá tồn kho');
      quantity = product.stock;
    }
    setSelectedItems((prev) => prev.map((item) => (item.product._id === productId ? { ...item, quantity } : item)));
  }

  // Xóa sản phẩm khỏi giỏ
  function removeProduct(productId: string) {
    setSelectedItems((prev) => prev.filter((item) => item.product._id !== productId));
  }

  // Validate địa chỉ giao hàng
  function validateShippingAddress() {
    const { recipientName, phone, address } = shippingAddress;
    if (!recipientName.trim() || !phone.trim() || !address.trim()) return false;
    return true;
  }

  // Gọi API lấy QR
  async function handleGenerateQr() {
        const { recipientName, phone } = shippingAddress;

        console.log(recipientName , phone);
        
  if (selectedItems.length === 0) {
    toast.error('Vui lòng chọn ít nhất một sản phẩm');
    return;
  }

  if (tab === 'delivery' && !validateShippingAddress()) {
    toast.error('Vui lòng điền đầy đủ thông tin địa chỉ giao hàng');
    return;
  }


  try {
    setLoading(true);
    const payload = {
      orderType: tab,
      items: selectedItems.map(({ product, quantity }) => ({
        product: product._id,
        quantity,
      })),
      paymentMethod,
      note: note.trim(),
      recipientName: recipientName.trim(),
      phone: phone.trim(),
      ...(tab === 'delivery' ? { shippingAddress } : {}),
    };

    const { data } = await nestApiInstance.post('/orders/generate-qr', payload);
    setQrCodeUrl(data.qrCodeUrl);
    setPaymentStep('qr_displayed');
  } catch (error) {
    toast.error('Lỗi khi tạo mã QR');
  } finally {
    setLoading(false);
  }
}


  // Gọi API tạo đơn thật
  async function handleCreateOrder() {
    if (selectedItems.length === 0) {
      toast.error('Vui lòng chọn ít nhất một sản phẩm');
      return;
    }
    if (tab === 'delivery' && !validateShippingAddress()) {
      toast.error('Vui lòng điền đầy đủ thông tin địa chỉ giao hàng');
      return;
    }

    try {
      setLoading(true);
      const payload = {
        orderType: tab,
        items: selectedItems.map(({ product, quantity }) => ({
          product: product._id,
          quantity,
        })),
        paymentMethod,
        note: note.trim(),
        ...(tab === 'delivery' ? { shippingAddress } : {}),
      };
      await nestApiInstance.post('/orders', payload);
      toast.success('Tạo đơn hàng thành công!');
      setSelectedItems([]);
      setNote('');
      setQrCodeUrl(null);
      setPaymentStep('order_created');
    } catch (error) {
      toast.error('Lỗi khi tạo đơn hàng');
    } finally {
      setLoading(false);
    }
  }

  // Tổng tiền
  const totalAmount = selectedItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  return (
    <Box maxWidth={1200} margin="auto" padding={2}>
      <Typography variant="h4" mb={2}>
        Đặt hàng
      </Typography>

      <Stack direction="row" spacing={2} mb={2}>
        <Button variant={tab === 'store' ? 'contained' : 'outlined'} onClick={() => setTab('store')}>
          Mua tại cửa hàng
        </Button>
        <Button variant={tab === 'delivery' ? 'contained' : 'outlined'} onClick={() => setTab('delivery')}>
          Giao hàng tận nơi
        </Button>
      </Stack>

      <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" mb={1}>
          Chọn sản phẩm
        </Typography>
        <TextField
          fullWidth
          label="Tìm kiếm sản phẩm theo tên hoặc mã vạch"
          variant="outlined"
          size="small"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ mb: 2 }}
        />
       <Box display="grid" gridTemplateColumns="repeat(auto-fill, minmax(250px, 1fr))" gap={2}>
  {filteredProducts.map((product) => {
    const selectedItem = selectedItems.find((item) => item.product._id === product._id);
    const isOutOfStock = product.stock <= 0;

    return (
      <Paper key={product._id} elevation={3} sx={{ p: 2, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <Box sx={{ mb: 1 }}>
          {/* Nếu bạn có image url: product.imageUrl */}
          <Box sx={{ mb: 1, textAlign: 'center' }}>
            <Image
              src={product.images[0] || '/no-image.png'}
              alt={product.name}
              width={150}
              height={150}
              style={{ objectFit: 'cover', borderRadius: 8 }}
            />
          </Box>
          <Typography fontWeight={600}>{product.name}</Typography>
          <Typography variant="body2" color="text.secondary">
            Giá: {product.price.toLocaleString()} VND
          </Typography>
          <Typography variant="body2" color={isOutOfStock ? 'error' : 'text.secondary'}>
            {isOutOfStock ? 'Hết hàng' : `Tồn kho: ${product.stock}`}
          </Typography>
        </Box>

        {selectedItem ? (
          <Box display="flex" alignItems="center" gap={1} mt={1}>
            {/* <Button
              size="small"
              variant="outlined"
              onClick={() =>
                updateQuantity(product._id, selectedItem.quantity - 1)
              }
              disabled={selectedItem.quantity <= 1}
            >
              -
            </Button>
            <TextField
              size="small"
              value={selectedItem.quantity}
              onChange={(e) =>
                updateQuantity(product._id, Number(e.target.value))
              }
              inputProps={{ min: 1, max: product.stock, style: { width: 40, textAlign: 'center' } }}
              type="number"
            />
            <Button
              size="small"
              variant="outlined"
              onClick={() =>
                updateQuantity(product._id, selectedItem.quantity + 1)
              }
              disabled={selectedItem.quantity >= product.stock}
            >
              +
            </Button>
            <Button
              size="small"
              color="error"
              onClick={() => removeProduct(product._id)}
            >
              Xóa
            </Button> */}
          </Box>
        ) : (
          <Button
            variant="contained"
            onClick={() => addProduct(product)}
            disabled={isOutOfStock}
            sx={{ mt: 1 }}
          >
            {isOutOfStock ? 'Không thể thêm' : 'Thêm'}
          </Button>
        )}
      </Paper>
    );
  })}
</Box>
{selectedItems.length > 0 && (
  <Paper variant="outlined" sx={{ p: 2, mt: 4 }}>
    <Typography variant="h6" gutterBottom>
      Danh sách sản phẩm đã chọn
    </Typography>

    {selectedItems.map(({ product, quantity }) => (
      <Box
        key={product._id}
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        mb={2}
        gap={2}
        flexWrap="wrap"
      >
        <Box display="flex" alignItems="center" gap={2}>
          <Image
            src={product.images[0] || '/no-image.png'}
            alt={product.name}
            width={60}
            height={60}
            style={{ objectFit: 'cover', borderRadius: 8 }}
          />
          <Box>
            <Typography fontWeight={600}>{product.name}</Typography>
            <Typography variant="body2" color="text.secondary">
              Đơn giá: {product.price.toLocaleString()} VND
            </Typography>
          </Box>
        </Box>

        <Box display="flex" alignItems="center" gap={1}>
          <Button
            size="small"
            variant="outlined"
            onClick={() => updateQuantity(product._id, quantity - 1)}
            disabled={quantity <= 1}
          >
            -
          </Button>
          <TextField
            size="small"
            value={quantity}
            onChange={(e) =>
              updateQuantity(product._id, Number(e.target.value))
            }
            inputProps={{ min: 1, max: product.stock, style: { width: 40, textAlign: 'center' } }}
            type="number"
          />
          <Button
            size="small"
            variant="outlined"
            onClick={() => updateQuantity(product._id, quantity + 1)}
            disabled={quantity >= product.stock}
          >
            +
          </Button>
          <Button
            size="small"
            color="error"
            onClick={() => removeProduct(product._id)}
          >
            Xóa
          </Button>
        </Box>
      </Box>
    ))}

    <Divider sx={{ my: 2 }} />

    <Box display="flex" justifyContent="space-between" alignItems="center">
      <Typography variant="h6">Tổng tiền:</Typography>
      <Typography variant="h6" color="primary">
        {totalAmount.toLocaleString()} VND
      </Typography>
    </Box>
  </Paper>
)}

      </Paper>

      {tab === 'delivery' && (
        <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
          <Typography variant="h6" mb={1}>
            Thông tin giao hàng
          </Typography>
          <TextField
            label="Tên người nhận"
            fullWidth
            size="small"
            margin="dense"
            value={shippingAddress.recipientName}
            onChange={(e) => setShippingAddress({ ...shippingAddress, recipientName: e.target.value })}
          />
          <TextField
            label="Số điện thoại"
            fullWidth
            size="small"
            margin="dense"
            value={shippingAddress.phone}
            onChange={(e) => setShippingAddress({ ...shippingAddress, phone: e.target.value })}
          />
          <TextField
            label="Địa chỉ"
            fullWidth
            size="small"
            margin="dense"
            value={shippingAddress.address}
            onChange={(e) => setShippingAddress({ ...shippingAddress, address: e.target.value })}
          />
        </Paper>
      )}

      <FormControl fullWidth sx={{ mb: 3 }}>
        <InputLabel>Phương thức thanh toán</InputLabel>
        <Select
          value={paymentMethod}
          label="Phương thức thanh toán"
          onChange={(e) => setPaymentMethod(e.target.value as any)}
        >
          <MenuItem value="cash">Tiền mặt</MenuItem>
          <MenuItem value="momo">Momo (QR)</MenuItem>
          <MenuItem value="card">Chuyển khoản (QR)</MenuItem>
        </Select>
      </FormControl>

      <TextField
        label="Ghi chú"
        multiline
        rows={2}
        fullWidth
        margin="normal"
        value={note}
        onChange={(e) => setNote(e.target.value)}
      />

      <Divider sx={{ my: 3 }} />

      <Typography variant="h6" gutterBottom>
        Tổng tiền: {totalAmount.toLocaleString()} VND
      </Typography>

      {paymentMethod !== 'cash' && paymentStep === 'init' && (
        <Button
          variant="contained"
          onClick={handleGenerateQr}
          disabled={loading || selectedItems.length === 0}
          sx={{ mt: 2 }}
        >
          {loading ? <CircularProgress size={24} /> : 'Hiển thị mã QR'}
        </Button>
      )}

      {paymentMethod !== 'cash' && paymentStep === 'qr_displayed' && qrCodeUrl && (
        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Typography variant="subtitle1" gutterBottom>
            Quét mã QR để thanh toán
          </Typography>
          <img src={qrCodeUrl} alt="QR Code" style={{ maxWidth: 250, margin: 'auto' }} />
          <Button variant="contained" color="success" onClick={handleCreateOrder} disabled={loading} sx={{ mt: 2 }}>
            {loading ? <CircularProgress size={24} /> : 'Tạo đơn hàng'}
          </Button>
        </Box>
      )}

      {paymentMethod === 'cash' && (
        <Button
          variant="contained"
          onClick={handleCreateOrder}
          disabled={loading || selectedItems.length === 0}
          sx={{ mt: 2 }}
        >
          {loading ? <CircularProgress size={24} /> : 'Tạo đơn hàng'}
        </Button>
      )}
    </Box>
  );
}
