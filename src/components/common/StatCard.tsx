import React from 'react';
import clsx from 'clsx';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  variant?: 'blue' | 'green' | 'amber' | 'rose' | 'purple' | 'slate';
  onClick?: () => void;
  trend?: {
    text: string;
    isPositive?: boolean;
  };
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  variant = 'blue',
  onClick,
  trend
}) => {
  const variantStyles = {
    blue: 'bg-gradient-to-br from-blue-500/10 to-indigo-500/5 border-blue-200 text-blue-900 icon-bg:bg-blue-600',
    green: 'bg-gradient-to-br from-emerald-500/10 to-teal-500/5 border-emerald-200 text-emerald-900 icon-bg:bg-emerald-600',
    amber: 'bg-gradient-to-br from-amber-500/10 to-orange-500/5 border-amber-200 text-amber-900 icon-bg:bg-amber-600',
    rose: 'bg-gradient-to-br from-rose-500/10 to-pink-500/5 border-rose-200 text-rose-900 icon-bg:bg-rose-600',
    purple: 'bg-gradient-to-br from-purple-500/10 to-fuchsia-500/5 border-purple-200 text-purple-900 icon-bg:bg-purple-600',
    slate: 'bg-gradient-to-br from-slate-500/10 to-gray-500/5 border-slate-200 text-slate-900 icon-bg:bg-slate-700',
  };

  const iconBgStyles = {
    blue: 'bg-blue-600 text-white',
    green: 'bg-emerald-600 text-white',
    amber: 'bg-amber-600 text-white',
    rose: 'bg-rose-600 text-white',
    purple: 'bg-purple-600 text-white',
    slate: 'bg-slate-700 text-white',
  };

  return (
    <div
      onClick={onClick}
      className={clsx(
        'p-4 sm:p-5 rounded-2xl border transition-all duration-200 shadow-xs hover:shadow-md flex items-center justify-between',
        variantStyles[variant],
        onClick && 'cursor-pointer hover:scale-[1.01]'
      )}
    >
      <div className="space-y-1">
        <p className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-slate-500">
          {title}
        </p>
        <p className="text-2xl sm:text-3xl font-extrabold text-slate-800">
          {value}
        </p>
        {subtitle && (
          <p className="text-xs sm:text-sm text-slate-600 font-medium">{subtitle}</p>
        )}
        {trend && (
          <p className={clsx('text-xs font-semibold flex items-center gap-1', trend.isPositive ? 'text-emerald-600' : 'text-rose-600')}>
            {trend.text}
          </p>
        )}
      </div>

      <div className={clsx('w-12 h-12 rounded-2xl flex items-center justify-center shadow-xs flex-shrink-0', iconBgStyles[variant])}>
        {icon}
      </div>
    </div>
  );
};
