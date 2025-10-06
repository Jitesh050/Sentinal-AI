
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface MLPrediction {
  attackType: string;
  risk: "Low" | "Medium" | "High";
  confidence: number;
  details: string;
}

// Sample predictions
const predictions: MLPrediction[] = [
  {
    attackType: "SQL Injection",
    risk: "High",
    confidence: 93,
    details: "Pattern matching detected potential SQL injection attempt on login form"
  },
  {
    attackType: "Brute Force",
    risk: "Medium",
    confidence: 78,
    details: "Multiple failed login attempts from same IP range"
  },
  {
    attackType: "XSS",
    risk: "Low",
    confidence: 65,
    details: "Suspicious script tags detected in user comments"
  }
];

export function MLPredictions() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [animateOut, setAnimateOut] = useState(false);
  
  const currentPrediction = predictions[currentIndex];
  
  // Color mapping for risk levels
  const riskColorMap = {
    Low: "bg-green-500/20 text-green-400 border-green-500/40",
    Medium: "bg-yellow-500/20 text-yellow-400 border-yellow-500/40",
    High: "bg-red-500/20 text-red-400 border-red-500/40"
  };
  
  // Rotate through predictions
  useEffect(() => {
    const timer = setInterval(() => {
      setAnimateOut(true);
      
      // After animation out, change to next prediction
      setTimeout(() => {
        setCurrentIndex(prev => (prev + 1) % predictions.length);
        setAnimateOut(false);
      }, 500);
    }, 5000);
    
    return () => clearInterval(timer);
  }, []);
  
  return (
    <Card className="cyber-card h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-mono text-gray-300">ML Predictions</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className={cn(
          "transition-all duration-500",
          animateOut ? "opacity-0 transform translate-y-4" : "opacity-100 transform translate-y-0"
        )}>
          <div className="mb-4 flex justify-between items-center">
            <h3 className="text-xl font-mono text-white">{currentPrediction.attackType}</h3>
            <Badge className={riskColorMap[currentPrediction.risk]}>
              {currentPrediction.risk} Risk
            </Badge>
          </div>
          
          <div className="mb-4">
            <div className="flex justify-between mb-1">
              <span className="text-xs text-gray-400">Confidence</span>
              <span className="text-xs font-mono text-gray-300">{currentPrediction.confidence}%</span>
            </div>
            <div className="h-2 bg-gray-700 rounded-full">
              <div 
                className="h-2 bg-cyber-blue rounded-full transition-all duration-1000"
                style={{ width: `${currentPrediction.confidence}%` }}
              />
            </div>
          </div>
          
          <p className="text-sm text-gray-300 mb-4">{currentPrediction.details}</p>
          
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span>ML Model v2.4</span>
            <span>Updated 2 min ago</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
