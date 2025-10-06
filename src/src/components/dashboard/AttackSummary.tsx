
import { useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { 
  Terminal, 
  ShieldAlert, 
  Webhook, 
  BarChart, 
  AlertTriangle, 
  CircleX 
} from "lucide-react";

interface AttackData {
  category: string;
  count: number;
  color: string;
  icon: any; // Lucide icon component
  risk: "high" | "medium" | "low";
  description: string;
}

// Enhanced attack data for the summary
const attackData: AttackData[] = [
  { 
    category: "SQL Injection", 
    count: 37, 
    color: "#0FA0CE", 
    icon: Terminal,
    risk: "high",
    description: "Malicious SQL code insertion attempts"
  },
  { 
    category: "XSS", 
    count: 24, 
    color: "#8B5CF6", 
    icon: Webhook,
    risk: "medium",
    description: "Cross-site scripting in form inputs"
  },
  { 
    category: "CSRF", 
    count: 12, 
    color: "#F97316", 
    icon: AlertTriangle,
    risk: "medium",
    description: "Cross-site request forgery attempts"
  },
  { 
    category: "DDoS", 
    count: 18, 
    color: "#EA384C", 
    icon: BarChart,
    risk: "high",
    description: "Distributed denial of service attacks"
  },
  { 
    category: "Auth Bypass", 
    count: 15, 
    color: "#D946EF", 
    icon: ShieldAlert,
    risk: "high",
    description: "Authentication bypass attempts"
  },
  { 
    category: "File Inclusion", 
    count: 8, 
    color: "#10B981", 
    icon: CircleX,
    risk: "low",
    description: "Remote/local file inclusion attempts"
  },
];

export function AttackSummary() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Total attacks
  const totalAttacks = attackData.reduce((acc, item) => acc + item.count, 0);
  
  // Render pie chart
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    // Set canvas dimensions
    canvas.width = 160;
    canvas.height = 160;
    
    // Draw pie chart
    let startAngle = 0;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) * 0.8;
    
    attackData.forEach(item => {
      // Calculate segment angle
      const segmentAngle = (item.count / totalAttacks) * 2 * Math.PI;
      
      // Draw segment
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngle, startAngle + segmentAngle);
      ctx.closePath();
      
      // Fill segment
      ctx.fillStyle = item.color;
      ctx.fill();
      
      // Update start angle for next segment
      startAngle += segmentAngle;
    });
    
    // Draw inner circle for donut effect
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius * 0.6, 0, 2 * Math.PI);
    ctx.fillStyle = "#1A1F2C";
    ctx.fill();
    
    // Draw total attacks in center
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "white";
    ctx.font = "bold 24px Inter";
    ctx.fillText(totalAttacks.toString(), centerX, centerY - 10);
    ctx.font = "12px Inter";
    ctx.fillText("ATTACKS TODAY", centerX, centerY + 10);
    
  }, [totalAttacks]);
  
  // Helper for risk badge color
  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "high": return "bg-red-500/20 text-red-400 border-red-500/40";
      case "medium": return "bg-orange-500/20 text-orange-400 border-orange-500/40";
      case "low": return "bg-blue-500/20 text-blue-400 border-blue-500/40";
      default: return "bg-gray-500/20 text-gray-400 border-gray-500/40";
    }
  };
  
  return (
    <Card className="cyber-card h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-mono text-gray-300">Attack Summary</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col p-4 gap-4">
        <div className="flex items-center justify-center">
          <div className="relative w-[160px] h-[160px]">
            <canvas ref={canvasRef} />
          </div>
        </div>
        
        <ScrollArea className="flex-1 pr-4 max-h-[180px]">
          <div className="space-y-3">
            {attackData.map((item, index) => {
              const IconComponent = item.icon;
              return (
                <div key={index} className="flex items-center gap-3 p-2 rounded-md hover:bg-cyber-blue/5 transition-colors">
                  <div
                    className="w-8 h-8 rounded-md flex items-center justify-center"
                    style={{ backgroundColor: `${item.color}20` }}
                  >
                    <IconComponent size={16} style={{ color: item.color }} />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium text-sm text-gray-300">{item.category}</h4>
                        <Badge className={getRiskColor(item.risk)}>
                          {item.risk}
                        </Badge>
                      </div>
                      <span className="text-sm font-mono text-gray-400">{item.count}</span>
                    </div>
                    
                    <p className="text-xs text-gray-500 mt-0.5 truncate" title={item.description}>
                      {item.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
