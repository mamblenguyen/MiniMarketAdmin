'use client';

import * as React from 'react';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';
import Editor from '@/components/Editor/editor';
import { nestApiInstance } from '@/constant/api';
import { toast } from 'react-toastify';

export default function Page(): React.JSX.Element {
  const params = useParams();
  const router = useRouter();
  const brandId = params?.id as string | undefined;

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState<File | string | null>(null);
  const [loading, setLoading] = useState(false);

  // Fetch brand data if editing
  useEffect(() => {
    const fetchBrand = async () => {
      if (!brandId) return;

      try {
        const response = await nestApiInstance.get(`/categories/${brandId}`);
        const brand = response.data?.data;
        if (brand) {
          setName(brand.name);
          setDescription(brand.description);
          setImage(`${brand.image}`);
        }
      } catch (error) {
        console.error('Failed to fetch brand:', error);
        alert('Không thể lấy thông tin thương hiệu');
      }
    };

    fetchBrand();
  }, [brandId]);

  const handleEditorChange = (value: string) => {
    setDescription(value);
  };

  const handleImageUpload = (file: File) => {
    console.log('Image uploaded:', file);
  };

  const handleImageClick = () => {
    document.getElementById('image-upload-input')?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const file = event.target.files[0];
      if (file) {
        setImage(file);
      }
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!name || !description || !image) {
      alert('Vui lòng điền đầy đủ thông tin và chọn logo.');
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    if (image instanceof File) {
      formData.append('image', image);
    }

    try {
      let response;
      if (brandId) {
        response = await nestApiInstance.put(`/categories/${brandId}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

      } else {
        response = await nestApiInstance.post(`/categories/`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }

      if (response.data.statusCode === 200) {
        toast.success('Cập nhật danh mục thành công!');
        router.push('/categories');
      } else {
        alert('Thao tác thất bại');
      }
    } catch (error) {
      console.error('Error during request:', error);
      alert('Có lỗi xảy ra khi gửi dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Stack spacing={3}>
      <Typography variant="h4">{brandId ? 'Chỉnh Sửa Thương Hiệu' : 'Thêm Thương Hiệu'}</Typography>
      <Grid container spacing={3}>
        {/* Avatar Upload */}
        <Grid lg={4} md={6} xs={12}>
          <Card>
            <CardContent>
              <Stack spacing={2} sx={{ alignItems: 'center' }}>
                <Avatar
                  sx={{ height: '80px', width: '80px' }}
                  src={image instanceof File ? URL.createObjectURL(image) : image || undefined}
                />
              </Stack>
            </CardContent>
            <Divider />
            <CardActions>
              <Button fullWidth variant="text" onClick={handleImageClick}>
                {image ? 'Thay đổi ảnh' : 'Thêm ảnh'}
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
        </Grid>

        {/* Brand Info Form */}
        <Grid lg={8} md={6} xs={12}>
          <form onSubmit={handleSubmit}>
            <Card>
              <CardHeader
                subheader="Nhập thông tin chi tiết cho thương hiệu"
                title={brandId ? 'Chỉnh Sửa Thương Hiệu' : 'Thêm Thương Hiệu'}
              />
              <Divider />
              <CardContent>
                <Grid spacing={3}>
                  <Grid xs={12}>
                    <FormControl fullWidth required>
                      <InputLabel htmlFor="name">Tên thương hiệu</InputLabel>
                      <OutlinedInput
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Nhập tên thương hiệu"
                        label="Tên thương hiệu"
                      />
                    </FormControl>
                  </Grid>
                  <Grid xs={12}>
                    <InputLabel htmlFor="description">Mô tả</InputLabel>
                    <FormControl fullWidth required>
                      <Editor value={description} onChange={handleEditorChange} onImageUpload={handleImageUpload} />
                    </FormControl>
                  </Grid>
                </Grid>
              </CardContent>
              <Divider />
              <CardActions sx={{ justifyContent: 'flex-end' }}>
                <Button variant="contained" type="submit" disabled={loading}>
                  {loading ? 'Đang lưu...' : brandId ? 'Cập nhật' : 'Lưu thương hiệu'}
                </Button>
              </CardActions>
            </Card>
          </form>
        </Grid>
      </Grid>
    </Stack>
  );
}
