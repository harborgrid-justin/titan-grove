import React from 'react';
import { Tile, DefinitionTooltip } from '@carbon/react';
import { ArrowUpRight, ArrowDownRight } from '@carbon/icons-react';

interface KPIWidgetProps {
  title: string;
  value: string;
  change: string;
  trend: 'positive' | 'negative';
  format: 'currency' | 'percentage' | 'number' | 'ratio';
}

const KPIWidget: React.FC<KPIWidgetProps> = ({ title, value, change, trend, format }) => {
  const getTrendIcon = () => {
    return trend === 'positive' ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />;
  };

  const getTrendColor = () => {
    return trend === 'positive' ? 'var(--cds-support-02)' : 'var(--cds-support-01)';
  };

  return (
    <Tile className="kpi-widget">
      <div style={{ marginBottom: 'var(--cds-spacing-03)' }}>
        <DefinitionTooltip definition={`KPI: ${title}`}>
          <div style={{ 
            fontSize: 'var(--cds-body-short-01-font-size)',
            color: 'var(--cds-text-02)',
            fontWeight: 'var(--cds-body-short-01-font-weight)'
          }}>
            {title}
          </div>
        </DefinitionTooltip>
      </div>
      <div style={{ 
        fontSize: 'var(--cds-productive-heading-05-font-size)',
        fontWeight: 'var(--cds-productive-heading-05-font-weight)',
        color: 'var(--cds-text-01)',
        marginBottom: 'var(--cds-spacing-02)'
      }}>
        {value}
      </div>
      <div style={{ 
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--cds-spacing-02)',
        fontSize: 'var(--cds-body-short-01-font-size)',
        color: getTrendColor()
      }}>
        {getTrendIcon()}
        <span>{change} vs last period</span>
      </div>
    </Tile>
  );
};

export default KPIWidget;