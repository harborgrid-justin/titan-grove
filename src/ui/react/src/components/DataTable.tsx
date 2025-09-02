import React, { useState } from 'react';

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
}

const DataTable: React.FC<DataTableProps> = ({ columns, data, searchable = false, paginated = false }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const rowsPerPage = 10;

  const filteredData = searchable
    ? data.filter(row =>
        Object.values(row).some(value =>
          value.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
    : data;

  const paginatedData = paginated
    ? filteredData.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage)
    : filteredData;

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  const handleRowSelect = (index: number) => {
    const newSelected = new Set(selectedRows);
    if (newSelected.has(index)) {
      newSelected.delete(index);
    } else {
      newSelected.add(index);
    }
    setSelectedRows(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedRows.size === paginatedData.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(paginatedData.map((_, index) => index)));
    }
  };

  const renderCell = (row: any, column: Column, rowIndex: number) => {
    switch (column.type) {
      case 'checkbox':
        return (
          <input
            type="checkbox"
            checked={selectedRows.has(rowIndex)}
            onChange={() => handleRowSelect(rowIndex)}
          />
        );
      case 'status':
        return (
          <span className={`titan-status-indicator titan-status-${row.statusClass || 'success'}`}>
            {row[column.key]}
          </span>
        );
      case 'actions':
        return (
          <button className="titan-btn titan-btn-sm">
            View Details
          </button>
        );
      case 'currency':
        return <strong>{row[column.key]}</strong>;
      default:
        return row[column.key];
    }
  };

  return (
    <div className="titan-table">
      {searchable && (
        <div style={{ padding: 'var(--spacing-4)', borderBottom: '1px solid #e2e8f0' }}>
          <input
            type="text"
            placeholder="Search orders..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              padding: '8px 12px',
              border: '1px solid #e2e8f0',
              borderRadius: '6px',
              fontSize: '14px',
              width: '300px',
              fontFamily: 'var(--font-primary)'
            }}
          />
        </div>
      )}

      <table>
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.key}>
                {column.type === 'checkbox' ? (
                  <input
                    type="checkbox"
                    checked={selectedRows.size === paginatedData.length && paginatedData.length > 0}
                    onChange={handleSelectAll}
                  />
                ) : (
                  column.label
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {paginatedData.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {columns.map((column) => (
                <td key={column.key}>
                  {renderCell(row, column, rowIndex)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {paginated && totalPages > 1 && (
        <div style={{
          padding: 'var(--spacing-4)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderTop: '1px solid #e2e8f0'
        }}>
          <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
            Showing {((currentPage - 1) * rowsPerPage) + 1} to {Math.min(currentPage * rowsPerPage, filteredData.length)} of {filteredData.length} entries
          </div>
          <div style={{ display: 'flex', gap: 'var(--spacing-2)', alignItems: 'center' }}>
            <button
              className="titan-btn titan-btn-sm"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(1)}
            >
              First
            </button>
            <button
              className="titan-btn titan-btn-sm"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              Previous
            </button>
            <span style={{ display: 'flex', gap: 'var(--spacing-1)' }}>
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                const page = currentPage <= 3 ? i + 1 : currentPage - 2 + i;
                if (page <= totalPages) {
                  return (
                    <button
                      key={page}
                      className={`titan-btn titan-btn-sm ${page === currentPage ? 'active' : ''}`}
                      onClick={() => setCurrentPage(page)}
                      style={{
                        background: page === currentPage ? 'var(--primary)' : 'var(--surface)',
                        color: page === currentPage ? 'white' : 'var(--text-primary)'
                      }}
                    >
                      {page}
                    </button>
                  );
                }
                return null;
              })}
            </span>
            <button
              className="titan-btn titan-btn-sm"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              Next
            </button>
            <button
              className="titan-btn titan-btn-sm"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(totalPages)}
            >
              Last
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataTable;