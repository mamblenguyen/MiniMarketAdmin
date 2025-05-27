'use client';

import * as React from 'react';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useParams } from 'next/navigation';
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

type Brand = {
  _id: string;
  name: string;
  description: string;
  logo: string;
  slug: string;
};

export default function Page(): React.JSX.Element {
  const [brand, setBrand] = useState<Brand | null>(null);
  const slug = useParams();
  console.log(slug);

  useEffect(() => {
    const fetchBrand = async () => {
      try {
        const res = await nestApiInstance.get(`/brands/slug/${slug.slug}`);
        setBrand(res.data.data); // Đảm bảo API trả về một đối tượng, không phải mảng
      } catch (err) {
        console.error('Lỗi khi tải dữ liệu brand:', err);
      }
    };

    fetchBrand();
  }, []);
  console.log(brand);

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
            <Button variant="outlined">Thêm</Button>
            <Button variant="contained">Chỉnh sửa</Button>
          </Box>{' '}
        </Box>

        <Divider />
        <CardContent>
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Box flexDirection="column" alignItems="center">
                <Image
                  src={brand.logo}
                  alt={brand.name}
                  width={200}
                  height={200}
                  style={{ objectFit: 'contain', borderRadius: 8 }}
                />
                <Typography variant="h5" gutterBottom textAlign="center">
                  {brand.name}
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12} md={8}>
              <Typography variant="h5" gutterBottom>
                Thông tin chi tiết về thương hiệu{' '}
                <Typography component="span" variant="h5" color="error">
                  {brand.name}
                </Typography>
              </Typography>
              <Typography variant="body1">
                <BrandDescription description={brand.description} />
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
        <Divider />
      </Card>
    </Stack>
  );
}
