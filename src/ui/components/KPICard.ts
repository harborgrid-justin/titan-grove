/**
 * KPI Card Component - Real-time metrics display
 * Superior to Oracle EBS's static reporting
 */

export interface KPIData {
  title: string;
  value: number | string;
  previousValue?: number | string;
  unit?: string;
  format?: 'currency' | 'percentage' | 'number' | 'decimal';
  trend?: 'up' | 'down' | 'stable';
  trendValue?: number;
  target?: number;
  status?: 'success' | 'warning' | 'error' | 'info';
}

export interface KPIConfig {
  realtime: boolean;
  animated: boolean;
  showTrend: boolean;
  showTarget: boolean;
  refreshInterval?: number;
  theme: 'light' | 'dark' | 'auto';
}

/**
 * KPICard - Interactive KPI display with real-time updates
 */
export class KPICard {
  private config: KPIConfig;
  private data: KPIData | undefined;
  private container: HTMLElement;
  private refreshTimer?: NodeJS.Timeout;
  private animationFrame?: number;

  constructor(container: HTMLElement, config: KPIConfig) {
    this.container = container;
    this.config = {
      ...config,
      realtime: true,
      animated: true,
      showTrend: true,
      showTarget: true,
      theme: 'auto'
    };
    
    this.initializeCard();
  }

  private initializeCard(): void {
    this.container.innerHTML = `
      <div class="titan-kpi-card">
        <div class="titan-kpi-header">
          <h3 class="titan-kpi-title"></h3>
          <div class="titan-kpi-status"></div>
        </div>
        
        <div class="titan-kpi-main">
          <div class="titan-kpi-value-container">
            <span class="titan-kpi-value" data-value="0">0</span>
            <span class="titan-kpi-unit"></span>
          </div>
          
          <div class="titan-kpi-trend">
            <span class="titan-kpi-trend-icon"></span>
            <span class="titan-kpi-trend-value"></span>
            <span class="titan-kpi-trend-label">vs previous</span>
          </div>
        </div>
        
        <div class="titan-kpi-footer">
          <div class="titan-kpi-target">
            <span class="titan-kpi-target-label">Target</span>
            <span class="titan-kpi-target-value"></span>
          </div>
          
          <div class="titan-kpi-progress">
            <div class="titan-kpi-progress-bar">
              <div class="titan-kpi-progress-fill"></div>
            </div>
            <span class="titan-kpi-progress-text">0%</span>
          </div>
        </div>
        
        <div class="titan-kpi-loading" style="display: none;">
          <div class="titan-spinner-sm"></div>
        </div>
      </div>
    `;

    this.setupStyles();
    this.setupRealtime();
  }

