'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Checkbox from '@mui/material/Checkbox';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { useSelection } from '@/hooks/use-selection';

interface Column {
  id: string;
  render?: (value: any, row?: any) => React.ReactNode;
}

interface DataTableProps {
  count?: number;
  page?: number;
  rows: any[];
  rowsPerPage?: number;
  columnNames: string[];
  columns: Column[];
  onPageChange?: (event: unknown, newPage: number) => void;
  onRowsPerPageChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export function DataTable({
  count = 0,
  rows = [],
  page = 0,
  rowsPerPage = 5,
  columnNames,
  columns,
  onPageChange,
  onRowsPerPageChange,
}: DataTableProps): React.JSX.Element {
  const rowIds = React.useMemo(() => rows.map((row) => row._id || row.id || row.key), [rows]);
  const { selectAll, deselectAll, selectOne, deselectOne, selected } = useSelection(rowIds);

  const selectedSome = selected.size > 0 && selected.size < rows.length;
  const selectedAll = rows.length > 0 && selected.size === rows.length;

  const handlePageChange = (event: unknown, newPage: number) => {
    if (onPageChange) onPageChange(event, newPage);
  };

  return (
    <Card>
      <Box sx={{ overflowX: 'auto' }}>
        <Table sx={{ minWidth: 800 }}>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  checked={selectedAll}
                  indeterminate={selectedSome}
                  onChange={(event) => {
                    if (event.target.checked) selectAll();
                    else deselectAll();
                  }}
                />
              </TableCell>
              {columnNames.map((name, index) => (
                <TableCell key={index}>{name}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, rowIndex) => {
              const rowId = rowIds[rowIndex];
              const isSelected = selected.has(rowId);
              return (
                <TableRow hover key={rowId} selected={isSelected}>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={isSelected}
                      onChange={(event) => {
                        if (event.target.checked) selectOne(rowId);
                        else deselectOne(rowId);
                      }}
                    />
                  </TableCell>
                  {columns.map((column, colIndex) => (
                    <TableCell key={colIndex}>
                      {column.render ? column.render(row[column.id], row) : row[column.id]}
                    </TableCell>
                  ))}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Box>
      <TablePagination
        component="div"
        count={count}
        onPageChange={handlePageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        page={page}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </Card>
  );
}
