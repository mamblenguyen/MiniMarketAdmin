import * as React from 'react';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import VisibilityIcon from '@mui/icons-material/Visibility';
import SettingsIcon from '@mui/icons-material/Settings';
import DeleteIcon from '@mui/icons-material/Delete';

interface CustomerActionsProps {
  id: string;
  slug?: string;
  onEdit?: (id: string, slug?: string) => void;
  onDelete?: (id: string, slug?: string) => void;
  onDetail?: (id: string, slug?: string) => void;
  showEdit?: boolean;
  showDelete?: boolean;
  showDetail?: boolean;
}

export const CustomerActions: React.FC<CustomerActionsProps> = ({
  id,
  slug,
  onEdit,
  onDelete,
  onDetail,
  showEdit = true,
  showDelete = true,
  showDetail = true,
}) => {
  return (
    <Stack direction="row" spacing={1}>
      {showDetail && onDetail && (
        <IconButton color="primary" onClick={() => onDetail(id, slug)} title="Chi tiết">
          <VisibilityIcon />
        </IconButton>
      )}
      {showEdit && onEdit && (
        <IconButton color="info" onClick={() => onEdit(id, slug)} title="Chỉnh sửa">
          <SettingsIcon />
        </IconButton>
      )}
      {showDelete && onDelete && (
        <IconButton color="error" onClick={() => onDelete(id, slug)} title="Xóa">
          <DeleteIcon />
        </IconButton>
      )}
    </Stack>
  );
};