  private setupStyles(): void {
    const style = document.createElement('style');
    style.textContent = `
      .titan-kpi-card {
        background: var(--surface);
        border-radius: var(--spacing-3);
        padding: var(--spacing-4);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        position: relative;
        transition: all 0.3s ease;
        height: 100%;
        display: flex;
        flex-direction: column;
        min-height: 200px;
      }
      
      .titan-kpi-card:hover {
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
        transform: translateY(-2px);
      }
      
      .titan-kpi-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: var(--spacing-3);
      }
      
      .titan-kpi-title {
        font-size: var(--text-sm);
        font-weight: 600;
        color: var(--text-secondary);
        margin: 0;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }
      
      .titan-kpi-status {
        width: 12px;
        height: 12px;
        border-radius: 50%;
        background: var(--success);
      }
      
      .titan-kpi-status.warning { background: var(--warning); }
      .titan-kpi-status.error { background: var(--error); }
      .titan-kpi-status.info { background: var(--info); }
      
      .titan-kpi-main {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
      }
      
      .titan-kpi-value-container {
        display: flex;
        align-items: baseline;
        gap: var(--spacing-2);
        margin-bottom: var(--spacing-2);
      }
      
      .titan-kpi-value {
        font-size: 2.5rem;
        font-weight: 700;
        color: var(--text-primary);
        line-height: 1;
        transition: all 0.5s ease;
      }
      
      .titan-kpi-unit {
        font-size: var(--text-lg);
        color: var(--text-secondary);
        font-weight: 500;
      }
      
      .titan-kpi-trend {
        display: flex;
        align-items: center;
        gap: var(--spacing-1);
        font-size: var(--text-sm);
        color: var(--text-secondary);
      }
      
      .titan-kpi-trend-icon {
        width: 16px;
        height: 16px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      
      .titan-kpi-trend-icon::before {
        content: '→';
        font-size: 14px;
      }
      
      .titan-kpi-trend.up .titan-kpi-trend-icon::before {
        content: '↗';
        color: var(--success);
      }
      
      .titan-kpi-trend.down .titan-kpi-trend-icon::before {
        content: '↘';
        color: var(--error);
      }
      
      .titan-kpi-trend.up .titan-kpi-trend-value {
        color: var(--success);
      }
      
      .titan-kpi-trend.down .titan-kpi-trend-value {
        color: var(--error);
      }
      
      .titan-kpi-footer {
        margin-top: auto;
        padding-top: var(--spacing-3);
        border-top: 1px solid #e2e8f0;
      }
      
      .titan-kpi-target {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: var(--text-xs);
        color: var(--text-secondary);
        margin-bottom: var(--spacing-2);
      }
      
      .titan-kpi-target-value {
        font-weight: 600;
        color: var(--text-primary);
      }
      
      .titan-kpi-progress {
        display: flex;
        align-items: center;
        gap: var(--spacing-2);
      }
      
      .titan-kpi-progress-bar {
        flex: 1;
        height: 6px;
        background: #e2e8f0;
        border-radius: 3px;
        overflow: hidden;
      }
      
      .titan-kpi-progress-fill {
        height: 100%;
        background: linear-gradient(90deg, var(--primary), var(--accent));
        border-radius: 3px;
        transition: width 1s ease;
        width: 0%;
      }
      
      .titan-kpi-progress-text {
        font-size: var(--text-xs);
        font-weight: 600;
        color: var(--text-primary);
        min-width: 35px;
        text-align: right;
      }
      
      .titan-kpi-loading {
        position: absolute;
        top: var(--spacing-2);
        right: var(--spacing-2);
      }
      
      .titan-spinner-sm {
        width: 16px;
        height: 16px;
        border: 2px solid var(--primary);
        border-top: 2px solid transparent;
        border-radius: 50%;
        animation: titan-spin 1s linear infinite;
      }
      
      @keyframes titan-spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
      
      @keyframes titan-pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.7; }
      }
      
      @keyframes titan-counter {
        from { transform: scale(1.1); }
        to { transform: scale(1); }
      }
      
      .titan-kpi-value.updating {
        animation: titan-counter 0.3s ease-out;
      }
      
      @media (max-width: 768px) {
        .titan-kpi-card {
          min-height: 160px;
        }
        
        .titan-kpi-value {
          font-size: 2rem;
        }
        
        .titan-kpi-footer {
          font-size: var(--text-xs);
        }
      }
    `;
    
    if (!document.head.querySelector('#titan-kpi-styles')) {
      style.id = 'titan-kpi-styles';
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

  public updateData(data: KPIData): void {
    const oldValue = this.data?.value;
    this.data = data;
    this.render(oldValue);
  }

  private render(oldValue?: number | string): void {
    if (!this.data) return;

    // Update title
    const title = this.container.querySelector('.titan-kpi-title') as HTMLElement;
    if (title) title.textContent = this.data.title;

    // Update status
    const status = this.container.querySelector('.titan-kpi-status') as HTMLElement;
    if (status && this.data.status) {
      status.className = `titan-kpi-status ${this.data.status}`;
    }

    // Update value with animation
    this.animateValue(oldValue, this.data.value);

    // Update unit
    const unit = this.container.querySelector('.titan-kpi-unit') as HTMLElement;
    if (unit) unit.textContent = this.data.unit || '';

    // Update trend
    this.updateTrend();

    // Update target and progress
    this.updateTarget();
  }

  private animateValue(oldValue: number | string | undefined, newValue: number | string): void {
    const valueEl = this.container.querySelector('.titan-kpi-value') as HTMLElement;
    if (!valueEl) return;

    if (this.config.animated && typeof newValue === 'number' && typeof oldValue === 'number') {
      this.animateCounter(valueEl, oldValue, newValue);
    } else {
      valueEl.textContent = this.formatValue(newValue);
      if (this.config.animated) {
        valueEl.classList.add('updating');
        setTimeout(() => valueEl.classList.remove('updating'), 300);
      }
    }
  }

  private animateCounter(element: HTMLElement, from: number, to: number): void {
    const duration = 1000; // 1 second
    const startTime = Date.now();
    const startValue = from;
    const endValue = to;
    const difference = endValue - startValue;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function (ease-out)
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentValue = startValue + (difference * easeOut);
      
      element.textContent = this.formatValue(currentValue);
      
      if (progress < 1) {
        this.animationFrame = requestAnimationFrame(animate);
      }
    };

    animate();
  }

  private formatValue(value: number | string): string {
    if (typeof value === 'string') return value;
    
    if (!this.data) return value.toString();
    
    switch (this.data.format) {
      case 'currency':
        return new Intl.NumberFormat('en-US', { 
          style: 'currency', 
          currency: 'USD',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0
        }).format(value);
      case 'percentage':
        return `${value.toFixed(1)}%`;
      case 'decimal':
        return value.toFixed(2);
      default:
        return new Intl.NumberFormat('en-US').format(Math.round(value));
    }
  }

  private updateTrend(): void {
    if (!this.config.showTrend || !this.data?.trend) return;

    const trendEl = this.container.querySelector('.titan-kpi-trend') as HTMLElement;
    if (!trendEl) return;

    trendEl.className = `titan-kpi-trend ${this.data.trend}`;

    const trendValue = this.container.querySelector('.titan-kpi-trend-value') as HTMLElement;
    if (trendValue && this.data.trendValue !== undefined) {
      const sign = this.data.trendValue > 0 ? '+' : '';
      trendValue.textContent = `${sign}${this.data.trendValue.toFixed(1)}%`;
    }

    trendEl.style.display = 'flex';
  }

  private updateTarget(): void {
    if (!this.config.showTarget || !this.data?.target) return;

    const targetEl = this.container.querySelector('.titan-kpi-target') as HTMLElement;
    const targetValue = this.container.querySelector('.titan-kpi-target-value') as HTMLElement;
    
    if (targetValue) {
      targetValue.textContent = this.formatValue(this.data.target);
      targetEl.style.display = 'flex';
    }

    // Update progress bar
    const progressFill = this.container.querySelector('.titan-kpi-progress-fill') as HTMLElement;
    const progressText = this.container.querySelector('.titan-kpi-progress-text') as HTMLElement;
    
    if (progressFill && progressText && typeof this.data.value === 'number' && this.data.target) {
      const percentage = Math.min((this.data.value / this.data.target) * 100, 100);
      
      setTimeout(() => {
        progressFill.style.width = `${percentage}%`;
        progressText.textContent = `${Math.round(percentage)}%`;
      }, 100);
    }
  }

  public setLoading(loading: boolean): void {
    const loadingEl = this.container.querySelector('.titan-kpi-loading') as HTMLElement;
    if (loadingEl) {
      loadingEl.style.display = loading ? 'block' : 'none';
    }
  }

  private async refreshData(): Promise<void> {
    this.setLoading(true);
    // TODO: Implement data refresh from data source
    setTimeout(() => {
      this.setLoading(false);
    }, 500);
  }

  public destroy(): void {
    if (this.refreshTimer) {
      clearInterval(this.refreshTimer);
    }
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
    }
  }
}