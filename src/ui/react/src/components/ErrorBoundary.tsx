import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { 
      hasError: true,
      error 
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('Enterprise Error Boundary caught an error:', error, errorInfo);
    
    this.setState({
      error,
      errorInfo
    });

    // In production, you would send this to your error reporting service
    const isDevelopment = typeof process !== 'undefined' ? 
      process.env.NODE_ENV === 'development' : 
      import.meta.env?.DEV || false;
      
    if (!isDevelopment) {
      // Example: reportErrorToService(error, errorInfo);
    }
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleGoHome = () => {
    window.location.href = '/dashboard';
  };

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="titan-error-boundary">
          <div className="titan-error-content">
            <div className="titan-error-icon">⚠️</div>
            <h1 className="titan-error-title">Enterprise Application Error</h1>
            <p className="titan-error-message">
              An unexpected error occurred in the application. Our technical team has been notified.
            </p>
            
            <div className="titan-error-actions">
              <button 
                className="titan-button titan-button-primary"
                onClick={this.handleReload}
              >
                🔄 Reload Application
              </button>
              <button 
                className="titan-button titan-button-secondary"
                onClick={this.handleGoHome}
              >
                🏠 Go to Dashboard
              </button>
            </div>

            {((typeof process !== 'undefined' && process.env.NODE_ENV === 'development') || 
              (typeof import.meta !== 'undefined' && import.meta.env?.DEV)) && this.state.error && (
              <details className="titan-error-details">
                <summary>Technical Details (Development Mode)</summary>
                <div className="titan-error-stack">
                  <h4>Error:</h4>
                  <pre>{this.state.error.toString()}</pre>
                  
                  {this.state.errorInfo && (
                    <>
                      <h4>Component Stack:</h4>
                      <pre>{this.state.errorInfo.componentStack}</pre>
                    </>
                  )}
                </div>
              </details>
            )}
          </div>

          <style jsx>{`
            .titan-error-boundary {
              min-height: 100vh;
              display: flex;
              align-items: center;
              justify-content: center;
              background: var(--background);
              padding: var(--spacing-6);
            }

            .titan-error-content {
              max-width: 600px;
              text-align: center;
              background: white;
              padding: var(--spacing-8);
              border-radius: var(--spacing-3);
              box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
            }

            .titan-error-icon {
              font-size: 4rem;
              margin-bottom: var(--spacing-4);
            }

            .titan-error-title {
              font-size: var(--text-xxl);
              font-weight: 700;
              color: var(--text-primary);
              margin: 0 0 var(--spacing-4) 0;
            }

            .titan-error-message {
              color: var(--text-secondary);
              margin-bottom: var(--spacing-6);
              line-height: 1.6;
            }

            .titan-error-actions {
              display: flex;
              gap: var(--spacing-3);
              justify-content: center;
              margin-bottom: var(--spacing-6);
            }

            .titan-error-details {
              text-align: left;
              margin-top: var(--spacing-6);
              padding: var(--spacing-4);
              background: var(--surface);
              border-radius: var(--spacing-2);
            }

            .titan-error-details summary {
              cursor: pointer;
              font-weight: 600;
              margin-bottom: var(--spacing-3);
            }

            .titan-error-stack {
              font-family: var(--font-mono);
              font-size: var(--text-sm);
            }

            .titan-error-stack h4 {
              margin: var(--spacing-3) 0 var(--spacing-2) 0;
              color: var(--text-primary);
            }

            .titan-error-stack pre {
              background: #f8f9fa;
              padding: var(--spacing-3);
              border-radius: var(--spacing-1);
              overflow-x: auto;
              white-space: pre-wrap;
              font-size: var(--text-xs);
              line-height: 1.4;
            }
          `}</style>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;