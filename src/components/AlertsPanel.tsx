import React from 'react';

interface Alert {
  message: string;
  level: 'info' | 'warning' | 'critical';
}

interface AlertsPanelProps {
  alerts: Alert[];
}

const colorMap = {
  info: 'bg-blue-100 text-blue-800',
  warning: 'bg-yellow-100 text-yellow-800',
  critical: 'bg-red-100 text-red-800',
};

export const AlertsPanel: React.FC<AlertsPanelProps> = ({ alerts }) => (
  <div className="space-y-2">
    {alerts.map((alert, i) => (
      <div key={i} className={`p-3 rounded ${colorMap[alert.level]}`}>{alert.message}</div>
    ))}
  </div>
);
