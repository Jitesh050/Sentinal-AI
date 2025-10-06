import { useState } from 'react';
import { Info } from 'lucide-react';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

// Animated dotted line between botnet and server
const AttackDottedLine = ({ start, end, delay = '0s' }: { start: string, end: string, delay?: string }) => (
  <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 1 }}>
    <line
      x1={start.split(',')[0]} y1={start.split(',')[1]} 
      x2={end.split(',')[0]} y2={end.split(',')[1]}
      stroke="#ef4444"
      strokeWidth={2}
      strokeDasharray="6 4"
      style={{
        animation: `dashmove 1.2s linear infinite ${delay}`,
      }}
    />
    <style>{`@keyframes dashmove { to { stroke-dashoffset: -20; } }`}</style>
  </svg>
);

// Component for a single bot/infected computer
const Bot = ({ position, delay, id }: { position: string, delay: string, id: number }) => {
  return (
    <div className={`absolute ${position}`} id={`bot-${id}`}>
      <div className="cyber-card w-16 h-16 flex items-center justify-center">
        <div className="relative z-10">
          <svg className="w-8 h-8 text-cyber-blue" viewBox="0 0 24 24" fill="none">
            <path d="M20 7L12 3L4 7M20 7V17L12 21M20 7L12 11M12 21L4 17V7M12 21V11M4 7L12 11" 
                  stroke="currentColor" strokeWidth="2" />
          </svg>
        </div>
      </div>
    </div>
  );
};

// Server component with warning indicator
const Server = () => {
  return (
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
      <div className="cyber-card w-24 h-28 bg-cyber-darker border border-cyber-red/50 flex flex-col items-center justify-center">
        <div className="relative z-10">
          <svg className="w-16 h-16 text-cyber-red" viewBox="0 0 24 24" fill="none">
            <path d="M5 12.5V5.5C5 4.11929 6.11929 3 7.5 3H16.5C17.8807 3 19 4.11929 19 5.5V12.5" 
                  stroke="currentColor" strokeWidth="2" />
            <rect x="3" y="12.5" width="18" height="3" rx="1" stroke="currentColor" strokeWidth="2" />
            <rect x="5" y="15.5" width="14" height="3" rx="1" stroke="currentColor" strokeWidth="2" />
            <rect x="7" y="18.5" width="10" height="3" rx="1" stroke="currentColor" strokeWidth="2" />
          </svg>
          <div className="text-xs mt-2 text-cyber-red text-center font-semibold">Overloaded</div>
        </div>
      </div>
      
      {/* Info tooltip */}
      <div className="absolute -top-4 -right-4">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button className="bg-cyber-blue rounded-full p-1 hover:bg-cyber-blue/80 transition-colors">
                <Info className="w-4 h-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="top" className="bg-black/90 border-cyber-blue p-2 text-white max-w-xs">
              <p>DDoS Attack: Server overwhelmed by traffic from compromised devices</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};

const DDoSAttack = () => {
  // Bot positions around the center server - positioned to match the screenshot
  const botPositions = [
    "top-1/4 left-1/4", 
    "top-1/4 right-1/4",
    "bottom-1/4 left-1/4",
    "bottom-1/4 right-1/4"
  ];

  // Define attack paths from each bot to the server - direct connections only
  const attackPaths = [
    { start: "25%,25%", end: "50%,50%" },  // top-left to center
    { start: "75%,25%", end: "50%,50%" },  // top-right to center
    { start: "25%,75%", end: "50%,50%" },  // bottom-left to center
    { start: "75%,75%", end: "50%,50%" }   // bottom-right to center
  ];

  return (
    <div className="relative w-full h-full bg-gradient-to-b from-cyber-dark to-black flex justify-center items-center">
      {/* Grid lines for cyber effect */}
      <div className="absolute inset-0 opacity-20" 
           style={{
             backgroundImage: 'linear-gradient(to right, #0EA5E9 1px, transparent 1px), linear-gradient(to bottom, #0EA5E9 1px, transparent 1px)',
             backgroundSize: '40px 40px'
           }}>
      </div>
      
      {/* Attack dotted lines */}
      {attackPaths.map((path, index) => (
        <AttackDottedLine 
          key={`path-${index}`} 
          start={path.start} 
          end={path.end} 
          delay={`${index * 0.1}s`} 
        />
      ))}
      
      {/* Bots sending traffic */}
      {botPositions.map((position, index) => (
        <Bot key={index} position={position} delay={`${index * 0.2}s`} id={index} />
      ))}
      
      {/* Central server */}
      <Server />
    </div>
  );
};

export default DDoSAttack;
