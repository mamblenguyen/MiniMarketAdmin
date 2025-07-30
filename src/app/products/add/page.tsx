'use client';

import * as React from 'react';
import { useState, useEffect } from 'react';
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
import Editor from '@/components/Editor/editor';

interface Option {
  _id: string;
  name: string;
}

export default function AddVariant(): React.JSX.Element {
  const [name, setName] = useState('');
  const [price, setPrice] = useState<number>(0);
  const [stock, setStock] = useState<number>(0);
  const [description, setDescription] = useState('');

  // images là mảng File, hỗ trợ nhiều ảnh
  const [images, setImages] = useState<File[]>([]);

  const [categories, setCategories] = useState<Option[]>([]);
  const [brands, setBrands] = useState<Option[]>([]);
  const [suppliers, setSuppliers] = useState<Option[]>([]);
  const [variants, setVariants] = useState<Option[]>([]);

  const [category, setCategory] = useState<string>('');
  const [brand, setBrand] = useState<string>('');
  const [supplier, setSupplier] = useState<string>('');
  const [selectedVariants, setSelectedVariants] = useState<string[]>([]);

  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function fetchOptions() {
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
    }

    fetchOptions();
  }, []);
 const handleImageUpload = (file: File) => {
    console.log('Image uploaded:', file);
  };

  const handleEditorChange = (value: string) => {
    setDescription(value);
  };

  const handleImageClick = () => {
    document.getElementById('image-upload-input')?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;

    // Lấy tất cả file ảnh mới được chọn
    const files = Array.from(event.target.files);
    // Lọc file phải là ảnh
    const validFiles = files.filter((file) => file.type.startsWith('image/'));

    if (validFiles.length !== files.length) {
      toast.warning('Một số tệp không phải là ảnh và đã bị bỏ qua.');
    }

    // Mình sẽ gộp ảnh mới vào ảnh hiện có (append), không thay thế
    setImages((prev) => [...prev, ...validFiles]);

    // Clear input để có thể chọn lại cùng file nếu muốn
    event.target.value = '';
  };

  // Xoá ảnh đã chọn khỏi mảng
  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleVariantsChange = (event: SelectChangeEvent<typeof selectedVariants>) => {
    const {
      target: { value },
    } = event;
    setSelectedVariants(typeof value === 'string' ? value.split(',') : value);
  };

  const handleSubmit = async (event: React.FormEvent) => {
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

    // Thêm tất cả ảnh vào formData với key 'images'
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
                  <FormControl fullWidth required>
                    <InputLabel htmlFor="variant-name">Tên sản phẩm</InputLabel>
                    <OutlinedInput
                      id="variant-name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      label="Tên biến thể"
                      placeholder="Ví dụ: Tuýp, Hộp, Lọ..."
                    />
                  </FormControl>

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

                  <FormControl fullWidth required>
                    <InputLabel id="category-label">Danh mục</InputLabel>
                    <Select
                      labelId="category-label"
                      id="category"
                      value={category}
                      label="Danh mục"
                      onChange={(e) => setCategory(e.target.value)}
                    >
                      {categories.map((cat) => (
                        <MenuItem key={cat._id} value={cat._id}>
                          {cat.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <FormControl fullWidth required>
                    <InputLabel id="brand-label">Thương hiệu</InputLabel>
                    <Select
                      labelId="brand-label"
                      id="brand"
                      value={brand}
                      label="Thương hiệu"
                      onChange={(e) => setBrand(e.target.value)}
                    >
                      {brands.map((b) => (
                        <MenuItem key={b._id} value={b._id}>
                          {b.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <FormControl fullWidth required>
                    <InputLabel id="supplier-label">Nhà cung cấp</InputLabel>
                    <Select
                      labelId="supplier-label"
                      id="supplier"
                      value={supplier}
                      label="Nhà cung cấp"
                      onChange={(e) => setSupplier(e.target.value)}
                    >
                      {suppliers.map((s) => (
                        <MenuItem key={s._id} value={s._id}>
                          {s.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <FormControl fullWidth>
                    <InputLabel id="variants-label">Biến thể</InputLabel>
                    <Select
                      labelId="variants-label"
                      id="variants"
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
                          <Checkbox checked={selectedVariants.indexOf(v._id) > -1} />
                          <ListItemText primary={v.name} />
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <Stack spacing={1}>
                    <Typography variant="subtitle1" fontWeight={600}>
                      Ảnh sản phẩm (bấm để chọn nhiều ảnh)
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
                            alt={`Ảnh sản phẩm ${index + 1}`}
                            sx={{ width: 100, height: 100, cursor: 'pointer' }}
                          />
                          <IconButton
                            aria-label="remove image"
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation(); // tránh kích hoạt chọn file
                              handleRemoveImage(index);
                            }}
                            sx={{
                              position: 'absolute',
                              top: -8,
                              right: -8,
                              bgcolor: 'rgba(255,255,255,0.7)',
                              '&:hover': { bgcolor: 'rgba(255,0,0,0.8)', color: 'white' },
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

                  <Stack spacing={1}>
                    <Typography variant="subtitle1" fontWeight={600}>
                      Mô tả
                    </Typography>
                      <Editor value={description} onChange={handleEditorChange} onImageUpload={handleImageUpload} />
                  </Stack>
                </Stack>
              </CardContent>
              <Divider />
              <CardActions>
                <Button
                  variant="contained"
                  type="submit"
                  disabled={loading}
                  color="primary"
                >
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
