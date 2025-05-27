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
import { toast } from 'react-toastify';

import { CustomerActions } from '@/components/CustomAction/CustomerActions';
import BrandDescription from '@/components/Base64/Base64';

type Variant = {
  _id: string;
  name: string;
  price: number;
  stock: number;
  slug: string;
  description: string;
  image: string;
};

export default function Page(): React.JSX.Element {
  const [variant, setVariant] = useState<Variant | null>(null);
  const slug = useParams();
  const router = useRouter();

  useEffect(() => {
    const fetchVariant = async () => {
      try {
        const res = await nestApiInstance.get(`/variant/slug/${slug.slug}`);
        setVariant(res.data.data);
      } catch (err) {
        console.error('Lỗi khi tải dữ liệu variant:', err);
      }
    };

    fetchVariant();
  }, []);

  const handleEdit = (id: string) => {
    router.push(`/variant/edit/${id}`);
  };

  const handleDelete = async (id: string) => {
    const confirm = window.confirm(`Xác nhận xoá biến thể với ID: ${id}?`);
    if (confirm) {
      try {
        await nestApiInstance.delete(`/variant/${id}`);
        toast.success('Xoá biến thể thành công!');
        router.push(`/variant`);
      } catch (err) {
        console.error('Lỗi khi xoá biến thể:', err);
      }
    }
  };

  if (!variant) return <Typography>Đang tải...</Typography>;

  return (
    <Stack spacing={3}>
      <Card>
        <Box display="flex" justifyContent="space-between" alignItems="center" px={2} py={1} pt={2}>
          <CardHeader
            title="Biến thể"
            subheader="Chi tiết thông tin biến thể"
            sx={{ p: 0 }}
          />
          <Box display="flex" gap={1}>
            <CustomerActions
              id={variant._id}
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
            {/* Cột trái - Hình ảnh */}
            <Grid item xs={12} md={4}>
              <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                height="100%"
                p={2}
                sx={{ backgroundColor: '#f5f5f5', borderRadius: 2 }}
              >
                <Image
                  src={variant.image}
                  alt={variant.name}
                  width={200}
                  height={200}
                  style={{ borderRadius: '8px', objectFit: 'contain' }}
                />
                <Typography variant="h6" mt={2}>
                  {variant.name}
                </Typography>
              </Box>
            </Grid>

            {/* Cột phải - Thông tin chi tiết */}
            <Grid item xs={12} md={8}>
              <Box display="flex" flexDirection="column" gap={2}>
                <Typography variant="h5" gutterBottom>
                  Thông tin chi tiết
                </Typography>

                <Box>
                  <Typography variant="subtitle1" fontWeight="bold">Tên biến thể:</Typography>
                  <Typography>{variant.name}</Typography>
                </Box>

                <Box>
                  <Typography variant="subtitle1" fontWeight="bold">Giá:</Typography>
                  <Typography>{variant.price.toLocaleString()} VNĐ</Typography>
                </Box>

                <Box>
                  <Typography variant="subtitle1" fontWeight="bold">Tồn kho:</Typography>
                  <Typography>{variant.stock}</Typography>
                </Box>

                {/* <Box>
                  <Typography variant="subtitle1" fontWeight="bold">Slug:</Typography>
                  <Typography>{variant.slug}</Typography>
                </Box> */}

                <Box>
                  <Typography variant="subtitle1" fontWeight="bold">Mô tả:</Typography>
                   <Typography variant="body1">
                <BrandDescription description={variant.description} />
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
