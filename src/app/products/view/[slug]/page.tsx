'use client';

import * as React from 'react';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { nestApiInstance } from '@/constant/api';
import { Box, Card, CardContent, CardHeader, Divider, Grid, Paper, Stack, Typography } from '@mui/material';
import { toast } from 'react-toastify';

import BrandDescription from '@/components/Base64/Base64';
import { CustomerActions } from '@/components/CustomAction/CustomerActions';
import { Product } from '@/types/product';

// type Variant = {
//   _id: string;
//   name: string;
//   price: number;
//   stock: number;
//   slug: string;
//   description: string;
//   image: string;
// };

// type Product = {
//   _id: string;
//   name: string;
//   description: string;
//   price: number;
//   stock: number;
//   barcode: string;
//   barcodeImage: string;
//   images: string[];
//   variants: Variant[];
//   brand: {
//     name: string;
//     description: string;
//     logo: string;
//     slug: string;
//   };
//   supplier: {
//     name: string;
//     contact: string;
//     address: string;
//     slug: string;
//   };
// };

export default function Page(): React.JSX.Element {
  const [product, setProduct] = useState<Product | null>(null);
  const slug = useParams();
  const router = useRouter();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await nestApiInstance.get(`/product/barcode/${slug.slug}`);
        setProduct(res.data.data);
      } catch (err) {
        console.error('Lỗi khi tải dữ liệu product:', err);
      }
    };
    fetchProducts();
  }, []);

  const handleEdit = (id: string) => router.push(`/products/edit/${id}`);
  const handleDelete = async (id: string) => {
    if (window.confirm(`Xác nhận xoá sản phẩm với ID: ${id}?`)) {
      try {
        await nestApiInstance.delete(`/product/${id}`);
        toast.success('Xoá sản phẩm thành công!');
        router.push(`/products`);
      } catch (err) {
        console.error('Lỗi khi xoá sản phẩm:', err);
      }
    }
  };

  if (!product) return <Typography>Đang tải...</Typography>;

  return (
    <Stack spacing={3}>
      <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" px={3} pt={3}>
          <CardHeader title="🛒 Thông tin sản phẩm" subheader="Chi tiết sản phẩm và biến thể" sx={{ p: 0 }} />
          <CustomerActions
            id={product._id}
            slug={product.barcode}
            onEdit={handleEdit}
            onDelete={handleDelete}
            showEdit
            showDelete
            showDetail={false}
          />
        </Box>
        <Divider />

        <CardContent>
          <Grid container spacing={4}>
            {/* Bên trái: Ảnh, mã vạch, thương hiệu, nhà cung cấp */}
            <Grid item xs={12} md={4}>
              <Stack spacing={2}>
                <Paper elevation={2} sx={{ p: 2, borderRadius: 2 }}>
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    width={300}
                    height={300}
                    style={{ borderRadius: '12px', objectFit: 'cover', width: '100%' }}
                  />
                  <Box mt={2} textAlign="center">
                    <Typography fontWeight="bold">Mã vạch:</Typography>
                    <Typography>{product.barcode}</Typography>
                    <Image
                      src={product.barcodeImage}
                      alt="Barcode"
                      width={200}
                      height={50}
                      style={{ marginTop: 8, display: 'inline-block' }}
                    />
                  </Box>
                </Paper>

                <Paper elevation={1} sx={{ p: 2, borderRadius: 2 }}>
                  <Box display="flex" alignItems="center" gap={2}>
                    <Image
                      src={product.category.image}
                      alt="category"
                      width={60}
                      height={60}
                      style={{ borderRadius: '50%' }}
                    />
                    <Box>
                      <Typography fontWeight="bold">Danh mục:</Typography>
                      <Typography>{product.category.name}</Typography>
                      {/* <BrandDescription description={product.brand.description} /> */}
                    </Box>
                  </Box>
                </Paper>

                <Paper elevation={1} sx={{ p: 2, borderRadius: 2 }}>
                  <Box display="flex" alignItems="center" gap={2}>
                    <Image
                      src={product.brand.logo}
                      alt="Brand"
                      width={60}
                      height={60}
                      style={{ borderRadius: '50%' }}
                    />
                    <Box>
                      <Typography fontWeight="bold">Thương hiệu:</Typography>
                      <Typography>{product.brand.name}</Typography>
                      <BrandDescription description={product.brand.description} />
                    </Box>
                  </Box>
                </Paper>

                <Paper elevation={1} sx={{ p: 2, borderRadius: 2 }}>
                  <Typography fontWeight="bold">Nhà cung cấp:</Typography>
                  <Typography>Tên: {product.supplier.name}</Typography>
                  <Typography>Liên hệ: {product.supplier.contact}</Typography>
                  <Typography>Địa chỉ: {product.supplier.address}</Typography>
                </Paper>
              </Stack>
            </Grid>

            {/* Bên phải: Thông tin, mô tả, ảnh khác, biến thể */}
            <Grid item xs={12} md={8}>
              <Stack spacing={3}>
                <Paper elevation={2} sx={{ p: 2, borderRadius: 2 }}>
                  <Typography variant="h5" fontWeight="bold">
                    {product.name}
                  </Typography>
                  <Typography color="primary" fontWeight="bold" mt={1}>
                    Giá: {product.price.toLocaleString()} VNĐ
                  </Typography>
                  <Typography mt={1}>Tồn kho: {product.stock}</Typography>
                  <Box mt={2}>
                    <Typography fontWeight="bold">Mô tả:</Typography>
                    <BrandDescription description={product.description} />
                  </Box>
                </Paper>

                {/* Hình ảnh khác */}
                {product.images.length > 1 && (
                  <Paper elevation={2} sx={{ p: 2, borderRadius: 2 }}>
                    <Typography fontWeight="bold" gutterBottom>
                      Hình ảnh khác:
                    </Typography>
                    <Box display="flex" gap={2} flexWrap="wrap">
                      {product.images.slice(1).map((img, idx) => (
                        <Image
                          key={idx}
                          src={img}
                          alt={`Hình phụ ${idx + 1}`}
                          width={100}
                          height={100}
                          style={{ borderRadius: '8px', objectFit: 'cover' }}
                        />
                      ))}
                    </Box>
                  </Paper>
                )}

                {/* Biến thể */}
                <Typography variant="h6" gutterBottom>
                  🧩 Danh sách biến thể
                </Typography>
                <Grid container spacing={2}>
                  {product.variants.map((variant) => (
                    <Grid item xs={12} md={6} key={variant._id}>
                      <Card
                        variant="outlined"
                        sx={{
                          p: 2,
                          borderRadius: 2,
                          '&:hover': {
                            boxShadow: 3,
                            borderColor: 'primary.light',
                          },
                        }}
                      >
                        <Box display="flex" gap={2}>
                          <Image
                            src={variant.image}
                            alt={variant.name}
                            width={100}
                            height={100}
                            style={{ borderRadius: 12 }}
                          />
                          <Box>
                            <Typography variant="subtitle1" fontWeight="bold">
                              {variant.name}
                            </Typography>
                            {/* <Typography>Giá: {variant.price.toLocaleString()} VNĐ</Typography> */}
                            {/* <Typography>Tồn kho: {variant.stock}</Typography> */}
                            {/* <Box mt={1}>
                              <Typography fontWeight="bold">Mô tả:</Typography>
                              <Typography>{variant.description}</Typography>
                            </Box> */}
                          </Box>
                        </Box>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Stack>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Stack>
  );
}
