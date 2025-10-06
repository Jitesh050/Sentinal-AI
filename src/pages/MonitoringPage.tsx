
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

import { useScan } from "@/contexts/ScanContext";

const MonitoringPage = () => {
  const [isPaused, setIsPaused] = useState(false);
  const [activeTab, setActiveTab] = useState<"all" | "high" | "medium" | "low">("all");
  
  const { scanResult, lastUpdated, refreshAllPages } = useScan();
  const [forceUpdate, setForceUpdate] = useState(0);
  
  // Force refresh when scan results change
  useEffect(() => {
    if (lastUpdated) {
      console.log('MonitoringPage: Detected scan result update, refreshing with URL:', scanResult?.url);
      setForceUpdate(prev => prev + 1);
    }
  }, [lastUpdated, scanResult?.url]);
  
  // Force refresh on component mount
  useEffect(() => {
    console.log('MonitoringPage: Component mounted, refreshing');
    refreshAllPages();
  }, []);
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
      
      {/* Show scan result for current URL if available */}
      {scanResult && (
        <div className="grid grid-cols-1 gap-6">
          <Card className="cyber-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-mono text-cyber-blue flex items-center gap-2">
                <span>Latest Scan Results</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <span className="font-mono text-gray-400 text-xs">URL:</span>
                <span className="ml-2 text-cyber-blue font-mono text-xs">{scanResult?.url || scanResult?.scanOptions?.url || "(unknown)"}</span>
              </div>
              <div className="flex flex-wrap gap-4 mb-4">
                <div className="flex flex-col items-center justify-center p-2 bg-cyber-darker rounded-lg border border-cyber-blue/30">
                  <span className="text-red-400 text-lg font-bold">{scanResult?.vulnerabilities?.filter?.(v => v.severity === 'critical').length ?? 0}</span>
                  <span className="text-xs text-gray-400 mt-1">Critical</span>
                </div>
                <div className="flex flex-col items-center justify-center p-2 bg-cyber-darker rounded-lg border border-cyber-blue/30">
                  <span className="text-orange-400 text-lg font-bold">{scanResult?.vulnerabilities?.filter?.(v => v.severity === 'high').length ?? 0}</span>
                  <span className="text-xs text-gray-400 mt-1">High</span>
                </div>
                <div className="flex flex-col items-center justify-center p-2 bg-cyber-darker rounded-lg border border-cyber-blue/30">
                  <span className="text-yellow-400 text-lg font-bold">{scanResult?.vulnerabilities?.filter?.(v => v.severity === 'medium').length ?? 0}</span>
                  <span className="text-xs text-gray-400 mt-1">Medium</span>
                </div>
                <div className="flex flex-col items-center justify-center p-2 bg-cyber-darker rounded-lg border border-cyber-blue/30">
                  <span className="text-green-400 text-lg font-bold">{scanResult?.vulnerabilities?.filter?.(v => v.severity === 'low').length ?? 0}</span>
                  <span className="text-xs text-gray-400 mt-1">Low</span>
                </div>
              </div>
              {scanResult?.alerts?.length > 0 && (
                <div className="mt-2">
                  <div className="font-mono text-xs text-gray-400 mb-1">Recent Alerts</div>
                  <ul className="space-y-1">
                    {scanResult.alerts.map((alert: any, idx: number) => (
                      <li key={idx} className="bg-cyber-darker/80 border border-cyber-blue/20 rounded px-2 py-1 text-xs text-cyber-orange">
                        {alert.message || alert.title || JSON.stringify(alert)}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {scanResult?.vulnerabilities?.length > 0 && (
                <div className="overflow-x-auto rounded-md border border-cyber-blue/20 mb-4">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="bg-cyber-darker">
                        <th className="px-2 py-1 text-left text-[10px] uppercase text-gray-400">Severity</th>
                        <th className="px-2 py-1 text-left text-[10px] uppercase text-gray-400">Vulnerability</th>
                        <th className="px-2 py-1 text-left text-[10px] uppercase text-gray-400">Endpoint</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-cyber-blue/20">
                      {scanResult.vulnerabilities.map((vuln: any) => (
                        <tr key={vuln.id} className="hover:bg-cyber-blue/5 transition-colors">
                          <td className="px-2 py-2">
                            <span className={`px-2 py-1 rounded text-white text-xs ${
                              vuln.severity === 'critical' ? 'bg-red-500/80' :
                              vuln.severity === 'high' ? 'bg-orange-500/80' :
                              vuln.severity === 'medium' ? 'bg-yellow-500/80 text-black' :
                              'bg-blue-500/80'
                            }`}>
                              {vuln.severity}
                            </span>
                          </td>
                          <td className="px-2 py-2">
                            <div className="font-medium text-gray-200">{vuln.name}</div>
                            <div className="text-[10px] text-gray-500 mt-1">{vuln.cve || "No CVE"}</div>
                          </td>
                          <td className="px-2 py-2">
                            <div className="text-gray-300 font-mono">{vuln.affectedEndpoint}</div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              {scanResult?.alerts?.length > 0 && (
                <div className="mt-2">
                  <div className="font-mono text-xs text-gray-400 mb-1">Recent Alerts</div>
                  <ul className="space-y-1">
                    {scanResult.alerts.map((alert: any, idx: number) => (
                      <li key={idx} className="bg-cyber-darker/80 border border-cyber-blue/20 rounded px-2 py-1 text-xs text-cyber-orange">
                        {alert.message || alert.title || JSON.stringify(alert)}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
      
      {/* Threat Feed */}
      <Card className="cyber-card">
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
}

export default MonitoringPage;
