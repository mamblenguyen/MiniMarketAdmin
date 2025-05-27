'use client';

import * as React from 'react';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
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
  IconButton,
  Box,
} from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import CloseIcon from '@mui/icons-material/Close';
import { toast } from 'react-toastify';

import { nestApiInstance } from '@/constant/api';
import Editor from '@/components/Editor/editor';

interface Option {
  _id: string;
  name: string;
}

export default function UpdateProduct(): React.JSX.Element {
  const router = useRouter();
  const params = useParams();
  const productId = params?.id as string | undefined;

  // State sản phẩm
  const [name, setName] = useState('');
  const [price, setPrice] = useState<number>(0);
  const [stock, setStock] = useState<number>(0);
  const [description, setDescription] = useState('');

  // Ảnh cũ: mảng URL string
  const [oldImages, setOldImages] = useState<string[]>([]);

  // Ảnh mới upload: File[]
  const [newImages, setNewImages] = useState<File[]>([]);

  // Options
  const [categories, setCategories] = useState<Option[]>([]);
  const [brands, setBrands] = useState<Option[]>([]);
  const [suppliers, setSuppliers] = useState<Option[]>([]);
  const [variants, setVariants] = useState<Option[]>([]);

  // Selected
  const [category, setCategory] = useState<string>('');
  const [brand, setBrand] = useState<string>('');
  const [supplier, setSupplier] = useState<string>('');
  const [selectedVariants, setSelectedVariants] = useState<string[]>([]);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!productId) {
      toast.error('Không có ID sản phẩm để cập nhật');
      router.push('/products');
      return;
    }

    async function fetchData() {
      try {
        const [productRes, catRes, brandRes, supplierRes, variantRes] = await Promise.all([
          nestApiInstance.get(`/product/${productId}`),
          nestApiInstance.get('/categories'),
          nestApiInstance.get('/brands'),
          nestApiInstance.get('/supplier'),
          nestApiInstance.get('/variant'),
        ]);

        const product = productRes.data.data;

        setName(product.name || '');
        setPrice(product.price || 0);
        setStock(product.stock || 0);
        setDescription(product.description || '');
        setCategory(product.category?._id || '');
        setBrand(product.brand?._id || '');
        setSupplier(product.supplier?._id || '');
        setSelectedVariants(product.variants?.map((v: any) => v._id) || []);

        setOldImages(product.images || []);

        setCategories(catRes.data.data);
        setBrands(brandRes.data.data);
        setSuppliers(supplierRes.data.data);
        setVariants(variantRes.data.data);
      } catch (error) {
        toast.error('Lỗi khi tải dữ liệu sản phẩm hoặc danh mục');
        console.error(error);
      }
    }

    fetchData();
  }, [productId, router]);

  // Editor change
  const handleEditorChange = (value: string) => {
    setDescription(value);
  };

  // Chọn file ảnh mới
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;
    const files = Array.from(event.target.files);
    const validFiles = files.filter((file) => file.type.startsWith('image/'));
    if (validFiles.length !== files.length) {
      toast.warning('Một số tệp không phải là ảnh và đã bị bỏ qua.');
    }
    setNewImages((prev) => [...prev, ...validFiles]);
    event.target.value = ''; // Reset input để có thể chọn file giống lại
  };

  // Xóa ảnh cũ theo URL
  const handleRemoveOldImage = (url: string) => {
    setOldImages((prev) => prev.filter((imgUrl) => imgUrl !== url));
  };
  const handleImageUpload = (file: File) => {
    console.log('Image uploaded:', file);
  };

  // Xóa ảnh mới theo index
  const handleRemoveNewImage = (index: number) => {
    setNewImages((prev) => prev.filter((_, i) => i !== index));
  };

  // Chọn biến thể
  const handleVariantsChange = (event: SelectChangeEvent<typeof selectedVariants>) => {
    const {
      target: { value },
    } = event;
    setSelectedVariants(typeof value === 'string' ? value.split(',') : value);
  };

  // Submit form
 // Submit form
