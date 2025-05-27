'use client';

import * as React from 'react';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { nestApiInstance } from '@/constant/api';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  Stack,
  Typography,
} from '@mui/material';
import { color } from '@mui/system';

import BrandDescription from '@/components/Base64/Base64';
import { CustomerActions } from '@/components/CustomAction/CustomerActions';
import { toast } from 'react-toastify';

type Brand = {
  _id: string;
  name: string;
  contact: string;
  address: string;
  // slug: string;
};

export default function Page(): React.JSX.Element {
  const [brand, setBrand] = useState<Brand | null>(null);
  const slug = useParams();
    const router = useRouter();

  console.log(slug);

  useEffect(() => {
    const fetchBrand = async () => {
      try {
        const res = await nestApiInstance.get(`/supplier/slug/${slug.slug}`);
        setBrand(res.data.data); // Đảm bảo API trả về một đối tượng, không phải mảng
      } catch (err) {
        console.error('Lỗi khi tải dữ liệu brand:', err);
      }
    };

    fetchBrand();
  }, []);
  console.log(brand);
 const handleEdit = (id: string) => {
    router.push(`/supplier/edit/${id}`);
  };
  const handleDelete = async (id: string) => {
    const confirm = window.confirm(`Xác nhận xoá nhà cung ứng với ID: ${id}?`);
    if (confirm) {
      try {
        const res = await nestApiInstance.delete(`/supplier/${id}`);
        toast.success('Xoá nhà cung ứng thành công!');
        router.push(`/supplier`);

      } catch (err) {
        console.error('Lỗi khi tải dữ liệu brand:', err);
      }
    }
  };
  if (!brand) return <Typography>Đang tải...</Typography>;

  return (
    <Stack spacing={3}>
      <Card>
        <Box display="flex" justifyContent="space-between" alignItems="center" px={2} py={1} pt={2}>
          <CardHeader
            title="Thương hiệu"
            subheader="Chi tiết thông tin thương hiệu"
            sx={{ p: 0 }} // xóa padding mặc định để khớp layout
          />
          <Box display="flex" gap={1}>
                     <CustomerActions
                       id={brand._id}
                       onEdit={handleEdit}
                       onDelete={handleDelete}
                       showEdit={true}
                       showDelete={true}
                       showDetail={false}
                     />
                   </Box>
        </Box>

        <Divider />
       <CardContent>
  <Grid container spacing={4}>
    {/* Cột trái - Tên thương hiệu */}
    <Grid item xs={12} md={4}>
      <Box 
        display="flex" 
        flexDirection="column" 
        alignItems="center" 
        justifyContent="center" 
        height="100%"
        textAlign="center"
        p={2}
        sx={{ backgroundColor: '#f5f5f5', borderRadius: 2 }}
      >
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          {brand.name}
        </Typography>
      </Box>
    </Grid>

    {/* Cột phải - Thông tin chi tiết */}
    <Grid item xs={12} md={8}>
      <Box display="flex" flexDirection="column" gap={2}>
        <Typography variant="h5" gutterBottom>
          Thông tin chi tiết về nhà cung ứng
        </Typography>

        <Box>
          <Typography variant="subtitle1" fontWeight="bold">
            Tên công ty:
          </Typography>
          <Typography variant="body1">
            {brand.name}
          </Typography>
        </Box>

        <Box>
          <Typography variant="subtitle1" fontWeight="bold">
            Số điện thoại:
          </Typography>
          <Typography variant="body1">
            {brand.contact}
          </Typography>
        </Box>

        <Box>
          <Typography variant="subtitle1" fontWeight="bold">
            Địa chỉ:
          </Typography>
          <Typography variant="body1">
            {brand.address}
          </Typography>
        </Box>
      </Box>
    </Grid>
  </Grid>
</CardContent>

        <Divider />
      </Card>
    </Stack>
  );
}
