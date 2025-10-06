
import { useEffect, useRef, useState } from "react";
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
import { getAuth } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase";

interface AttackData {
  category: string;
  count: number;
  color: string;
  icon: any; // Lucide icon component
  risk: "high" | "medium" | "low";
  description: string;
}



export function AttackSummary() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [attackData, setAttackData] = useState<AttackData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAttackData = async () => {
      setLoading(true);
      setError(null);
      try {
        const user = getAuth().currentUser;
        if (!user) {
          setError("User not authenticated");
          setLoading(false);
          return;
        }
        const docRef = doc(db, "users", user.uid, "dashboard", "attackSummary");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setAttackData(docSnap.data().attackData || []);
        } else {
          setAttackData([]);
        }
      } catch (e: any) {
        setError(e.message || "Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };
    fetchAttackData();
  }, []);

  // Total attacks
  const totalAttacks = attackData.reduce((acc, item) => acc + item.count, 0);

  // Render pie chart
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    canvas.width = 160;
    canvas.height = 160;
    let startAngle = 0;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) * 0.8;
    attackData.forEach(item => {
      const segmentAngle = (item.count / totalAttacks) * 2 * Math.PI;
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngle, startAngle + segmentAngle);
      ctx.closePath();
      ctx.fillStyle = item.color;
      ctx.fill();
      startAngle += segmentAngle;
    });
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius * 0.6, 0, 2 * Math.PI);
    ctx.fillStyle = "#1A1F2C";
    ctx.fill();
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "white";
    ctx.font = "bold 24px Inter";
    ctx.fillText(totalAttacks.toString(), centerX, centerY - 10);
    ctx.font = "12px Inter";
    ctx.fillText("ATTACKS TODAY", centerX, centerY + 10);
  }, [attackData, totalAttacks]);

  // Helper for risk badge color
  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "high": return "bg-red-500/20 text-red-400 border-red-500/40";
      case "medium": return "bg-orange-500/20 text-orange-400 border-orange-500/40";
      case "low": return "bg-blue-500/20 text-blue-400 border-blue-500/40";
      default: return "bg-gray-500/20 text-gray-400 border-gray-500/40";
    }
  };

  if (loading) {
    return <Card className="cyber-card h-full flex items-center justify-center"><span className="text-gray-400">Loading attack summary...</span></Card>;
  }
  if (error) {
    return <Card className="cyber-card h-full flex items-center justify-center"><span className="text-red-400">{error}</span></Card>;
  }
  if (!attackData.length) {
    return <Card className="cyber-card h-full flex items-center justify-center"><span className="text-gray-400">No attack data available.</span></Card>;
  }

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
              const IconComponent = item.icon || Terminal;
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

