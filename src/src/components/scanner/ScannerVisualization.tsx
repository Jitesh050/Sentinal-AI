
import React, { useEffect, useRef, useState } from 'react';
import { Card } from "@/components/ui/card";
import { useTheme } from "@/contexts/ThemeContext";
import { AlertTriangle, Database, Code, Zap } from "lucide-react";

type VisualizationType = 'sql' | 'xss' | 'mitm' | 'idle';

const AnimationPoint = ({ x, y, color }: { x: number, y: number, color: string }) => (
  <div 
    className="absolute h-2 w-2 rounded-full animate-pulse-glow"
    style={{ 
      left: `${x}%`, 
      top: `${y}%`, 
      backgroundColor: color,
      boxShadow: `0 0 8px ${color}` 
    }} 
  />
);

const ScannerVisualization = ({
  scanType = 'idle',
  isScanning = false,
  progress = 0
}: {
  scanType?: VisualizationType,
  isScanning?: boolean,
  progress?: number
}) => {
  const { theme } = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);
  const [points, setPoints] = useState<Array<{ id: number, x: number, y: number, color: string }>>([]);
  const [paths, setPaths] = useState<Array<{ id: number, path: string, color: string }>>([]);

  // Generate animation points based on scan type
  useEffect(() => {
    if (!isScanning) return;
    
    const colors = {
      sql: theme === 'dark' ? '#0FA0CE' : '#0078d7',
      xss: theme === 'dark' ? '#D946EF' : '#b83280',
      mitm: theme === 'dark' ? '#F97316' : '#dd6b20',
      idle: theme === 'dark' ? '#8B5CF6' : '#6b46c1'
    };
    
    // Clear existing animations
    setPoints([]);
    setPaths([]);
    
    const interval = setInterval(() => {
      // Add new points based on scan type
      const color = colors[scanType];
      
      // Create random animation points
      setPoints(prev => {
        const newPoints = [...prev];
        if (newPoints.length > 15) newPoints.shift();
        return [
          ...newPoints, 
          { 
            id: Date.now(), 
            x: Math.random() * 100, 
            y: Math.random() * 100, 
            color 
          }
        ];
      });
      
      // Create paths for data flow visualization
      if (scanType === 'sql') {
        setPaths(prev => {
          const newPaths = [...prev];
          if (newPaths.length > 5) newPaths.shift();
          
          const startX = 10 + Math.random() * 30;
          const startY = 10 + Math.random() * 30;
          const midX = 40 + Math.random() * 20;
          const midY = 40 + Math.random() * 20;
          const endX = 70 + Math.random() * 20;
          const endY = 70 + Math.random() * 20;
          
          return [
            ...newPaths,
            {
              id: Date.now(),
              path: `M ${startX} ${startY} Q ${midX} ${midY}, ${endX} ${endY}`,
              color
            }
          ];
        });
      }
      
      if (scanType === 'xss') {
        setPaths(prev => {
          const newPaths = [...prev];
          if (newPaths.length > 5) newPaths.shift();
          
          const startX = 20 + Math.random() * 20;
          const startY = 50 + Math.random() * 20;
          const endX = 80 + Math.random() * 10;
          const endY = 30 + Math.random() * 40;
          
          return [
            ...newPaths,
            {
              id: Date.now(),
              path: `M ${startX} ${startY} L ${endX} ${endY}`,
              color
            }
          ];
        });
      }
      
      if (scanType === 'mitm') {
        setPaths(prev => {
          const newPaths = [...prev];
          if (newPaths.length > 5) newPaths.shift();
          
          const startX = 10;
          const startY = 30 + Math.random() * 40;
          const midX = 50;
          const midY = 30 + Math.random() * 40;
          const endX = 90;
          const endY = 30 + Math.random() * 40;
          
          return [
            ...newPaths,
            {
              id: Date.now(),
              path: `M ${startX} ${startY} L ${midX} ${midY} L ${endX} ${endY}`,
              color
            }
          ];
        });
      }
    }, 600);
    
    return () => clearInterval(interval);
  }, [isScanning, scanType, theme]);

  const getScanTypeIcon = () => {
    switch (scanType) {
      case 'sql':
        return <Database size={24} className="text-cyber-blue" />;
      case 'xss':
        return <Code size={24} className="text-cyber-magenta" />;
      case 'mitm':
        return <Zap size={24} className="text-cyber-orange" />;
      default:
        return <AlertTriangle size={24} className="text-cyber-purple" />;
    }
  };

  const getScanTypeLabel = () => {
    switch (scanType) {
      case 'sql': return 'SQL Injection Test';
      case 'xss': return 'Cross-Site Scripting Test';
      case 'mitm': return 'Man-in-the-Middle Test';
      default: return 'Vulnerability Scan';
    }
  };

  return (
    <Card className="cyber-card scanner-visualization">
      <div ref={containerRef} className="relative w-full h-full">
        {/* SVG for paths */}
        <svg className="absolute inset-0 w-full h-full">
          {paths.map(({ id, path, color }) => (
            <path
              key={id}
              d={path}
              stroke={color}
              strokeWidth={2}
              fill="none"
              strokeDasharray="5,5"
              className="animate-dash"
            />
          ))}
        </svg>
        
        {/* Animation points */}
        {points.map((point) => (
          <AnimationPoint 
            key={point.id} 
            x={point.x} 
            y={point.y} 
            color={point.color} 
          />
        ))}
        
        {/* Status display */}
        <div className="absolute bottom-4 right-4 p-3 glass-panel flex items-center gap-3">
          {getScanTypeIcon()}
          <div className="text-left">
            <div className="text-xs text-cyber-blue font-mono">ACTIVE SCAN</div>
            <div className="text-sm font-medium">{getScanTypeLabel()}</div>
          </div>
        </div>
        
        {/* Progress indicator */}
        {isScanning && (
          <div className="absolute bottom-4 left-4 right-20 h-1 bg-cyber-darker rounded-full overflow-hidden">
            <div 
              className="h-full bg-cyber-blue transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
        
        {!isScanning && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center opacity-50">
            <AlertTriangle size={40} className="mx-auto mb-2 text-cyber-blue" />
            <p className="text-sm">Configure and start a scan</p>
          </div>
        )}
      </div>
    </Card>
  );
};

export default ScannerVisualization;
