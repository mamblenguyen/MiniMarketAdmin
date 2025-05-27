'use client';

import * as React from 'react';
import { useState } from 'react';
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
import { nestApiInstance } from '@/constant/api';

export default function AddBrand(): React.JSX.Element {
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!name || !contact || !address) {
      alert('Vui lòng điền đầy đủ thông tin.');
      return;
    }

    setLoading(true);
    try {
      const response = await nestApiInstance.post(`/supplier/`, {
        name,
        contact,
        address,
      });

      if (response.data.statusCode === 200 || response.status === 201) {
        alert('Thêm nhà cung ứng thành công');
        // Optional: reset form
        setName('');
        setContact('');
        setAddress('');
      } else {
        alert('Thêm nhà cung ứng thất bại');
      }
    } catch (error) {
      console.error('Lỗi khi gửi yêu cầu:', error);
      alert('Đã xảy ra lỗi khi thêm nhà cung ứng');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Stack spacing={3}>
      <Typography variant="h4">Thêm Nhà Cung Ứng</Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid xs={12} md={12}>
            <Card>
              <CardHeader
                title="Thông tin nhà cung ứng"
                subheader="Vui lòng nhập đầy đủ các trường bên dưới"
              />
              <Divider />
              <CardContent>
                <Stack spacing={3}>
                  <FormControl fullWidth required>
                    <InputLabel htmlFor="brand-name">Tên nhà cung ứng</InputLabel>
                    <OutlinedInput
                      id="brand-name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      label="Tên thương hiệu"
                      placeholder="Nhập tên thương hiệu"
                    />
                  </FormControl>

                  <FormControl fullWidth required>
                    <InputLabel htmlFor="brand-contact">Số điện thoại liên hệ</InputLabel>
                    <OutlinedInput
                      id="brand-contact"
                      value={contact}
                      onChange={(e) => setContact(e.target.value)}
                      label="Liên hệ"
                      placeholder="Số điện thoại hoặc email"
                    />
                  </FormControl>

                  <FormControl fullWidth required>
                    <InputLabel htmlFor="brand-address">Địa chỉ nhà cung ứng</InputLabel>
                    <OutlinedInput
                      id="brand-address"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      label="Địa chỉ"
                      placeholder="Địa chỉ chi tiết"
                    />
                  </FormControl>
                </Stack>
              </CardContent>
              <Divider />
              <CardActions sx={{ justifyContent: 'flex-end' }}>
                <Button variant="contained" type="submit" disabled={loading}>
                  {loading ? 'Đang lưu...' : 'Lưu nhà cung ứng'}
                </Button>
              </CardActions>
            </Card>
          </Grid>
        </Grid>
      </form>
    </Stack>
  );
}
