'use client';

import * as React from 'react';
import { useEffect, useState } from 'react';
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
} from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { toast } from 'react-toastify';

import { nestApiInstance } from '@/constant/api';
import Editor from '@/components/Editor/editor';

export default function EditVariant(): React.JSX.Element {
  const router = useRouter();
  const { id: variantId } = useParams();

  const [name, setName] = useState('');
  const [price, setPrice] = useState<number>(0);
  const [stock, setStock] = useState<number>(0);
  const [description, setDescription] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState(''); // Preview ảnh cũ
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (variantId) {
      fetchVariantData();
    }
  }, [variantId]);

  const fetchVariantData = async () => {
    try {
      const response = await nestApiInstance.get(`/variant/${variantId}`);
      const data = response.data.data;

      setName(data.name || '');
      setPrice(data.price || 0);
      setStock(data.stock || 0);
      setDescription(data.description || '');
      setPreview(data.image || '');
    } catch (error) {
      console.error('Lỗi khi tải dữ liệu:', error);
      toast.error('Không thể tải thông tin biến thể');
    }
  };

  const handleEditorChange = (value: string) => setDescription(value);

  const handleImageClick = () => {
    document.getElementById('image-upload-input')?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    } else {
      toast.error('Vui lòng chọn một tệp ảnh hợp lệ');
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!name || !description) {
      toast.error('Vui lòng điền đầy đủ các trường bắt buộc.');
      return;
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('price', price.toString());
    formData.append('stock', stock.toString());
    formData.append('description', description);
    if (image) {
      formData.append('image', image);
    }

    setLoading(true);
    try {
      const response = await nestApiInstance.put(`/variant/${variantId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response.data.statusCode === 200) {
        toast.success('Cập nhật biến thể thành công!');
        router.push('/variant');
      } else {
        toast.error('Cập nhật thất bại');
      }
    } catch (error) {
      console.error('Lỗi khi gửi yêu cầu:', error);
      toast.error('Đã xảy ra lỗi khi cập nhật biến thể');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Stack spacing={3}>
      <Typography variant="h4">Chỉnh Sửa Biến Thể</Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid xs={12}>
            <Card>
              <CardHeader title="Thông tin biến thể" subheader="Cập nhật thông tin bên dưới" />
              <Divider />
              <CardContent>
                <Stack spacing={3}>
                  <FormControl fullWidth required>
                    <InputLabel htmlFor="variant-name">Tên biến thể</InputLabel>
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

                  <Stack spacing={1}>
                    <Typography variant="subtitle1" fontWeight={600}>
                      Mô tả <span style={{ color: 'red' }}>*</span>
                    </Typography>
                    <Editor
                      value={description}
                      onChange={handleEditorChange}
                      onImageUpload={(file) => console.log('Editor image:', file)}
                    />
                  </Stack>

                  <Stack spacing={1}>
                    <Typography variant="subtitle1" fontWeight={600}>
                      Ảnh sản phẩm
                    </Typography>
                    <Card variant="outlined">
                      <CardContent>
                        <Stack spacing={2} alignItems="center">
                          <Avatar
                            sx={{ width: 100, height: 100 }}
                            src={preview}
                            alt="Ảnh biến thể"
                          />
                        </Stack>
                      </CardContent>
                      <Divider />
                      <CardActions>
                        <Button fullWidth variant="outlined" onClick={handleImageClick}>
                          {image || preview ? 'Thay đổi ảnh' : 'Thêm ảnh'}
                        </Button>
                        <input
                          type="file"
                          id="image-upload-input"
                          accept="image/*"
                          onChange={handleFileChange}
                          style={{ display: 'none' }}
                        />
                      </CardActions>
                    </Card>
                  </Stack>
                </Stack>
              </CardContent>
              <Divider />
              <CardActions sx={{ justifyContent: 'flex-end' }}>
                <Button type="submit" variant="contained" disabled={loading}>
                  {loading ? 'Đang cập nhật...' : 'Lưu thay đổi'}
                </Button>
              </CardActions>
            </Card>
          </Grid>
        </Grid>
      </form>
    </Stack>
  );
}
