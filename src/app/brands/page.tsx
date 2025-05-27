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

// import BrandDescription from '@/components/Base64/Base64';

const columnNames = ['Logo', 'Tên', 'Thao tác'];

type Brand = {
  _id: string;
  name: string;
  description: string;
  logo: string;
  slug: string;
};

function applyPagination<T>(rows: T[], page: number, rowsPerPage: number): T[] {
  return rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
}

export default function Page(): React.JSX.Element {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [filterText, setFilterText] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const router = useRouter();
  const { setLoading } = useLoading();

  const fetchBrands = async () => {
    try {
      setLoading(true);
      const res = await nestApiInstance.get('/brands/');
      setBrands(res.data.data);
    } catch (err) {
      console.error('Lỗi khi tải dữ liệu brand:', err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchBrands();
  }, []);

  const handleChangePage = (_: unknown, newPage: number) => setPage(newPage);

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleEdit = (id: string) => {
    router.push(`/brands/edit/${id}`);
  };
  const handleDetail = (id: string, slug?: string) => {
    router.push(`/brands/view/${slug}`); // thay bằng route bạn muốn điều hướng tới
  };

  const handleClick = () => {
    router.push('/brands/add'); // thay bằng route bạn muốn điều hướng tới
  };
  const handleDelete = async (id: string) => {
    const confirm = window.confirm(`Xác nhận xoá brand với ID: ${id}?`);
    if (confirm) {
      try {
        const res = await nestApiInstance.delete(`/brands/${id}`);
        toast.success('Xoá thương hiệu thành công!');
        fetchBrands();
      } catch (err) {
        console.error('Lỗi khi tải dữ liệu brand:', err);
      }
    }
  };

  const filteredBrands = brands.filter((brand) => brand.name.toLowerCase().includes(filterText.toLowerCase()));

  const paginatedBrands = applyPagination(filteredBrands, page, rowsPerPage);

  // Component to render brand description

  const columns = [
    {
      id: 'logo',
      render: (logo: string) => <Avatar src={logo} alt="Brand Logo" />,
    },
    { id: 'name' },
    {
      id: 'actions',
      render: (_: any, row: Brand) => (
        <CustomerActions
          id={row._id}
          slug={row.slug} // <-- truyền slug nếu có
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
          <Typography variant="h4">Thương hiệu</Typography>
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
