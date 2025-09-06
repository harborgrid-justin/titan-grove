import React, { useState, useMemo } from 'react';
import {
  DataTable as CarbonDataTable,
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
  TableSelectAll,
  TableSelectRow,
  TableContainer,
  TableToolbar,
  TableToolbarContent,
  TableToolbarSearch,
  Pagination,
  Button,
  Tag
} from '@carbon/react';
import { Edit, Delete, View } from '@carbon/icons-react';

interface Column {
  key: string;
  label: string;
  type: 'text' | 'number' | 'currency' | 'date' | 'status' | 'actions' | 'checkbox';
}

interface DataTableProps {
  columns: Column[];
  data: any[];
  searchable?: boolean;
  paginated?: boolean;
  onEdit?: (item: any) => void;
  onDelete?: (item: any) => void;
  onView?: (item: any) => void;
}

const DataTable: React.FC<DataTableProps> = ({ 
  columns, 
  data, 
  searchable = false, 
  paginated = false,
  onEdit,
  onDelete,
  onView 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const filteredData = useMemo(() => {
    return searchable
      ? data.filter(row =>
          Object.values(row).some(value =>
            value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
          )
        )
      : data;
  }, [data, searchTerm, searchable]);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return paginated
      ? filteredData.slice(startIndex, startIndex + pageSize)
      : filteredData;
  }, [filteredData, currentPage, pageSize, paginated]);

  const rows = paginatedData.map((item, index) => ({
    id: item.id || index.toString(),
    ...item
  }));

  const headers = columns.filter(col => col.type !== 'actions').map(col => ({
    key: col.key,
    header: col.label
  }));

  const renderCell = (cellValue: any, column: Column) => {
    switch (column.type) {
      case 'currency':
        return new Intl.NumberFormat('en-US', { 
          style: 'currency', 
          currency: 'USD' 
        }).format(cellValue);
      case 'date':
        return new Date(cellValue).toLocaleDateString();
      case 'status':
        const statusType = cellValue === 'active' || cellValue === 'complete' 
          ? 'green' 
          : cellValue === 'pending' || cellValue === 'warning'
          ? 'yellow'
          : 'red';
        return <Tag type={statusType}>{cellValue}</Tag>;
      default:
        return cellValue;
    }
  };

  const renderActions = (row: any) => {
    return (
      <div style={{ display: 'flex', gap: 'var(--cds-spacing-02)' }}>
        {onView && (
          <Button
            kind="ghost"
            size="sm"
            renderIcon={View}
            iconDescription="View"
            onClick={() => onView(row)}
          />
        )}
        {onEdit && (
          <Button
            kind="ghost"
            size="sm"
            renderIcon={Edit}
            iconDescription="Edit"
            onClick={() => onEdit(row)}
          />
        )}
        {onDelete && (
          <Button
            kind="ghost"
            size="sm"
            renderIcon={Delete}
            iconDescription="Delete"
            onClick={() => onDelete(row)}
          />
        )}
      </div>
    );
  };

  return (
    <CarbonDataTable rows={rows} headers={headers}>
      {({
        rows,
        headers,
        getHeaderProps,
        getRowProps,
        getTableProps,
        onInputChange
      }) => (
        <TableContainer title="Data Table">
          {searchable && (
            <TableToolbar>
              <TableToolbarContent>
                <TableToolbarSearch
                  placeholder="Search table..."
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    onInputChange(e);
                  }}
                />
              </TableToolbarContent>
            </TableToolbar>
          )}
          <Table {...getTableProps()}>
            <TableHead>
              <TableRow>
                {headers.map((header) => (
                  <TableHeader {...getHeaderProps({ header })}>
                    {header.header}
                  </TableHeader>
                ))}
                {(onEdit || onDelete || onView) && (
                  <TableHeader>Actions</TableHeader>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <TableRow {...getRowProps({ row })}>
                  {row.cells.map((cell) => {
                    const column = columns.find(col => col.key === cell.info.header);
                    return (
                      <TableCell key={cell.id}>
                        {column ? renderCell(cell.value, column) : cell.value}
                      </TableCell>
                    );
                  })}
                  {(onEdit || onDelete || onView) && (
                    <TableCell>
                      {renderActions(paginatedData[rows.indexOf(row)])}
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {paginated && (
            <Pagination
              page={currentPage}
              totalItems={filteredData.length}
              pageSize={pageSize}
              pageSizes={[5, 10, 20, 50]}
              onChange={({ page, pageSize: newPageSize }) => {
                setCurrentPage(page);
                setPageSize(newPageSize);
              }}
            />
          )}
        </TableContainer>
      )}
    </CarbonDataTable>
  );
};

export default DataTable;