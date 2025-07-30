'use client';

import * as React from 'react';
import { useState } from 'react';
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
import dynamic from 'next/dynamic';
import { nestApiInstance } from '@/constant/api';

// ✅ Dynamic import Editor (disable SSR)
const Editor = dynamic(() => import('@/components/Editor/editor'), {
  ssr: false,
  loading: () => <div>Đang tải trình soạn thảo...</div>,
});

export default function Page(): React.JSX.Element {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleEditorChange = (value: string) => setDescription(value);

  const handleImageUpload = (file: File) => {
    console.log('Image uploaded:', file);
  };

  const handleImageClick = () => {
    if (typeof window !== 'undefined') {
      document.getElementById('image-upload-input')?.click();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) setImage(file);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!name || !description || !image) {
      alert('Vui lòng điền đầy đủ thông tin và tải lên logo.');
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('logo', image);

    try {
      const response = await nestApiInstance.post(`/brands/`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response.data.statusCode === 200) {
        alert('Thêm thương hiệu thành công');
      } else {
        alert('Thêm thương hiệu thất bại');
      }
    } catch (error) {
      console.error('Lỗi khi gửi dữ liệu:', error);
      alert('Đã xảy ra lỗi khi thêm thương hiệu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Stack spacing={3}>
      <Typography variant="h4">Thêm Thương Hiệu</Typography>
      <Grid container spacing={3}>
        {/* Avatar Upload */}
        <Grid lg={4} md={6} xs={12}>
          <Card>
            <CardContent>
              <Stack spacing={2} sx={{ alignItems: 'center' }}>
                <Avatar
                  sx={{ height: 80, width: 80 }}
                  src={image ? URL.createObjectURL(image) : undefined}
                />
              </Stack>
            </CardContent>
            <Divider />
            <CardActions>
              <Button fullWidth variant="text" onClick={handleImageClick}>
                Thêm ảnh
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

        {/* Form */}
        <Grid lg={8} md={6} xs={12}>
          <form onSubmit={handleSubmit}>
            <Card>
              <CardHeader
                title="Thêm Thương Hiệu"
                subheader="Thêm thương hiệu cho các sản phẩm của bạn"
              />
              <Divider />
              <CardContent>
                <Grid container spacing={3}>
                  <Grid xs={12}>
                    <FormControl fullWidth required>
                      <InputLabel>Tên thương hiệu</InputLabel>
                      <OutlinedInput
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
                      <Editor
                        value={description}
                        onChange={handleEditorChange}
                        onImageUpload={handleImageUpload}
                      />
                    </FormControl>
                  </Grid>
                </Grid>
              </CardContent>
              <Divider />
              <CardActions sx={{ justifyContent: 'flex-end' }}>
                <Button variant="contained" type="submit" disabled={loading}>
                  {loading ? 'Đang lưu...' : 'Lưu thương hiệu'}
                </Button>
              </CardActions>
            </Card>
          </form>
        </Grid>
      </Grid>
    </Stack>
  );
}
