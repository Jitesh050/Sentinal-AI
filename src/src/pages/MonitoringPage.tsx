
import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ThreatFeed } from "@/components/monitoring/ThreatFeed";
import { ActivityHeatmap } from "@/components/monitoring/ActivityHeatmap";
import { LogViewer } from "@/components/monitoring/LogViewer";
import { LiveAlertPanel } from "@/components/monitoring/LiveAlertPanel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Terminal, ArrowDown, Pause, Play, BellRing } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const MonitoringPage = () => {
  const [isPaused, setIsPaused] = useState(false);
  const [activeTab, setActiveTab] = useState<"all" | "high" | "medium" | "low">("all");
  
  // Simulation of a new alert
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isPaused) {
        toast({
          title: "New Attack Detected",
          description: "SQL Injection attempt from 45.124.36.92",
          variant: "destructive"
        });
      }
    }, 15000);
    
    return () => clearTimeout(timer);
  }, [isPaused]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Real-time Monitoring</h1>
          <p className="text-sm text-gray-400 mt-1">
            Live threat detection and attack visualization
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center space-x-2">
            <div className={`h-2 w-2 rounded-full ${isPaused ? "bg-yellow-500" : "bg-green-500 animate-pulse"}`}></div>
            <span className="text-sm text-gray-300">{isPaused ? "Feed Paused" : "Live"}</span>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
            onClick={() => setIsPaused(!isPaused)}
          >
            {isPaused ? <Play size={16} /> : <Pause size={16} />}
            {isPaused ? "Resume" : "Pause"}
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Threat Feed */}
        <Card className="cyber-card lg:col-span-1">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-mono text-gray-300 flex items-center gap-2">
                <BellRing size={18} className="text-cyber-blue" />
                Live Threat Feed
              </CardTitle>
              
              <Button variant="ghost" size="sm" className="h-8 gap-1 text-xs">
                <ArrowDown size={14} />
                Scroll to Latest
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="border-b border-cyber-blue/20">
              <Tabs 
                value={activeTab} 
                onValueChange={(v) => setActiveTab(v as any)}
                className="px-4"
              >
                <TabsList>
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="high">High</TabsTrigger>
                  <TabsTrigger value="medium">Medium</TabsTrigger>
                  <TabsTrigger value="low">Low</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            <ThreatFeed isPaused={isPaused} filter={activeTab} />
          </CardContent>
        </Card>
        
        {/* Activity Heatmap and Live Alerts */}
        <div className="lg:col-span-2 space-y-6">
          {/* Activity Heatmap */}
          <Card className="cyber-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-mono text-gray-300">Activity Heatmap</CardTitle>
            </CardHeader>
            <CardContent>
              <ActivityHeatmap />
            </CardContent>
          </Card>
          
          {/* Live Alerts Panel */}
          <LiveAlertPanel isPaused={isPaused} />
        </div>
      </div>
      
      {/* Log Viewer */}
      <Card className="cyber-card">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-mono text-gray-300 flex items-center gap-2">
              <Terminal size={18} className="text-cyber-blue" />
              Live Log Viewer
            </CardTitle>
            
            <Button 
              variant="outline"
              size="sm"
              className="h-8 gap-1 text-xs"
              onClick={() => setIsPaused(!isPaused)}
            >
              {isPaused ? <Play size={16} /> : <Pause size={16} />}
              {isPaused ? "Resume" : "Pause"}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <LogViewer isPaused={isPaused} />
        </CardContent>
      </Card>
    </div>
  );
};

export default MonitoringPage;
