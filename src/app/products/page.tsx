'use client';

import * as React from 'react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { nestApiInstance } from '@/constant/api';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import { toast } from 'react-toastify';

import { CustomerActions } from '@/components/CustomAction/CustomerActions';
import { DataTable } from '@/components/DataTable/DataTable';
import { CustomersFilters } from '@/components/Filter/filer';
import { useLoading } from '@/components/Loading/loading';
import { Product } from '@/types/product';

// import BrandDescription from '@/components/Base64/Base64';

const columnNames = ['Tên', 'Dạng', 'Số lượng', 'Giá', 'Thao tác'];



function applyPagination<T>(rows: T[], page: number, rowsPerPage: number): T[] {
  return rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
}

export default function Page(): React.JSX.Element {
  const [products, setProducts] = useState<Product[]>([]);
  const [filterText, setFilterText] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const router = useRouter();
  const { setLoading } = useLoading();

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await nestApiInstance.get('/product/');
      setProducts(res.data.data);
    } catch (err) {
      console.error('Lỗi khi tải dữ liệu brand:', err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchProducts();
  }, []);

  const handleChangePage = (_: unknown, newPage: number) => setPage(newPage);

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleEdit = (id: string) => {
    router.push(`/products/edit/${id}`);
  };
  const handleDetail = (id: string, slug?: string) => {
    router.push(`/products/view/${slug}`); // thay bằng route bạn muốn điều hướng tới
  };

  const handleClick = () => {
    router.push('/products/add'); // thay bằng route bạn muốn điều hướng tới
  };
  const handleDelete = async (id: string) => {
    const confirm = window.confirm(`Xác nhận xoá brand với ID: ${id}?`);
    if (confirm) {
      try {
        const res = await nestApiInstance.delete(`/product/${id}`);
        toast.success('Xoá thương hiệu thành công!');
        fetchProducts();
      } catch (err) {
        console.error('Lỗi khi tải dữ liệu brand:', err);
      }
    }
  };

  const filteredBrands = products.filter((products) => products.name.toLowerCase().includes(filterText.toLowerCase()));

  const paginatedBrands = applyPagination(filteredBrands, page, rowsPerPage);

  // Component to render brand description

 const columns = [
  { id: 'name' },
  {
    id: 'variants.name',
    header: 'Biến thể',
    render: (_: any, row: Product) => (
      <span>
        {row.variants.map(variant => variant.name).join(', ')}
      </span>
    ),
  },
  { id: 'stock' },
  { id: 'price' },
  {
    id: 'actions',
    render: (_: any, row: Product) => (
      <CustomerActions
        id={row._id}
        slug={row.barcode}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onDetail={handleDetail}
        showEdit={true}
        showDelete={true}
        showDetail={true}
      />
    ),
  },
];


  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={3}>
        <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
          <Typography variant="h4">Nhà cung ứng</Typography>
        </Stack>
        <div>
          <Button startIcon={<PlusIcon fontSize="inherit" />} variant="contained" onClick={handleClick}>
            Thêm
          </Button>
        </div>
      </Stack>

      <CustomersFilters onSearch={(value) => setFilterText(value)} />

      <DataTable
        count={filteredBrands.length}
        page={page}
        rows={paginatedBrands}
        rowsPerPage={rowsPerPage}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        columnNames={columnNames}
        columns={columns}
      />
    </Stack>
  );
}
