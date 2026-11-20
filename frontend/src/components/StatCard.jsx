import React from 'react';

export default function StatCard({ title, value, subtitle, icon: Icon, color, trend }) {
  return (
    <div className={`stat-card stat-card-${color}`}>
      <div className="stat-card-header">
        <span className="stat-card-title">{title}</span>
        <div className={`stat-icon-wrap icon-${color}`}>
          <Icon size={20} />
        </div>
      </div>
      <div className="stat-card-body">
        <div className="stat-card-value">{value}</div>
        {subtitle && <div className="stat-card-sub">{subtitle}</div>}
      </div>
      {trend && (
        <div className="stat-card-footer">
          <span className="stat-trend">{trend}</span>
        </div>
      )}
    </div>
  );
}
