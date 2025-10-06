
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, Shield, AlertCircle, Info, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface Alert {
  id: string;
  type: "critical" | "warning" | "info";
  message: string;
  source: string;
  time: string;
}

// Sample alerts
const initialAlerts: Alert[] = [
  {
    id: "alert-1",
    type: "critical",
    message: "Multiple SSH login failures detected",
    source: "192.168.1.105",
    time: "2 min ago"
  },
  {
    id: "alert-2",
    type: "warning",
    message: "Unusual file access pattern detected",
    source: "user.admin",
    time: "5 min ago"
  },
  {
    id: "alert-3",
    type: "critical",
    message: "Possible SQL injection attempt",
    source: "web-app-1",
    time: "7 min ago"
  },
  {
    id: "alert-4",
    type: "info",
    message: "SSL certificate expires in 7 days",
    source: "web-server",
    time: "20 min ago"
  },
  {
    id: "alert-5",
    type: "warning",
    message: "Excessive failed login attempts",
    source: "auth-service",
    time: "25 min ago"
  }
];

export function LiveAlerts() {
  const [alerts, setAlerts] = useState(initialAlerts);
  
  // Icon mapping for alert types
  const iconMap = {
    critical: AlertCircle,
    warning: AlertTriangle,
    info: Info
  };
  
  // Color mapping for alert types
  const colorMap = {
    critical: "text-red-400",
    warning: "text-yellow-400",
    info: "text-blue-400"
  };
  
  // Dismiss alert
  const dismissAlert = (id: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
  };
  
  // Add random new alert periodically
  useEffect(() => {
    const newAlertTypes = [
      {
        type: "critical" as const,
        messages: [
          "DDoS attack detected on port 80",
          "Firewall breach attempted",
          "Unauthorized root access detected"
        ]
      },
      {
        type: "warning" as const,
        messages: [
          "CPU usage exceeding 90%",
          "Network traffic spike detected",
          "Multiple invalid authentication attempts"
        ]
      },
      {
        type: "info" as const,
        messages: [
          "System update available",
          "Scheduled backup completed",
          "New device connected to network"
        ]
      }
    ];
    
    const timer = setInterval(() => {
      if (Math.random() > 0.7) {
        const typeIndex = Math.floor(Math.random() * newAlertTypes.length);
        const messageIndex = Math.floor(Math.random() * newAlertTypes[typeIndex].messages.length);
        
        const newAlert: Alert = {
          id: `alert-${Date.now()}`,
          type: newAlertTypes[typeIndex].type,
          message: newAlertTypes[typeIndex].messages[messageIndex],
          source: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
          time: "Just now"
        };
        
        setAlerts(prev => [newAlert, ...prev.slice(0, 4)]);
      }
    }, 8000);
    
    return () => clearInterval(timer);
  }, []);
  
  return (
    <Card className="cyber-card h-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-mono text-gray-300">Live Alerts</CardTitle>
          <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse"></div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-cyber-blue/20">
          {alerts.map((alert, index) => {
            const IconComponent = iconMap[alert.type];
            return (
              <div 
                key={alert.id}
                className={cn(
                  "p-4 flex items-start gap-3",
                  index === 0 ? "animate-pulse-glow" : ""
                )}
              >
                <div className={cn("mt-0.5", colorMap[alert.type])}>
                  <IconComponent size={18} />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <p className="text-sm font-medium text-gray-200">{alert.message}</p>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-6 w-6 text-gray-400 hover:text-gray-200"
                      onClick={() => dismissAlert(alert.id)}
                    >
                      <X size={14} />
                    </Button>
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="text-xs text-gray-400">Source: {alert.source}</span>
                    <span className="text-xs text-gray-500">{alert.time}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
