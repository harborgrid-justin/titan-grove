import React from 'react';

interface ConnectionStatusProps {
  connected: boolean;
  reconnecting?: boolean;
  lastUpdateTime?: string;
  className?: string;
}

const ConnectionStatus: React.FC<ConnectionStatusProps> = ({
  connected,
  reconnecting = false,
  lastUpdateTime,
  className = ''
}) => {
  const getStatusText = () => {
    if (reconnecting) return 'Reconnecting...';
    if (connected) return 'Connected';
    return 'Disconnected';
  };

  const getStatusClass = () => {
    if (reconnecting) return 'titan-status-reconnecting';
    if (connected) return 'titan-status-connected';
    return 'titan-status-disconnected';
  };

  const getStatusIcon = () => {
    if (reconnecting) return '🔄';
    if (connected) return '✅';
    return '⚠️';
  };

  return (
    <div className={`titan-connection-status ${getStatusClass()} ${className}`}>
      <span className="titan-status-icon">{getStatusIcon()}</span>
      <span className="titan-status-text">{getStatusText()}</span>
      {lastUpdateTime && connected && (
        <span className="titan-status-time">
          Last update: {new Date(lastUpdateTime).toLocaleTimeString()}
        </span>
      )}
      
      <style jsx>{`
        .titan-connection-status {
          display: inline-flex;
          align-items: center;
          gap: var(--spacing-2);
          padding: var(--spacing-2) var(--spacing-3);
          border-radius: var(--spacing-1);
          font-size: var(--text-sm);
          font-weight: 500;
          border: 1px solid transparent;
          transition: all 0.2s ease;
        }

        .titan-status-connected {
          background: #dcfce7;
          color: #166534;
          border-color: #bbf7d0;
        }

        .titan-status-disconnected {
          background: #fee2e2;
          color: #991b1b;
          border-color: #fecaca;
        }

        .titan-status-reconnecting {
          background: #fef3c7;
          color: #92400e;
          border-color: #fde68a;
        }

        .titan-status-icon {
          font-size: var(--text-sm);
        }

        .titan-status-reconnecting .titan-status-icon {
          animation: titan-pulse 1s ease-in-out infinite;
        }

        .titan-status-text {
          font-weight: 600;
        }

        .titan-status-time {
          font-size: var(--text-xs);
          opacity: 0.8;
          margin-left: var(--spacing-2);
        }

        @keyframes titan-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
};

export default ConnectionStatus;