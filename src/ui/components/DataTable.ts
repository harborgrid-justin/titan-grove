/**
 * Advanced Data Table Component
 * Superior to Oracle EBS's forms-based tables
 */

export interface TableColumn {
  key: string;
  title: string;
  sortable?: boolean;
  filterable?: boolean;
  width?: string;
  align?: 'left' | 'center' | 'right';
  formatter?: (value: any, row: any) => string;
  editable?: boolean;
}

export interface TableConfig {
  columns: TableColumn[];
  sortable: boolean;
  filterable: boolean;
  paginated: boolean;
  pageSize: number;
  selectable: boolean;
  editable: boolean;
  exportable: boolean;
  responsive: boolean;
}

export interface TableData {
  rows: Record<string, any>[];
  totalCount?: number;
  page?: number;
  pageSize?: number;
}

/**
 * DataTable - Enterprise-grade data table with advanced features
 */
export class DataTable {
  private config: TableConfig;
  private data: TableData | undefined;
  private container: HTMLElement;
  private currentSort: { column: string; direction: 'asc' | 'desc' } | null = null;
  private filters: Record<string, string> = {};
  private selectedRows: Set<number> = new Set();

  constructor(container: HTMLElement, config: TableConfig) {
    this.container = container;
    this.config = {
      ...config,
      sortable: config.sortable ?? true,
      filterable: config.filterable ?? true,
      paginated: config.paginated ?? true,
      pageSize: config.pageSize ?? 25,
      selectable: config.selectable ?? true,
      editable: config.editable ?? false,
      exportable: config.exportable ?? true,
      responsive: config.responsive ?? true,
    };

    this.initializeTable();
  }

  private initializeTable(): void {
    this.container.innerHTML = `
      <div class="titan-table-container">
        <div class="titan-table-header">
          <div class="titan-table-actions">
            <div class="titan-table-search">
              <input type="text" placeholder="Search..." class="titan-search-input">
              <button class="titan-search-btn">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="11" cy="11" r="8"></circle>
                  <path d="m21 21-4.35-4.35"></path>
                </svg>
              </button>
            </div>
            <div class="titan-table-tools">
              <button class="titan-btn titan-btn-secondary" data-action="filter">Filter</button>
              <button class="titan-btn titan-btn-secondary" data-action="export">Export</button>
              <button class="titan-btn titan-btn-primary" data-action="refresh">Refresh</button>
            </div>
          </div>
          <div class="titan-table-info">
            <span class="titan-table-count">0 items</span>
          </div>
        </div>
        
        <div class="titan-table-wrapper">
          <table class="titan-table">
            <thead class="titan-table-head"></thead>
            <tbody class="titan-table-body"></tbody>
          </table>
          
          <div class="titan-table-loading" style="display: none;">
            <div class="titan-spinner"></div>
            <span>Loading data...</span>
          </div>
          
          <div class="titan-table-empty" style="display: none;">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="9" y1="9" x2="15" y2="15"></line>
              <line x1="15" y1="9" x2="9" y2="15"></line>
            </svg>
            <span>No data available</span>
          </div>
        </div>
        
        <div class="titan-table-pagination" style="display: none;">
          <div class="titan-pagination-info">
            Showing <span class="titan-page-start">0</span> to <span class="titan-page-end">0</span> of <span class="titan-total-count">0</span> entries
          </div>
          <div class="titan-pagination-controls">
            <button class="titan-btn titan-btn-sm" data-action="first-page">First</button>
            <button class="titan-btn titan-btn-sm" data-action="prev-page">Previous</button>
            <span class="titan-page-numbers"></span>
            <button class="titan-btn titan-btn-sm" data-action="next-page">Next</button>
            <button class="titan-btn titan-btn-sm" data-action="last-page">Last</button>
          </div>
        </div>
      </div>
    `;

    this.setupStyles();
    this.setupEventListeners();
  }

