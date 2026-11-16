import React from 'react';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ElementType;
  badge?: {
    text: string;
    variant?: 'success' | 'warning' | 'info' | 'neutral';
  };
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  badge,
}) => {
  const getBadgeStyle = (variant = 'neutral') => {
    switch (variant) {
      case 'success':
        return 'bg-emerald-50 text-status-success border-emerald-100';
      case 'warning':
        return 'bg-amber-50 text-status-warning border-amber-100';
      case 'info':
        return 'bg-brand-50 text-brand-600 border-brand-100';
      default:
        return 'bg-gray-50 text-content-secondary border-border-subtle';
    }
  };

  return (
    <div className="bg-surface-card border border-border-subtle rounded-lg p-5 shadow-card hover:border-border-strong transition-all">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium text-content-secondary">{title}</span>
        {Icon && (
          <div className="w-8 h-8 rounded-md bg-surface-muted border border-border-subtle flex items-center justify-center text-content-secondary">
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>

      <div className="text-2xl font-bold text-content-primary tracking-tight">
        {value}
      </div>

      <div className="mt-2 flex items-center gap-2">
        {badge && (
          <span
            className={`text-[11px] font-medium px-1.5 py-0.5 rounded border ${getBadgeStyle(
              badge.variant
            )}`}
          >
            {badge.text}
          </span>
        )}
        {subtitle && (
          <span className="text-[12px] text-content-secondary truncate">{subtitle}</span>
        )}
      </div>
    </div>
  );
};