const handleSubmit = async (event: React.FormEvent) => {
  event.preventDefault();

  if (!name || !description || (!oldImages.length && !newImages.length) || !category || !brand || !supplier) {
    toast.error('Vui lòng điền đầy đủ các trường bắt buộc và chọn ít nhất một ảnh.');
    return;
  }

  const formData = new FormData();

  // Trường thông tin cơ bản
  formData.append('name', name);
  formData.append('price', price.toString());
  formData.append('stock', stock.toString());
  formData.append('description', description);
  formData.append('category', category);
  formData.append('brand', brand);
  formData.append('supplier', supplier);

  // Biến thể (variants[])
  selectedVariants.forEach((variantId) => {
    formData.append('variants[]', variantId);
  });

  // Ảnh cũ (dạng URL)
  oldImages.forEach((url) => {
    formData.append('images', url);
  });

  // Ảnh mới (File objects)
  newImages.forEach((file) => {
    formData.append('images', file); // key là `newImages` nếu backend đọc đúng
  });

  setLoading(true);

  try {
    const response = await nestApiInstance.put(`/product/${productId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    if (response.data.statusCode === 200) {
      toast.success('Cập nhật sản phẩm thành công!');
      router.push('/products');
    } else {
      toast.error('Cập nhật sản phẩm thất bại');
    }
  } catch (error) {
    console.error('Lỗi khi gửi yêu cầu cập nhật:', error);
    toast.error('Đã xảy ra lỗi khi cập nhật sản phẩm');
  } finally {
    setLoading(false);
  }
};


  return (
    <Stack spacing={3}>
      <Typography variant="h4">Cập Nhật Sản Phẩm</Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid xs={12}>
            <Card>
              <CardHeader title="Thông tin sản phẩm" subheader="Chỉnh sửa thông tin và ảnh sản phẩm" />
              <Divider />
              <CardContent>
                <Stack spacing={3}>
                  {/* Tên sản phẩm */}
                  <FormControl fullWidth required>
                    <InputLabel htmlFor="product-name">Tên sản phẩm</InputLabel>
                    <OutlinedInput
                      id="product-name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      label="Tên sản phẩm"
                      placeholder="Nhập tên sản phẩm"
                    />
                  </FormControl>

                  {/* Giá */}
                  <FormControl fullWidth>
                    <InputLabel htmlFor="product-price">Giá</InputLabel>
                    <OutlinedInput
                      id="product-price"
                      type="number"
                      value={price}
                      onChange={(e) => setPrice(Number(e.target.value))}
                      label="Giá"
                      placeholder="Nhập giá"
                    />
                  </FormControl>

                  {/* Tồn kho */}
                  <FormControl fullWidth>
                    <InputLabel htmlFor="product-stock">Tồn kho</InputLabel>
                    <OutlinedInput
                      id="product-stock"
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

                  {/* Thương hiệu */}
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

                  {/* Nhà cung cấp */}
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

                  {/* Biến thể (nhiều chọn) */}
                  <FormControl fullWidth>
                    <InputLabel id="variant-label">Biến thể</InputLabel>
                    <Select
                      labelId="variant-label"
                      id="variant"
                      multiple
                      value={selectedVariants}
                      onChange={handleVariantsChange}
                      label="Biến thể"
                      renderValue={(selected) =>
                        variants
                          .filter((v) => selected.includes(v._id))
                          .map((v) => v.name)
                          .join(', ')
                      }
                    >
                      {variants.map((variant) => (
                        <MenuItem key={variant._id} value={variant._id}>
                          {variant.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  {/* Mô tả (Editor rich text) */}
                  <Box>
                    <Typography variant="subtitle1" gutterBottom>
                      Mô tả sản phẩm
                    </Typography>
                       <Editor value={description} onChange={handleEditorChange} onImageUpload={handleImageUpload} />

                  </Box>

                  {/* Ảnh cũ */}
                  <Box>
                    <Typography variant="subtitle1" gutterBottom>
                      Ảnh hiện tại
                    </Typography>
                    <Stack direction="row" spacing={1} flexWrap="wrap">
                      {oldImages.length === 0 && <Typography>Chưa có ảnh nào.</Typography>}
                      {oldImages.map((url) => (
                        <Box
                          key={url}
                          sx={{
                            position: 'relative',
                            width: 120,
                            height: 120,
                            borderRadius: 1,
                            overflow: 'hidden',
                            border: '1px solid #ccc',
                          }}
                        >
                          <IconButton
                            size="small"
                            sx={{
                              position: 'absolute',
                              top: 0,
                              right: 0,
                              bgcolor: 'rgba(255,255,255,0.7)',
                              zIndex: 10,
                            }}
                            onClick={() => handleRemoveOldImage(url)}
                            aria-label="Xóa ảnh cũ"
                          >
                            <CloseIcon fontSize="small" />
                          </IconButton>
                          <img
                            src={url}
                            alt="Ảnh cũ"
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        </Box>
                      ))}
                    </Stack>
                  </Box>

                  {/* Ảnh mới upload */}
                  <Box>
                    <Typography variant="subtitle1" gutterBottom>
                      Ảnh mới (chưa lưu)
                    </Typography>
                    <Stack direction="row" spacing={1} flexWrap="wrap" alignItems="center">
                      {newImages.length === 0 && <Typography>Chưa có ảnh mới nào.</Typography>}
                      {newImages.map((file, index) => {
                        const objectUrl = URL.createObjectURL(file);
                        return (
                          <Box
                            key={file.name + index}
                            sx={{
                              position: 'relative',
                              width: 120,
                              height: 120,
                              borderRadius: 1,
                              overflow: 'hidden',
                              border: '1px solid #ccc',
                            }}
                          >
                            <IconButton
                              size="small"
                              sx={{
                                position: 'absolute',
                                top: 0,
                                right: 0,
                                bgcolor: 'rgba(255,255,255,0.7)',
                                zIndex: 10,
                              }}
                              onClick={() => {
                                handleRemoveNewImage(index);
                                URL.revokeObjectURL(objectUrl);
                              }}
                              aria-label="Xóa ảnh mới"
                            >
                              <CloseIcon fontSize="small" />
                            </IconButton>
                            <img
                              src={objectUrl}
                              alt="Ảnh mới"
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                          </Box>
                        );
                      })}
                      {/* Nút chọn file ảnh mới */}
                      <Button variant="outlined" component="label" sx={{ minWidth: 120, height: 120 }}>
                        Thêm ảnh mới
                        <input
                          hidden
                          accept="image/*"
                          multiple
                          type="file"
                          onChange={handleFileChange}
                        />
                      </Button>
                    </Stack>
                  </Box>
                </Stack>
              </CardContent>
              <Divider />
              <CardActions sx={{ justifyContent: 'flex-end' }}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={loading}
                >
                  {loading ? 'Đang lưu...' : 'Cập nhật sản phẩm'}
                </Button>
              </CardActions>
            </Card>
          </Grid>
        </Grid>
      </form>
    </Stack>
  );
}
