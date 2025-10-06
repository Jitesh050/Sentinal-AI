
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface ThreatMeterProps {
  score: number;
  label?: string;
}

export function ThreatMeter({ score, label = "Threat Level" }: ThreatMeterProps) {
  const [displayScore, setDisplayScore] = useState(0);
  
  // Animation for score
  useEffect(() => {
    const timer = setTimeout(() => {
      setDisplayScore(score);
    }, 500);
    return () => clearTimeout(timer);
  }, [score]);

  // Determine color based on score
  const getColor = () => {
    if (score < 33) return "text-green-400";
    if (score < 66) return "text-yellow-400";
    return "text-red-400";
  };

  // Determine threat level text
  const getThreatLevel = () => {
    if (score < 33) return "Low";
    if (score < 66) return "Medium";
    return "Critical";
  };
  
  // Calculate stroke dash offset for circular progress
  const circumference = 2 * Math.PI * 40; // radius = 40
  const offset = circumference - (displayScore / 100) * circumference;
  
  return (
    <div className="cyber-card flex flex-col items-center justify-center p-6 h-full">
      <h3 className="text-lg font-mono text-gray-300 mb-4">{label}</h3>
      
      <div className="relative flex items-center justify-center w-40 h-40">
        {/* Background circle */}
        <svg className="w-full h-full absolute" viewBox="0 0 100 100">
          <circle 
            cx="50" 
            cy="50" 
            r="40" 
            fill="transparent" 
            stroke="currentColor" 
            strokeWidth="8"
            className="text-cyber-darker"
          />
        </svg>
        
        {/* Progress circle */}
        <svg className="w-full h-full absolute -rotate-90" viewBox="0 0 100 100">
          <circle 
            cx="50" 
            cy="50" 
            r="40" 
            fill="transparent" 
            stroke="currentColor" 
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className={cn("transition-all duration-1000 ease-out", getColor())}
          />
        </svg>
        
        {/* Score text */}
        <div className="absolute flex flex-col items-center">
          <span className={cn("text-4xl font-bold", getColor())}>
            {Math.round(displayScore)}
          </span>
          <span className={cn("text-sm font-mono mt-1", getColor())}>
            {getThreatLevel()}
          </span>
        </div>
      </div>
      
      <div className="mt-4 w-full grid grid-cols-3 gap-2">
        <div className="text-center">
          <div className="h-2 bg-green-400 rounded-full mb-1"></div>
          <span className="text-xs text-gray-400">Low</span>
        </div>
        <div className="text-center">
          <div className="h-2 bg-yellow-400 rounded-full mb-1"></div>
          <span className="text-xs text-gray-400">Medium</span>
        </div>
        <div className="text-center">
          <div className="h-2 bg-red-400 rounded-full mb-1"></div>
          <span className="text-xs text-gray-400">High</span>
        </div>
      </div>
    </div>
  );
}
