import React from 'react';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  message?: string;
  overlay?: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'medium', 
  message = 'Loading...', 
  overlay = false 
}) => {
  const sizeClasses = {
    small: 'titan-spinner-small',
    medium: 'titan-spinner-medium',
    large: 'titan-spinner-large'
  };

  const spinnerContent = (
    <div className={`titan-loading-spinner ${sizeClasses[size]}`}>
      <div className="titan-spinner"></div>
      {message && <div className="titan-loading-message">{message}</div>}
      
      <style jsx>{`
        .titan-loading-spinner {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: var(--spacing-3);
        }

        .titan-spinner {
          border: 3px solid var(--surface);
          border-top: 3px solid var(--primary);
          border-radius: 50%;
          animation: titan-spin 1s linear infinite;
        }

        .titan-spinner-small .titan-spinner {
          width: 20px;
          height: 20px;
          border-width: 2px;
        }

        .titan-spinner-medium .titan-spinner {
          width: 32px;
          height: 32px;
          border-width: 3px;
        }

        .titan-spinner-large .titan-spinner {
          width: 48px;
          height: 48px;
          border-width: 4px;
        }

        .titan-loading-message {
          color: var(--text-secondary);
          font-size: var(--text-sm);
          font-weight: 500;
        }

        .titan-spinner-small .titan-loading-message {
          font-size: var(--text-xs);
        }

        .titan-spinner-large .titan-loading-message {
          font-size: var(--text-md);
        }

        @keyframes titan-spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .titan-loading-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(255, 255, 255, 0.9);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          backdrop-filter: blur(2px);
        }

        .titan-loading-overlay .titan-loading-spinner {
          background: white;
          padding: var(--spacing-6);
          border-radius: var(--spacing-3);
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
        }
      `}</style>
    </div>
  );

  if (overlay) {
    return (
      <div className="titan-loading-overlay">
        {spinnerContent}
      </div>
    );
  }

  return spinnerContent;
};

export default LoadingSpinner;