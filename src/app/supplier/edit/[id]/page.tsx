'use client';

import * as React from 'react';
import { useEffect, useState } from 'react';
import {
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  FormControl,
  InputLabel,
  OutlinedInput,
  Stack,
  Typography,
  Button,
} from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { useParams, useRouter } from 'next/navigation';
import { nestApiInstance } from '@/constant/api';

export default function EditSupplier(): React.JSX.Element {
  const params = useParams();
  const supplierId =  params?.id as string | undefined; // URL: /edit-supplier?id=123

  const router = useRouter();

  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (supplierId) {
      fetchSupplier();
    }
  }, [supplierId]);

  const fetchSupplier = async () => {
    try {
      const response = await nestApiInstance.get(`/supplier/${supplierId}`);
      const supplier = response.data.data;
      setName(supplier.name);
      setContact(supplier.contact);
      setAddress(supplier.address);
    } catch (error) {
      console.error('Lỗi khi lấy thông tin nhà cung ứng:', error);
      alert('Không thể tải thông tin nhà cung ứng');
    }
  };

  const handleUpdate = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!name || !contact || !address) {
      alert('Vui lòng điền đầy đủ thông tin.');
      return;
    }

    setLoading(true);
    try {
      const response = await nestApiInstance.put(`/supplier/${supplierId}`, {
        name,
        contact,
        address,
      });

      if (response.data.statusCode === 200 || response.status === 200) {
        alert('Cập nhật nhà cung ứng thành công');
        router.push('/supplier'); // Điều hướng về trang danh sách nếu cần
      } else {
        alert('Cập nhật nhà cung ứng thất bại');
      }
    } catch (error) {
      console.error('Lỗi khi cập nhật nhà cung ứng:', error);
      alert('Đã xảy ra lỗi khi cập nhật');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Stack spacing={3}>
      <Typography variant="h4">Chỉnh Sửa Nhà Cung Ứng</Typography>
      <form onSubmit={handleUpdate}>
        <Grid container spacing={3}>
          <Grid xs={12} md={12}>
            <Card>
              <CardHeader
                title="Thông tin nhà cung ứng"
                subheader="Chỉnh sửa các trường bên dưới"
              />
              <Divider />
              <CardContent>
                <Stack spacing={3}>
                  <FormControl fullWidth required>
                    <InputLabel htmlFor="edit-name">Tên nhà cung ứng</InputLabel>
                    <OutlinedInput
                      id="edit-name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      label="Tên nhà cung ứng"
                    />
                  </FormControl>

                  <FormControl fullWidth required>
                    <InputLabel htmlFor="edit-contact">Liên hệ</InputLabel>
                    <OutlinedInput
                      id="edit-contact"
                      value={contact}
                      onChange={(e) => setContact(e.target.value)}
                      label="Liên hệ"
                    />
                  </FormControl>

                  <FormControl fullWidth required>
                    <InputLabel htmlFor="edit-address">Địa chỉ</InputLabel>
                    <OutlinedInput
                      id="edit-address"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      label="Địa chỉ"
                    />
                  </FormControl>
                </Stack>
              </CardContent>
              <Divider />
              <CardActions sx={{ justifyContent: 'flex-end' }}>
                <Button variant="contained" type="submit" disabled={loading}>
                  {loading ? 'Đang cập nhật...' : 'Cập nhật nhà cung ứng'}
                </Button>
              </CardActions>
            </Card>
          </Grid>
        </Grid>
      </form>
    </Stack>
  );
}
