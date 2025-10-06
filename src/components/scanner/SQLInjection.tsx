import { useState, useEffect } from 'react';
import { Info } from 'lucide-react';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

const SQLInjection = () => {
  const [pathProgress, setPathProgress] = useState(0);

  // Animation effect for the sneaky path
  useEffect(() => {
    const timer = setInterval(() => {
      setPathProgress(prev => (prev < 100 ? prev + 1 : 0));
    }, 50);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full h-full bg-gradient-to-b from-cyber-dark to-black">
      {/* Grid lines for cyber effect */}
      <div className="absolute inset-0 opacity-20" 
           style={{
             backgroundImage: 'linear-gradient(to right, #0EA5E9 1px, transparent 1px), linear-gradient(to bottom, #0EA5E9 1px, transparent 1px)',
             backgroundSize: '40px 40px'
           }}>
      </div>
      
      {/* Firewall */}
      <div className="absolute left-1/2 top-1/4 bottom-1/4 w-4 bg-cyber-red/40 border-l-2 border-r-2 border-cyber-red transform -translate-x-1/2">
        <div className="absolute inset-y-0 w-full flex flex-col justify-around items-center">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="w-2 h-2 bg-cyber-red rounded-full"></div>
          ))}
        </div>
      </div>
      
      {/* Hacker's laptop (outside) */}
      <div className="absolute left-1/4 top-1/2 transform -translate-y-1/2">
        <div className="cyber-card w-24 h-20 flex items-center justify-center">
          <div className="relative z-10">
            <svg className="w-16 h-16 text-cyber-purple" viewBox="0 0 24 24" fill="none">
              <path d="M3 6C3 4.34315 4.34315 3 6 3H18C19.6569 3 21 4.34315 21 6V15C21 16.6569 19.6569 18 18 18H6C4.34315 18 3 16.6569 3 15V6Z" 
                    stroke="currentColor" strokeWidth="2" />
              <path d="M7 21H17M12 18V21" stroke="currentColor" strokeWidth="2" />
              <path d="M7 14.5L17 14.5" stroke="currentColor" strokeWidth="2" />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <svg className="w-6 h-6 text-cyber-red" viewBox="0 0 24 24" fill="none">
                <path d="M17 9V7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7V9" 
                      stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <path d="M12 15V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <path d="M8 11V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <path d="M16 11V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
          </div>
        </div>
        
        {/* Info tooltip */}
        <div className="absolute -top-4 -right-4">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="bg-cyber-blue rounded-full p-1 animate-pulse-glow">
                  <Info className="w-4 h-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="top" className="bg-black border-cyber-blue text-white max-w-xs">
                <p>SQL Injection: Malicious input bypasses database security to gain unauthorized access</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
      
      {/* Server (inside) */}
      <div className="absolute right-1/4 top-1/2 transform -translate-y-1/2">
        <div className="cyber-card w-24 h-32 flex items-center justify-center">
          <div className="relative z-10">
            <svg className="w-16 h-16 text-cyber-blue" viewBox="0 0 24 24" fill="none">
              <path d="M5 12.5V5.5C5 4.11929 6.11929 3 7.5 3H16.5C17.8807 3 19 4.11929 19 5.5V12.5" 
                    stroke="currentColor" strokeWidth="2" />
              <rect x="3" y="12.5" width="18" height="3" rx="1" stroke="currentColor" strokeWidth="2" />
              <rect x="5" y="15.5" width="14" height="3" rx="1" stroke="currentColor" strokeWidth="2" />
              <rect x="7" y="18.5" width="10" height="3" rx="1" stroke="currentColor" strokeWidth="2" />
            </svg>
            <div className="text-xs mt-2 text-cyber-blue">Database Server</div>
          </div>
        </div>
      </div>
      
      {/* Sneaky Path - using SVG for the curved path */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          <linearGradient id="pathGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#8B5CF6" />
            <stop offset="100%" stopColor="#10B981" />
          </linearGradient>
        </defs>
        
        {/* Base path (dotted) */}
        <path 
          d="M25 50 C 35 30, 65 70, 75 50" 
          fill="none" 
          stroke="#8B5CF6" 
          strokeWidth="0.5" 
          strokeDasharray="1,1"
          strokeLinecap="round"
        />
        
        {/* Animated path */}
        <path 
          d="M25 50 C 35 30, 65 70, 75 50" 
          fill="none" 
          stroke="url(#pathGradient)" 
          strokeWidth="0.8" 
          strokeLinecap="round"
          strokeDasharray="100"
          strokeDashoffset={100 - pathProgress}
        />
      </svg>
      
      {/* Moving data packet along the path */}
      <div 
        className="absolute w-3 h-3 rounded-full bg-cyber-green cyber-glow"
        style={{
          left: `calc(25% + ${pathProgress * 0.5}%)`,
          top: `calc(50% + ${Math.sin((pathProgress / 100) * Math.PI) * -20}%)`,
          transition: 'all 50ms linear'
        }}
      ></div>
    </div>
  );
};

export default SQLInjection;
