import React from 'react';

interface KPIWidgetProps {
  title: string;
  value: string;
  change: string;
  trend: 'positive' | 'negative';
  format: 'currency' | 'percentage' | 'number' | 'ratio';
}

const KPIWidget: React.FC<KPIWidgetProps> = ({ title, value, change, trend, format }) => {
  const getTrendIcon = () => {
    return trend === 'positive' ? '↗️' : '↘️';
  };

  return (
    <div className="titan-kpi">
      <div className="titan-kpi-title">{title}</div>
      <div className="titan-kpi-value">{value}</div>
      <div className={`titan-kpi-change ${trend}`}>
        <span>{getTrendIcon()}</span>
        <span>{change} vs last period</span>
      </div>
    </div>
  );
};

export default KPIWidget;