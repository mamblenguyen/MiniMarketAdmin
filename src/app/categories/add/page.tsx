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
import Editor from '@/components/Editor/editor';
import { nestApiInstance } from '@/constant/api';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { useLoading } from '@/components/Loading/loading';

export default function Page(): React.JSX.Element {
  const [name, setName] = useState(''); // Brand name
  const [description, setDescription] = useState(''); // Brand description
  const [image, setImage] = useState<File | null>(null); // Logo image
 const router = useRouter();
  const { setLoading } = useLoading();

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
      alert('Please fill in all fields and upload a logo.');
      return;
    }
    setLoading(true);
    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('image', image);
    try {
      const response = await nestApiInstance.post(`/categories/`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
      if (response.data.statusCode === 200) {
        router.push(`/categories`);
        toast.success('Thêm danh mục thành công!');
      } else {
        console.error('Failed to add brand');
        alert('Failed to add brand');
      }
    } catch (error) {
      console.error('Error during the request:', error);
      toast.success('Thêm danh mục thất bại!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Stack spacing={3}>
      <div>
        <Typography variant="h4">Danh mục</Typography>
      </div>
      <Grid container spacing={3}>
        <Grid lg={4} md={6} xs={12}>
          <Card>
            <CardContent>
              <Stack spacing={2} sx={{ alignItems: 'center' }}>
                <div>
                  <Avatar sx={{ height: '80px', width: '80px' }} src={image ? URL.createObjectURL(image) : undefined} />
                </div>
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
        <Grid lg={8} md={6} xs={12}>
          <form onSubmit={handleSubmit}>
            <Card>
              <CardHeader subheader="Thêm danh mục cho các sản phẩm của bạn" title="Thêm danh mục" />
              <Divider />
              <CardContent>
                <Grid spacing={3}>
                  <Grid xs={12}>
                    <FormControl fullWidth required>
                      <InputLabel>Tên danh mục</InputLabel>
                      <OutlinedInput
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Nhập tên thương hiệu"
                        label="name"
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
                <Button variant="contained" type="submit" >
                 Lưu
                </Button>
              </CardActions>
            </Card>
          </form>
        </Grid>
      </Grid>
    </Stack>
  );
}
