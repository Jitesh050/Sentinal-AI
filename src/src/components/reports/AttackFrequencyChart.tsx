
import { useEffect, useRef } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface AttackFrequencyChartProps {
  timeRange: "day" | "week" | "month" | "year";
}

export const AttackFrequencyChart = ({ timeRange }: AttackFrequencyChartProps) => {
  // Sample data - in a real app, this would come from an API call
  const dayData = [
    { time: "00:00", attacks: 4 },
    { time: "04:00", attacks: 2 },
    { time: "08:00", attacks: 7 },
    { time: "12:00", attacks: 12 },
    { time: "16:00", attacks: 14 },
    { time: "20:00", attacks: 8 },
  ];
  
  const weekData = [
    { time: "Mon", attacks: 18 },
    { time: "Tue", attacks: 12 },
    { time: "Wed", attacks: 24 },
    { time: "Thu", attacks: 30 },
    { time: "Fri", attacks: 22 },
    { time: "Sat", attacks: 10 },
    { time: "Sun", attacks: 8 },
  ];
  
  const monthData = [
    { time: "Week 1", attacks: 48 },
    { time: "Week 2", attacks: 64 },
    { time: "Week 3", attacks: 52 },
    { time: "Week 4", attacks: 70 },
  ];
  
  const yearData = [
    { time: "Jan", attacks: 145 },
    { time: "Feb", attacks: 120 },
    { time: "Mar", attacks: 178 },
    { time: "Apr", attacks: 210 },
    { time: "May", attacks: 190 },
    { time: "Jun", attacks: 240 },
    { time: "Jul", attacks: 280 },
    { time: "Aug", attacks: 260 },
    { time: "Sep", attacks: 300 },
    { time: "Oct", attacks: 280 },
    { time: "Nov", attacks: 320 },
    { time: "Dec", attacks: 290 },
  ];
  
  const dataMap = {
    day: dayData,
    week: weekData,
    month: monthData,
    year: yearData
  };
  
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
