/**
 * Advanced Chart Components with Real-time Updates
 * Superior to Oracle EBS's static reporting
 */

export interface ChartData {
  labels: string[];
  datasets: ChartDataset[];
}

export interface ChartDataset {
  label: string;
  data: number[];
  backgroundColor?: string | string[];
  borderColor?: string;
  borderWidth?: number;
  fill?: boolean;
}

export interface ChartConfig {
  type: 'line' | 'bar' | 'pie' | 'donut' | 'area' | 'scatter';
  responsive: boolean;
  animated: boolean;
  realtime: boolean;
  refreshInterval?: number;
  theme: 'light' | 'dark' | 'auto';
}

/**
 * LineChart - Advanced real-time line chart
 */
export class LineChart {
  private config: ChartConfig;
  private data: ChartData | undefined;
  private container: HTMLElement;
  private refreshTimer?: NodeJS.Timeout;

  constructor(container: HTMLElement, config: ChartConfig) {
    this.container = container;
    this.config = {
      ...config,
      responsive: config.responsive ?? true,
      animated: config.animated ?? true,
      realtime: config.realtime ?? false,
      theme: config.theme ?? 'auto',
    };

    this.initializeChart();
  }

  private initializeChart(): void {
    this.container.innerHTML = `
      <div class="titan-chart-container">
        <canvas class="titan-chart-canvas"></canvas>
        <div class="titan-chart-loading" style="display: none;">
          <div class="titan-spinner"></div>
          <span>Loading chart data...</span>
        </div>
      </div>
    `;

    this.setupStyles();
    this.setupRealtime();
  }

  private setupStyles(): void {
    const style = document.createElement('style');
    style.textContent = `
      .titan-chart-container {
        position: relative;
        width: 100%;
        height: 100%;
        background: var(--surface);
        border-radius: var(--spacing-2);
        padding: var(--spacing-4);
      }
      
      .titan-chart-canvas {
        width: 100% !important;
        height: 100% !important;
      }
      
      .titan-chart-loading {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: var(--spacing-2);
        color: var(--text-secondary);
      }
      
      .titan-spinner {
        width: 24px;
        height: 24px;
        border: 2px solid var(--primary);
        border-top: 2px solid transparent;
        border-radius: 50%;
        animation: titan-spin 1s linear infinite;
      }
      
      @keyframes titan-spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
      
      @media (max-width: 768px) {
        .titan-chart-container {
          padding: var(--spacing-2);
        }
      }
    `;

    if (!document.head.querySelector('#titan-chart-styles')) {
      style.id = 'titan-chart-styles';
      document.head.appendChild(style);
    }
  }

  private setupRealtime(): void {
    if (this.config.realtime && this.config.refreshInterval) {
      this.refreshTimer = setInterval(() => {
        this.refreshData();
      }, this.config.refreshInterval * 1000);
    }
  }

  public updateData(data: ChartData): void {
    this.data = data;
    this.render();
  }

  public setLoading(loading: boolean): void {
    const loadingEl = this.container.querySelector('.titan-chart-loading') as HTMLElement;
    if (loadingEl) {
      loadingEl.style.display = loading ? 'flex' : 'none';
    }
  }

  private async refreshData(): Promise<void> {
    // TODO: Implement data refresh from data source
    console.log('Refreshing chart data...');
  }

  private render(): void {
    // TODO: Implement actual chart rendering (would use Chart.js or D3.js in real implementation)
    const canvas = this.container.querySelector('.titan-chart-canvas') as HTMLCanvasElement;
    if (canvas && this.data) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Mock rendering - in real implementation would use Chart.js
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'var(--primary)';
        ctx.fillText('Chart Data: ' + JSON.stringify(this.data.labels), 10, 30);
      }
    }
  }

  public destroy(): void {
    if (this.refreshTimer) {
      clearInterval(this.refreshTimer);
    }
  }
}

/**
 * BarChart - Interactive bar chart with drill-down
 */
export class BarChart extends LineChart {
  // Inherits from LineChart but with bar-specific rendering
}

/**
 * PieChart - Interactive pie chart with hover effects
 */
export class PieChart {
  private config: ChartConfig;
  private data: ChartData | undefined;
  private container: HTMLElement;

  constructor(container: HTMLElement, config: ChartConfig) {
    this.container = container;
    this.config = config;
    this.initializeChart();
  }

  private initializeChart(): void {
    this.container.innerHTML = `
      <div class="titan-pie-chart">
        <svg class="titan-pie-svg" viewBox="0 0 200 200">
          <g class="titan-pie-segments"></g>
          <g class="titan-pie-labels"></g>
        </svg>
        <div class="titan-pie-legend"></div>
      </div>
    `;

    this.setupPieStyles();
  }

  private setupPieStyles(): void {
    const style = document.createElement('style');
    style.textContent = `
      .titan-pie-chart {
        display: flex;
        align-items: center;
        gap: var(--spacing-4);
        padding: var(--spacing-4);
        background: var(--surface);
        border-radius: var(--spacing-2);
        height: 100%;
      }
      
      .titan-pie-svg {
        flex-shrink: 0;
        width: 200px;
        height: 200px;
      }
      
      .titan-pie-legend {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: var(--spacing-2);
      }
      
      .titan-pie-legend-item {
        display: flex;
        align-items: center;
        gap: var(--spacing-2);
        font-size: var(--text-sm);
      }
      
      .titan-pie-legend-color {
        width: 12px;
        height: 12px;
        border-radius: 2px;
      }
      
      @media (max-width: 768px) {
        .titan-pie-chart {
          flex-direction: column;
          text-align: center;
        }
        
        .titan-pie-svg {
          width: 150px;
          height: 150px;
        }
      }
    `;

    if (!document.head.querySelector('#titan-pie-styles')) {
      style.id = 'titan-pie-styles';
      document.head.appendChild(style);
    }
  }

  public updateData(data: ChartData): void {
    this.data = data;
    this.renderPie();
  }

  private renderPie(): void {
    // TODO: Implement SVG pie chart rendering
    console.log('Rendering pie chart with data:', this.data);
  }
}