  private setupStyles(): void {
    const style = document.createElement('style');
    style.textContent = `
      .titan-table-container {
        background: var(--surface);
        border-radius: var(--spacing-2);
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        overflow: hidden;
      }
      
      .titan-table-header {
        padding: var(--spacing-4);
        border-bottom: 1px solid #e2e8f0;
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-wrap: wrap;
        gap: var(--spacing-3);
      }
      
      .titan-table-actions {
        display: flex;
        align-items: center;
        gap: var(--spacing-3);
        flex: 1;
      }
      
      .titan-table-search {
        position: relative;
        display: flex;
        align-items: center;
      }
      
      .titan-search-input {
        padding: var(--spacing-2) var(--spacing-3);
        border: 1px solid #d1d5db;
        border-radius: var(--spacing-1);
        font-size: var(--text-sm);
        min-width: 250px;
      }
      
      .titan-search-btn {
        margin-left: var(--spacing-2);
        padding: var(--spacing-2);
        background: var(--primary);
        color: white;
        border: none;
        border-radius: var(--spacing-1);
        cursor: pointer;
      }
      
      .titan-table-tools {
        display: flex;
        gap: var(--spacing-2);
      }
      
      .titan-btn {
        padding: var(--spacing-2) var(--spacing-3);
        border: 1px solid #d1d5db;
        border-radius: var(--spacing-1);
        font-size: var(--text-sm);
        cursor: pointer;
        transition: all 0.2s;
      }
      
      .titan-btn-primary {
        background: var(--primary);
        color: white;
        border-color: var(--primary);
      }
      
      .titan-btn-secondary {
        background: white;
        color: var(--text-primary);
      }
      
      .titan-btn:hover {
        opacity: 0.9;
        transform: translateY(-1px);
      }
      
      .titan-table-wrapper {
        position: relative;
        overflow-x: auto;
      }
      
      .titan-table {
        width: 100%;
        border-collapse: collapse;
      }
      
      .titan-table th,
      .titan-table td {
        padding: var(--spacing-3);
        text-align: left;
        border-bottom: 1px solid #e2e8f0;
      }
      
      .titan-table th {
        background: #f8fafc;
        font-weight: 600;
        position: sticky;
        top: 0;
        z-index: 10;
      }
      
      .titan-table th.sortable {
        cursor: pointer;
        user-select: none;
      }
      
      .titan-table th.sortable:hover {
        background: #e2e8f0;
      }
      
      .titan-table tr:hover {
        background: #f8fafc;
      }
      
      .titan-table tr.selected {
        background: #eff6ff !important;
      }
      
      .titan-table-loading,
      .titan-table-empty {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: var(--spacing-2);
        color: var(--text-secondary);
        z-index: 20;
      }
      
      .titan-table-pagination {
        padding: var(--spacing-4);
        border-top: 1px solid #e2e8f0;
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-wrap: wrap;
        gap: var(--spacing-3);
      }
      
      .titan-pagination-controls {
        display: flex;
        align-items: center;
        gap: var(--spacing-2);
      }
      
      .titan-page-numbers {
        display: flex;
        gap: var(--spacing-1);
      }
      
      .titan-page-number {
        min-width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 1px solid #d1d5db;
        border-radius: var(--spacing-1);
        cursor: pointer;
        font-size: var(--text-sm);
        background: white;
      }
      
      .titan-page-number.active {
        background: var(--primary);
        color: white;
        border-color: var(--primary);
      }
      
      @media (max-width: 768px) {
        .titan-table-header {
          flex-direction: column;
          align-items: stretch;
        }
        
        .titan-search-input {
          min-width: 200px;
        }
        
        .titan-table-wrapper {
          overflow-x: scroll;
        }
        
        .titan-table-pagination {
          flex-direction: column;
        }
      }
    `;

    if (!document.head.querySelector('#titan-table-styles')) {
      style.id = 'titan-table-styles';
      document.head.appendChild(style);
    }
  }

