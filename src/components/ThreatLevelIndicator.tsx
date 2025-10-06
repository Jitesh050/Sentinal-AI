import React from 'react';

interface ThreatLevelIndicatorProps {
  level: number; // 0-100
}

const getColor = (level: number) => {
  if (level > 75) return 'bg-red-500';
  if (level > 40) return 'bg-yellow-400';
  return 'bg-green-500';
};

export const ThreatLevelIndicator: React.FC<ThreatLevelIndicatorProps> = ({ level }) => (
  <div className="flex flex-col items-center">
    <div className={`w-32 h-32 rounded-full flex items-center justify-center text-white text-3xl font-bold ${getColor(level)}`}>{level}%</div>
    <div className="mt-2 text-lg">Threat Level</div>
  </div>
);
