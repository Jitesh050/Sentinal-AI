
import { useEffect, useRef } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface AttackFrequencyChartProps {
  timeRange: "day" | "week" | "month" | "year";
}

export const AttackFrequencyChart = ({ timeRange, scanResult }: AttackFrequencyChartProps & { scanResult?: any }) => {
  // Only use backend data, no hardcoded fallback
  const backendData = scanResult?.charts?.attackFrequencyData;
  const dataMap = backendData || {};
  const chartData = dataMap[timeRange] || [];

  if (!chartData.length) {
    return <div className="text-gray-400 text-center mt-8">No data available for this time range.</div>;
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={dataMap[timeRange]} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
        <XAxis 
          dataKey="time" 
          stroke="#999"
          tick={{ fill: '#999', fontSize: 12 }}
        />
        <YAxis 
          stroke="#999" 
          tick={{ fill: '#999', fontSize: 12 }}
          name="Attacks"
        />
        <Tooltip 
          contentStyle={{ 
            background: 'rgba(26, 31, 44, 0.9)', 
            border: '1px solid rgba(15, 160, 206, 0.3)',
            borderRadius: '4px',
            color: '#fff'
          }} 
        />
        <Bar 
          dataKey="attacks" 
          fill="url(#attackGradient)" 
          radius={[4, 4, 0, 0]}
        />
        <defs>
          <linearGradient id="attackGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#0FA0CE" stopOpacity={0.8}/>
            <stop offset="95%" stopColor="#0FA0CE" stopOpacity={0.2}/>
          </linearGradient>
        </defs>
      </BarChart>
    </ResponsiveContainer>
  );
};
