'use client';

import React, { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import {
  Avatar,
  Button,
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
  MenuItem,
  Select,
  SelectChangeEvent,
  Checkbox,
  ListItemText,
  IconButton,
  Box,
} from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { toast } from 'react-toastify';
import CloseIcon from '@mui/icons-material/Close';

import { nestApiInstance } from '@/constant/api';
import dynamic from 'next/dynamic';

const Editor = dynamic(() => import('@/components/Editor/editor'), {
  ssr: false, 
});
interface Option {
  _id: string;
  name: string;
}

export default function AddVariant(): React.JSX.Element {
  const [name, setName] = useState('');
  const [price, setPrice] = useState<number>(0);
  const [stock, setStock] = useState<number>(0);
  const [description, setDescription] = useState('');
  const [images, setImages] = useState<File[]>([]);

  const [categories, setCategories] = useState<Option[]>([]);
  const [brands, setBrands] = useState<Option[]>([]);
  const [suppliers, setSuppliers] = useState<Option[]>([]);
  const [variants, setVariants] = useState<Option[]>([]);

  const [category, setCategory] = useState('');
  const [brand, setBrand] = useState('');
  const [supplier, setSupplier] = useState('');
  const [selectedVariants, setSelectedVariants] = useState<string[]>([]);

  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [catRes, brandRes, supplierRes, variantRes] = await Promise.all([
          nestApiInstance.get('/categories'),
          nestApiInstance.get('/brands'),
          nestApiInstance.get('/supplier'),
          nestApiInstance.get('/variant'),
        ]);

        setCategories(catRes.data.data);
        setBrands(brandRes.data.data);
        setSuppliers(supplierRes.data.data);
        setVariants(variantRes.data.data);
      } catch (error) {
        toast.error('Lỗi khi tải dữ liệu danh mục, thương hiệu, nhà cung cấp hoặc biến thể');
        console.error(error);
      }
    };

    fetchOptions();
  }, []);

  const handleEditorChange = (value: string) => {
    setDescription(value);
  };

  const handleImageClick = () => {
    document.getElementById('image-upload-input')?.click();
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;

    const files = Array.from(event.target.files);
    const validFiles = files.filter((file) => file.type.startsWith('image/'));

    if (validFiles.length !== files.length) {
      toast.warning('Một số tệp không phải là ảnh và đã bị bỏ qua.');
    }

    setImages((prev) => [...prev, ...validFiles]);
    event.target.value = '';
  };

  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleVariantsChange = (event: SelectChangeEvent<string[]>) => {
    const value = event.target.value;
    setSelectedVariants(typeof value === 'string' ? value.split(',') : value);
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (!name || !description || images.length === 0 || !category || !brand || !supplier) {
      toast.error('Vui lòng điền đầy đủ các trường bắt buộc và chọn ít nhất một ảnh.');
      return;
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('price', price.toString());
    formData.append('stock', stock.toString());
    formData.append('description', description);
    formData.append('category', category);
    formData.append('brand', brand);
    formData.append('supplier', supplier);
    selectedVariants.forEach((v) => formData.append('variants[]', v));
    images.forEach((img) => formData.append('images', img));

    setLoading(true);
    try {
      const response = await nestApiInstance.post('/product', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response.data.statusCode === 200) {
        toast.success('Thêm biến thể thành công!');
        router.push('/products');
      } else {
        toast.error('Thêm biến thể thất bại');
      }
    } catch (error) {
      console.error('Lỗi khi gửi yêu cầu:', error);
      toast.error('Đã xảy ra lỗi khi thêm biến thể');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Stack spacing={3}>
      <Typography variant="h4">Thêm Sản Phẩm</Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid xs={12}>
            <Card>
              <CardHeader title="Thông tin sản phẩm" subheader="Vui lòng nhập đầy đủ các trường bên dưới" />
              <Divider />
              <CardContent>
                <Stack spacing={3}>
                  {/* Input Tên */}
                  <FormControl fullWidth required>
                    <InputLabel htmlFor="variant-name">Tên sản phẩm</InputLabel>
                    <OutlinedInput
                      id="variant-name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      label="Tên sản phẩm"
                      placeholder="Ví dụ: Sữa bột Vinamilk"
                    />
                  </FormControl>

                  {/* Giá */}
                  <FormControl fullWidth>
                    <InputLabel htmlFor="variant-price">Giá</InputLabel>
                    <OutlinedInput
                      id="variant-price"
                      type="number"
                      value={price}
                      onChange={(e) => setPrice(Number(e.target.value))}
                      label="Giá"
                      placeholder="Nhập giá"
                    />
                  </FormControl>

                  {/* Tồn kho */}
                  <FormControl fullWidth>
                    <InputLabel htmlFor="variant-stock">Tồn kho</InputLabel>
                    <OutlinedInput
                      id="variant-stock"
                      type="number"
                      value={stock}
                      onChange={(e) => setStock(Number(e.target.value))}
                      label="Tồn kho"
                      placeholder="Số lượng tồn"
                    />
                  </FormControl>

                  {/* Danh mục */}
                  <FormControl fullWidth required>
                    <InputLabel id="category-label">Danh mục</InputLabel>
                    <Select
                      labelId="category-label"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      label="Danh mục"
                    >
                      {categories.map((cat) => (
                        <MenuItem key={cat._id} value={cat._id}>
                          {cat.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  {/* Thương hiệu */}
                  <FormControl fullWidth required>
                    <InputLabel id="brand-label">Thương hiệu</InputLabel>
                    <Select
                      labelId="brand-label"
                      value={brand}
                      onChange={(e) => setBrand(e.target.value)}
                      label="Thương hiệu"
                    >
                      {brands.map((b) => (
                        <MenuItem key={b._id} value={b._id}>
                          {b.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  {/* Nhà cung cấp */}
                  <FormControl fullWidth required>
                    <InputLabel id="supplier-label">Nhà cung cấp</InputLabel>
                    <Select
                      labelId="supplier-label"
                      value={supplier}
                      onChange={(e) => setSupplier(e.target.value)}
                      label="Nhà cung cấp"
                    >
                      {suppliers.map((s) => (
                        <MenuItem key={s._id} value={s._id}>
                          {s.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  {/* Biến thể */}
                  <FormControl fullWidth>
                    <InputLabel id="variants-label">Biến thể</InputLabel>
                    <Select
                      labelId="variants-label"
                      multiple
                      value={selectedVariants}
                      onChange={handleVariantsChange}
                      renderValue={(selected) =>
                        variants
                          .filter((v) => selected.includes(v._id))
                          .map((v) => v.name)
                          .join(', ')
                      }
                    >
                      {variants.map((v) => (
                        <MenuItem key={v._id} value={v._id}>
                          <Checkbox checked={selectedVariants.includes(v._id)} />
                          <ListItemText primary={v.name} />
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  {/* Upload Ảnh */}
                  <Stack spacing={1}>
                    <Typography variant="subtitle1" fontWeight={600}>
                      Ảnh sản phẩm
                    </Typography>

                    <Box
                      onClick={handleImageClick}
                      sx={{
                        border: '1px dashed gray',
                        borderRadius: 2,
                        padding: 1,
                        cursor: 'pointer',
                        minHeight: 120,
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                    >
                      {images.length === 0 && (
                        <Typography color="text.secondary">Chưa có ảnh nào được chọn</Typography>
                      )}

                      {images.map((file, index) => (
                        <Box key={index} sx={{ position: 'relative' }}>
                          <Avatar
                            src={URL.createObjectURL(file)}
                            alt={`Ảnh ${index + 1}`}
                            sx={{ width: 100, height: 100 }}
                          />
                          <IconButton
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveImage(index);
                            }}
                            size="small"
                            sx={{
                              position: 'absolute',
                              top: -8,
                              right: -8,
                              bgcolor: 'rgba(255,255,255,0.7)',
                              '&:hover': {
                                bgcolor: 'rgba(255,0,0,0.8)',
                                color: '#fff',
                              },
                            }}
                          >
                            <CloseIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      ))}
                    </Box>

                    <input
                      type="file"
                      id="image-upload-input"
                      accept="image/*"
                      multiple
                      onChange={handleFileChange}
                      style={{ display: 'none' }}
                    />
                  </Stack>

                  {/* Mô tả */}
                  <Stack spacing={1}>
                    <Typography variant="subtitle1" fontWeight={600}>
                      Mô tả
                    </Typography>
                    <Editor value={description} onChange={handleEditorChange} onImageUpload={() => {}} />
                  </Stack>
                </Stack>
              </CardContent>
              <Divider />
              <CardActions>
                <Button type="submit" variant="contained" disabled={loading}>
                  {loading ? 'Đang lưu...' : 'Lưu'}
                </Button>
              </CardActions>
            </Card>
          </Grid>
        </Grid>
      </form>
    </Stack>
  );
}