  private setupEventListeners(): void {
    // Search functionality
    const searchInput = this.container.querySelector('.titan-search-input') as HTMLInputElement;
    const searchBtn = this.container.querySelector('.titan-search-btn') as HTMLButtonElement;

    searchBtn?.addEventListener('click', () => {
      this.handleSearch(searchInput.value);
    });

    searchInput?.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        this.handleSearch(searchInput.value);
      }
    });

    // Action buttons
    this.container.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      const action = target.getAttribute('data-action');

      switch (action) {
        case 'filter':
          this.showFilterDialog();
          break;
        case 'export':
          this.exportData();
          break;
        case 'refresh':
          this.refreshData();
          break;
        case 'first-page':
          this.goToPage(1);
          break;
        case 'prev-page':
          this.goToPreviousPage();
          break;
        case 'next-page':
          this.goToNextPage();
          break;
        case 'last-page':
          this.goToLastPage();
          break;
      }
    });
  }

  public updateData(data: TableData): void {
    this.data = data;
    this.renderTable();
    this.updatePagination();
    this.updateInfo();
  }

  private renderTable(): void {
    this.renderHeader();
    this.renderBody();
  }

  private renderHeader(): void {
    const thead = this.container.querySelector('.titan-table-head') as HTMLElement;
    if (!thead) return;

    let headerHTML = '<tr>';

    if (this.config.selectable) {
      headerHTML += '<th><input type="checkbox" class="titan-select-all"></th>';
    }

    for (const column of this.config.columns) {
      const sortable = column.sortable !== false && this.config.sortable;
      const sortClass = sortable ? 'sortable' : '';
      const sortIcon = this.getSortIcon(column.key);

      headerHTML += `<th class="${sortClass}" data-column="${column.key}" style="width: ${column.width || 'auto'}">
        ${column.title} ${sortIcon}
      </th>`;
    }

    headerHTML += '</tr>';
    thead.innerHTML = headerHTML;

    // Add sort event listeners
    thead.addEventListener('click', (e) => {
      const th = (e.target as HTMLElement).closest('th');
      if (th && th.classList.contains('sortable')) {
        const column = th.getAttribute('data-column');
        if (column) {
          this.handleSort(column);
        }
      }
    });
  }

  private renderBody(): void {
    const tbody = this.container.querySelector('.titan-table-body') as HTMLElement;
    if (!tbody) return;

    if (!this.data || !this.data.rows || this.data.rows.length === 0) {
      this.showEmptyState();
      return;
    }

    let bodyHTML = '';

    for (let i = 0; i < this.data.rows.length; i++) {
      const row = this.data.rows[i];
      const isSelected = this.selectedRows.has(i);
      const rowClass = isSelected ? 'selected' : '';

      bodyHTML += `<tr class="${rowClass}" data-row-index="${i}">`;

      if (this.config.selectable) {
        bodyHTML += `<td><input type="checkbox" ${isSelected ? 'checked' : ''} data-row-index="${i}"></td>`;
      }

      for (const column of this.config.columns) {
        const value = row[column.key];
        const formattedValue = column.formatter ? column.formatter(value, row) : value;
        const alignment = column.align ? `text-align: ${column.align}` : '';

        bodyHTML += `<td style="${alignment}">${formattedValue}</td>`;
      }

      bodyHTML += '</tr>';
    }

    tbody.innerHTML = bodyHTML;

    // Add selection event listeners
    if (this.config.selectable) {
      tbody.addEventListener('change', (e) => {
        const target = e.target as HTMLInputElement;
        if (target.type === 'checkbox') {
          const rowIndex = parseInt(target.getAttribute('data-row-index') || '0');
          this.toggleRowSelection(rowIndex, target.checked);
        }
      });
    }
  }

  private getSortIcon(column: string): string {
    if (this.currentSort?.column === column) {
      return this.currentSort.direction === 'asc' ? '↑' : '↓';
    }
    return '';
  }

  private handleSort(column: string): void {
    if (this.currentSort?.column === column) {
      this.currentSort.direction = this.currentSort.direction === 'asc' ? 'desc' : 'asc';
    } else {
      this.currentSort = { column, direction: 'asc' };
    }

    // TODO: Implement actual sorting
    this.renderTable();
  }

  private handleSearch(query: string): void {
    // TODO: Implement search functionality
    console.log('Searching for:', query);
  }

  private showFilterDialog(): void {
    // TODO: Implement filter dialog
    console.log('Showing filter dialog');
  }

  private exportData(): void {
    // TODO: Implement data export (CSV, Excel, PDF)
    console.log('Exporting data');
  }

  private refreshData(): void {
    this.setLoading(true);
    // TODO: Implement data refresh
    setTimeout(() => {
      this.setLoading(false);
    }, 1000);
  }

  private toggleRowSelection(rowIndex: number, selected: boolean): void {
    if (selected) {
      this.selectedRows.add(rowIndex);
    } else {
      this.selectedRows.delete(rowIndex);
    }

    this.renderTable();
  }

  private goToPage(page: number): void {
    // TODO: Implement pagination
    console.log('Going to page:', page);
  }

  private goToPreviousPage(): void {
    // TODO: Implement previous page
    console.log('Going to previous page');
  }

  private goToNextPage(): void {
    // TODO: Implement next page
    console.log('Going to next page');
  }

  private goToLastPage(): void {
    // TODO: Implement last page
    console.log('Going to last page');
  }

  private updatePagination(): void {
    const pagination = this.container.querySelector('.titan-table-pagination') as HTMLElement;
    if (pagination && this.config.paginated) {
      pagination.style.display = 'flex';
      // TODO: Update pagination controls
    }
  }

  private updateInfo(): void {
    const count = this.container.querySelector('.titan-table-count') as HTMLElement;
    if (count && this.data) {
      count.textContent = `${this.data.rows.length} items`;
    }
  }

  private setLoading(loading: boolean): void {
    const loadingEl = this.container.querySelector('.titan-table-loading') as HTMLElement;
    const tableEl = this.container.querySelector('.titan-table') as HTMLElement;

    if (loadingEl && tableEl) {
      loadingEl.style.display = loading ? 'flex' : 'none';
      tableEl.style.opacity = loading ? '0.5' : '1';
    }
  }

  private showEmptyState(): void {
    const emptyEl = this.container.querySelector('.titan-table-empty') as HTMLElement;
    const tableEl = this.container.querySelector('.titan-table') as HTMLElement;

    if (emptyEl && tableEl) {
      emptyEl.style.display = 'flex';
      tableEl.style.display = 'none';
    }
  }

  public getSelectedRows(): number[] {
    return Array.from(this.selectedRows);
  }

  public clearSelection(): void {
    this.selectedRows.clear();
    this.renderTable();
  }
}
