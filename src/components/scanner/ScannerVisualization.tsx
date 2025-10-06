
import React, { useEffect, useRef, useState } from 'react';

// Inject global keyframes for SVG dotted line animation
const injectDashmoveKeyframes = () => {
  if (typeof window !== 'undefined' && document && !document.getElementById('dashmove-keyframes')) {
    const style = document.createElement('style');
    style.id = 'dashmove-keyframes';
    style.innerHTML = `@keyframes dashmove { to { stroke-dashoffset: -32; } }`;
    document.head.appendChild(style);
  }
};

import { Card } from "@/components/ui/card";
import MitmAttack from './MitmAttack';
import DDoSAttack from './DDoSAttack';
import SQLInjection from './SQLInjection';
import { useTheme } from "@/contexts/ThemeContext";
import { AlertTriangle, Database, Code, Zap } from "lucide-react";

export type VisualizationType = 'sql' | 'ddos' | 'mitm' | 'idle';

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

interface Probability {
  type: VisualizationType;
  label: string;
  probability: number;
}

const ATTACK_LABELS: Record<VisualizationType, string> = {
  sql: 'SQL Injection',
  ddos: 'DDoS',
  mitm: 'MITM',
  idle: 'Idle',
};

const ScannerVisualization = ({
  probabilities = [],
  scanType: propScanType = 'idle',
  isScanning = false,
  progress = 0
}: {
  probabilities?: Probability[],
  scanType?: VisualizationType,
  isScanning?: boolean,
  progress?: number
}) => {
  useEffect(() => { injectDashmoveKeyframes(); }, []);
  const { theme } = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);
  const [points, setPoints] = useState<Array<{ id: number, x: number, y: number, color: string, status?: string }>>([]);
  const [paths, setPaths] = useState<Array<{ id: number, path: string, color: string }>>([]);
  // Always use scanType prop for animation
  const selectedType: VisualizationType = propScanType || 'idle';

  // Generate animation points based on scan type
  useEffect(() => {
    if (!isScanning) return;
    
    const colors = {
      sql: theme === 'dark' ? '#0FA0CE' : '#0078d7',
      ddos: theme === 'dark' ? '#0FA0CE' : '#0078d7',
      mitm: theme === 'dark' ? '#F97316' : '#dd6b20',
      idle: theme === 'dark' ? '#8B5CF6' : '#6b46c1'
    };
    
    // Clear existing animations
    setPoints([]);
    setPaths([]);
    
    const interval = setInterval(() => {
      const color = colors[selectedType];

      // DDoS: Bots attacking firewall, some detected/blocked
      if (selectedType === 'ddos') {
        setPoints(() => {
          // Simulate bots (20 max): some detected (red), some blocked (green), some successful (blue)
          const bots = Array.from({ length: 20 }, (_, i) => {
            let status: string;
            if (i < 7) status = 'detected'; // red
            else if (i < 13) status = 'blocked'; // green
            else status = 'success'; // blue
            return {
              id: i,
              x: 10 + Math.random() * 80,
              y: 10 + Math.random() * 80,
              color: status === 'detected' ? '#ef4444' : status === 'blocked' ? '#22c55e' : '#0FA0CE',
              status
            };
          });
          return bots;
        });
        setPaths([]);
      }

      // MITM: Data flow intercepted (legacy 2D, now replaced by MitmAttack below)
      if (selectedType === 'mitm') {
        setPoints([]);
        setPaths([]);
      }

      // SQL Injection: Data flow with injection points
      if (selectedType === 'sql') {
        setPoints([
          { id: 1, x: 10, y: 50, color: '#0FA0CE' }, // User
          { id: 2, x: 50, y: 30, color: '#a3a3a3' }, // Injection point
          { id: 3, x: 90, y: 50, color: '#22c55e' } // Database
        ]);
        setPaths([
          { id: 1, path: 'M 10 50 Q 30 40, 50 30', color: '#0FA0CE' }, // User to Injection
          { id: 2, path: 'M 50 30 Q 70 40, 90 50', color: '#ef4444' } // Injection to DB
        ]);
      }
    }, 1000);
    
    return () => clearInterval(interval);
  }, [isScanning, selectedType, theme]);

  const getScanTypeIcon = () => {
    switch (selectedType) {
      case 'sql':
        return <Database size={24} className="text-cyber-blue" />;
      case 'ddos':
        return <Zap size={24} className="text-cyber-blue" />;
      case 'mitm':
        return <Zap size={24} className="text-cyber-orange" />;
      default:
        return <AlertTriangle size={24} className="text-cyber-purple" />;
    }
  };

  const getScanTypeLabel = () => {
    switch (selectedType) {
      case 'sql': return 'SQL Injection';
      case 'ddos': return 'DDoS Attack';
      case 'mitm': return 'Man-in-the-Middle';
      default: return 'Vulnerability Scan';
    }
  };

  const sortedProbs = (probabilities || []).filter(p => p.type !== 'idle').sort((a, b) => b.probability - a.probability);

  if (selectedType === 'mitm' && !isScanning) {
    return (
      <div className="relative w-full h-72 md:h-96">
        <MitmAttack />
      </div>
    );
  }

  if (selectedType === 'ddos' && !isScanning) {
    return (
      <div className="relative w-full h-72 md:h-96">
        <DDoSAttack />
      </div>
    );
  }

  if (selectedType === 'sql' && !isScanning) {
    return (
      <div className="relative w-full h-72 md:h-96">
        <SQLInjection />
      </div>
    );
  }

  return (
    <Card className="cyber-card scanner-visualization">
      <div ref={containerRef} className="relative w-full h-full min-h-[340px]">
        {/* SVG for paths */}
        <svg className="absolute inset-0 w-full h-full">
          {paths.map(({ id, path, color }) => (
            <>
              <path
                key={`solid-${id}`}
                d={path}
                stroke={color}
                strokeWidth={2}
                fill="none"
              />
              {/* Animated dotted attack line */}
              <path
                key={`dotted-${id}`}
                d={path}
                stroke={color}
                strokeWidth={3}
                fill="none"
                strokeDasharray="8 8"
                style={{
                  strokeDashoffset: `var(--dashoffset-${id}, 0)`,
                  animation: `dashmove 1.2s linear infinite`,
                  animationDelay: `${id * 0.2}s`
                }}
              />
            </>
          ))}
        </svg>
        {/* Animation points (with special rendering for DDoS bots) */}
        {selectedType === 'ddos' ? (
          points.map((point) => (
            <div
              key={point.id}
              className={`absolute h-3 w-3 rounded-full border-2 animate-pulse-glow shadow-lg ${point.status === 'detected' ? 'border-red-500' : point.status === 'blocked' ? 'border-green-500' : 'border-cyber-blue'}`}
              style={{
                left: `${point.x}%`,
                top: `${point.y}%`,
                backgroundColor: point.color,
                boxShadow: `0 0 8px ${point.color}`
              }}
              title={point.status === 'detected' ? 'Detected bot' : point.status === 'blocked' ? 'Blocked bot' : 'Successful bot'}
            />
          ))
        ) : (
          points.map((point) => (
            <AnimationPoint
              key={point.id}
              x={point.x}
              y={point.y}
              color={point.color}
            />
          ))
        )}
        {/* MITM/SQL/Firewall nodes */}
        {selectedType === 'ddos' && (
          <>
            {/* Firewall */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-cyber-darker border-4 border-cyber-blue rounded-xl flex items-center justify-center shadow-xl z-10">
              <span className="text-cyber-blue font-bold text-lg">FIREWALL</span>
            </div>
          </>
        )}
        {selectedType === 'mitm' && (
          <>
            {/* Client */}
            <div className="absolute left-[8%] top-[70%] w-10 h-10 bg-cyber-blue/20 border-2 border-cyber-blue rounded-full flex items-center justify-center font-bold text-cyber-blue">C</div>
            {/* Attacker */}
            <div className="absolute left-1/2 top-[18%] -translate-x-1/2 w-12 h-12 bg-cyber-orange/20 border-2 border-cyber-orange rounded-full flex items-center justify-center font-bold text-cyber-orange">M</div>
            {/* Server */}
            <div className="absolute right-[8%] top-[70%] w-10 h-10 bg-green-500/20 border-2 border-green-500 rounded-full flex items-center justify-center font-bold text-green-500">S</div>
          </>
        )}
        {selectedType === 'sql' && (
          <>
            {/* User */}
            <div className="absolute left-[8%] top-[50%] w-10 h-10 bg-cyber-blue/20 border-2 border-cyber-blue rounded-full flex items-center justify-center font-bold text-cyber-blue">U</div>
            {/* Injection Point */}
            <div className="absolute left-1/2 top-[28%] -translate-x-1/2 w-10 h-10 bg-red-500/20 border-2 border-red-500 rounded-full flex items-center justify-center font-bold text-red-500">INJ</div>
            {/* Database */}
            <div className="absolute right-[8%] top-[50%] w-10 h-10 bg-green-500/20 border-2 border-green-500 rounded-full flex items-center justify-center font-bold text-green-500">DB</div>
          </>
        )}

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
