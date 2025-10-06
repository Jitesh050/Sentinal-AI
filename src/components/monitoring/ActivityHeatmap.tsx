
import { useEffect, useRef } from 'react';

// Mock data: attacks per hour (0-23) for the past 7 days
const activityData = [
  // Sunday
  [0, 1, 0, 0, 2, 0, 1, 3, 5, 7, 12, 8, 10, 15, 18, 22, 15, 10, 8, 5, 3, 2, 1, 0],
  // Monday
  [0, 0, 1, 0, 0, 2, 3, 8, 12, 18, 22, 20, 18, 22, 24, 25, 20, 18, 15, 10, 5, 3, 1, 0],
  // Tuesday
  [1, 0, 0, 1, 1, 2, 5, 10, 15, 20, 25, 22, 20, 25, 28, 30, 25, 20, 15, 12, 8, 4, 2, 1],
  // Wednesday
  [0, 1, 0, 0, 1, 3, 5, 12, 18, 22, 28, 25, 20, 24, 28, 32, 25, 20, 15, 10, 8, 5, 2, 1],
  // Thursday
  [1, 0, 1, 0, 2, 2, 4, 10, 15, 20, 24, 22, 20, 25, 28, 30, 25, 22, 18, 12, 8, 5, 3, 1],
  // Friday
  [0, 0, 0, 1, 1, 2, 3, 8, 12, 15, 18, 15, 12, 18, 20, 22, 18, 15, 10, 8, 5, 3, 1, 0],
  // Saturday
  [0, 0, 0, 0, 1, 0, 2, 5, 8, 10, 12, 10, 8, 12, 15, 18, 12, 10, 8, 5, 3, 2, 1, 0]
];

const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export const ActivityHeatmap = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas size
    const parentWidth = canvas.parentElement?.clientWidth || 800;
    canvas.width = parentWidth;
    canvas.height = 200;
    
    // Grid configuration
    const cellWidth = parentWidth / 24; // 24 hours
    const cellHeight = canvas.height / 7; // 7 days
    const padding = 1;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw heatmap
    activityData.forEach((dayData, dayIndex) => {
      dayData.forEach((value, hourIndex) => {
        // Calculate color based on value
        // Max value is around 32 in our dataset
        const intensity = value / 32;
        
        // Interpolate color: blue to purple to red
        let r = 0, g = 0, b = 0;
        
        if (intensity < 0.5) {
          // Blue to purple: (15, 160, 206) to (139, 92, 246)
          r = 15 + (139 - 15) * (intensity * 2);
          g = 160 + (92 - 160) * (intensity * 2);
          b = 206 + (246 - 206) * (intensity * 2);
        } else {
          // Purple to red: (139, 92, 246) to (234, 56, 76)
          r = 139 + (234 - 139) * ((intensity - 0.5) * 2);
          g = 92 + (56 - 92) * ((intensity - 0.5) * 2);
          b = 246 + (76 - 246) * ((intensity - 0.5) * 2);
        }
        
        // Set cell color
        ctx.fillStyle = `rgba(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)}, ${0.2 + intensity * 0.8})`;
        
        // Draw cell
        ctx.fillRect(
          hourIndex * cellWidth + padding,
          dayIndex * cellHeight + padding,
          cellWidth - padding * 2,
          cellHeight - padding * 2
        );
        
        // Add activity count for cells with significant activity
        if (value > 0) {
          ctx.fillStyle = '#fff';
          ctx.font = '10px Inter';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(
            value.toString(),
            hourIndex * cellWidth + cellWidth / 2,
            dayIndex * cellHeight + cellHeight / 2
          );
        }
      });
    });
    
    // Draw day labels
    ctx.fillStyle = '#999';
    ctx.font = '10px Inter';
    ctx.textAlign = 'left';
    
    dayNames.forEach((day, index) => {
      ctx.fillText(
        day.substring(0, 3), 
        5, 
        index * cellHeight + cellHeight / 2 + 3
      );
    });
    
    // Draw hour labels (every 3 hours)
    for (let i = 0; i < 24; i += 3) {
      ctx.fillText(
        `${i}h`,
        i * cellWidth + cellWidth / 2,
        canvas.height - 5
      );
    }
    
  }, []);
  
  return (
    <div className="p-2">
      <canvas 
        ref={canvasRef} 
        className="w-full h-[200px]"
      ></canvas>
      <div className="flex items-center justify-center mt-4">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-sm bg-cyber-blue opacity-30"></div>
          <span className="text-xs text-gray-400">Low</span>
        </div>
        <div className="w-32 h-2 mx-4 bg-gradient-to-r from-cyber-blue via-cyber-purple to-cyber-red"></div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-sm bg-cyber-red opacity-80"></div>
          <span className="text-xs text-gray-400">High</span>
        </div>
      </div>
    </div>
  );
};
