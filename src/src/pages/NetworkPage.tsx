
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Network as NetworkIcon, 
  Circle, 
  Square, 
  Triangle,
  Filter, 
  AlertCircle, 
  Shield, 
  Timer
} from "lucide-react";
import { NetworkVisualization } from "@/components/network/NetworkVisualization";
import { NetworkLegend } from "@/components/network/NetworkLegend";

const NetworkPage = () => {
  const [nodeTypeFilters, setNodeTypeFilters] = useState({
    web: true,
    db: true,
    external: true,
    iot: true
  });
  
  const [severityFilters, setSeverityFilters] = useState({
    critical: true,
    high: true,
    medium: true,
    low: true
  });
  
  const [attackTypeFilters, setAttackTypeFilters] = useState({
    dos: true,
    injection: true,
    xss: true,
    bruteforce: true,
    malware: true
  });
  
  const [timeFilter, setTimeFilter] = useState<"hour" | "day" | "week">("day");
  
  // Toggle node type filter
  const toggleNodeType = (type: keyof typeof nodeTypeFilters) => {
    setNodeTypeFilters(prev => ({ ...prev, [type]: !prev[type] }));
  };
  
  // Toggle severity filter
  const toggleSeverity = (severity: keyof typeof severityFilters) => {
    setSeverityFilters(prev => ({ ...prev, [severity]: !prev[severity] }));
  };
  
  // Toggle attack type filter
  const toggleAttackType = (type: keyof typeof attackTypeFilters) => {
    setAttackTypeFilters(prev => ({ ...prev, [type]: !prev[type] }));
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Network Visualization</h1>
      </div>
      
      {/* Filters Toolbar */}
      <Card className="cyber-card">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-mono text-gray-300 flex items-center gap-2">
              <Filter size={18} className="text-cyber-blue" />
              Visualization Filters
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Node Type Filters */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-gray-300">Node Types</h3>
              <div className="flex flex-wrap gap-2">
                <Badge 
                  className={`cursor-pointer hover:opacity-80 ${nodeTypeFilters.web ? 'bg-cyber-blue/20 text-cyber-blue border-cyber-blue/40' : 'bg-gray-700/20 text-gray-500 border-gray-700/40'}`}
                  onClick={() => toggleNodeType('web')}
                >
                  <Circle size={8} className="mr-1" /> Web
                </Badge>
                <Badge 
                  className={`cursor-pointer hover:opacity-80 ${nodeTypeFilters.db ? 'bg-cyber-blue/20 text-cyber-blue border-cyber-blue/40' : 'bg-gray-700/20 text-gray-500 border-gray-700/40'}`}
                  onClick={() => toggleNodeType('db')}
                >
                  <Square size={8} className="mr-1" /> Database
                </Badge>
                <Badge 
                  className={`cursor-pointer hover:opacity-80 ${nodeTypeFilters.external ? 'bg-cyber-blue/20 text-cyber-blue border-cyber-blue/40' : 'bg-gray-700/20 text-gray-500 border-gray-700/40'}`}
                  onClick={() => toggleNodeType('external')}
                >
                  <Triangle size={8} className="mr-1" /> External
                </Badge>
                <Badge 
                  className={`cursor-pointer hover:opacity-80 ${nodeTypeFilters.iot ? 'bg-cyber-blue/20 text-cyber-blue border-cyber-blue/40' : 'bg-gray-700/20 text-gray-500 border-gray-700/40'}`}
                  onClick={() => toggleNodeType('iot')}
                >
                  IoT
                </Badge>
              </div>
            </div>
            
            {/* Severity Filters */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-gray-300">Severity</h3>
              <div className="flex flex-wrap gap-2">
                <Badge 
                  className={`cursor-pointer hover:opacity-80 ${severityFilters.critical ? 'bg-red-500/20 text-red-400 border-red-500/40' : 'bg-gray-700/20 text-gray-500 border-gray-700/40'}`}
                  onClick={() => toggleSeverity('critical')}
                >
                  <AlertCircle size={8} className="mr-1" /> Critical
                </Badge>
                <Badge 
                  className={`cursor-pointer hover:opacity-80 ${severityFilters.high ? 'bg-orange-500/20 text-orange-400 border-orange-500/40' : 'bg-gray-700/20 text-gray-500 border-gray-700/40'}`}
                  onClick={() => toggleSeverity('high')}
                >
                  <AlertCircle size={8} className="mr-1" /> High
                </Badge>
                <Badge 
                  className={`cursor-pointer hover:opacity-80 ${severityFilters.medium ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40' : 'bg-gray-700/20 text-gray-500 border-gray-700/40'}`}
                  onClick={() => toggleSeverity('medium')}
                >
                  Medium
                </Badge>
                <Badge 
                  className={`cursor-pointer hover:opacity-80 ${severityFilters.low ? 'bg-blue-500/20 text-blue-400 border-blue-500/40' : 'bg-gray-700/20 text-gray-500 border-gray-700/40'}`}
                  onClick={() => toggleSeverity('low')}
                >
                  <Shield size={8} className="mr-1" /> Low
                </Badge>
              </div>
            </div>
            
            {/* Time Filters */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-gray-300">Time Range</h3>
              <div className="flex gap-2">
                <Badge 
                  className={`cursor-pointer hover:opacity-80 ${timeFilter === 'hour' ? 'bg-cyber-blue/20 text-cyber-blue border-cyber-blue/40' : 'bg-gray-700/20 text-gray-500 border-gray-700/40'}`}
                  onClick={() => setTimeFilter('hour')}
                >
                  <Timer size={8} className="mr-1" /> Last Hour
                </Badge>
                <Badge 
                  className={`cursor-pointer hover:opacity-80 ${timeFilter === 'day' ? 'bg-cyber-blue/20 text-cyber-blue border-cyber-blue/40' : 'bg-gray-700/20 text-gray-500 border-gray-700/40'}`}
                  onClick={() => setTimeFilter('day')}
                >
                  <Timer size={8} className="mr-1" /> Last Day
                </Badge>
                <Badge 
                  className={`cursor-pointer hover:opacity-80 ${timeFilter === 'week' ? 'bg-cyber-blue/20 text-cyber-blue border-cyber-blue/40' : 'bg-gray-700/20 text-gray-500 border-gray-700/40'}`}
                  onClick={() => setTimeFilter('week')}
                >
                  <Timer size={8} className="mr-1" /> Last Week
                </Badge>
              </div>
            </div>
          </div>
          
          <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Attack Type Filters */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-gray-300">Attack Types</h3>
              <div className="flex flex-wrap gap-2">
                <Badge 
                  className={`cursor-pointer hover:opacity-80 ${attackTypeFilters.dos ? 'bg-cyber-blue/20 text-cyber-blue border-cyber-blue/40' : 'bg-gray-700/20 text-gray-500 border-gray-700/40'}`}
                  onClick={() => toggleAttackType('dos')}
                >
                  DoS
                </Badge>
                <Badge 
                  className={`cursor-pointer hover:opacity-80 ${attackTypeFilters.injection ? 'bg-cyber-blue/20 text-cyber-blue border-cyber-blue/40' : 'bg-gray-700/20 text-gray-500 border-gray-700/40'}`}
                  onClick={() => toggleAttackType('injection')}
                >
                  Injection
                </Badge>
                <Badge 
                  className={`cursor-pointer hover:opacity-80 ${attackTypeFilters.xss ? 'bg-cyber-blue/20 text-cyber-blue border-cyber-blue/40' : 'bg-gray-700/20 text-gray-500 border-gray-700/40'}`}
                  onClick={() => toggleAttackType('xss')}
                >
                  XSS
                </Badge>
                <Badge 
                  className={`cursor-pointer hover:opacity-80 ${attackTypeFilters.bruteforce ? 'bg-cyber-blue/20 text-cyber-blue border-cyber-blue/40' : 'bg-gray-700/20 text-gray-500 border-gray-700/40'}`}
                  onClick={() => toggleAttackType('bruteforce')}
                >
                  Brute Force
                </Badge>
                <Badge 
                  className={`cursor-pointer hover:opacity-80 ${attackTypeFilters.malware ? 'bg-cyber-blue/20 text-cyber-blue border-cyber-blue/40' : 'bg-gray-700/20 text-gray-500 border-gray-700/40'}`}
                  onClick={() => toggleAttackType('malware')}
                >
                  Malware
                </Badge>
              </div>
            </div>
            
            {/* Quick Actions */}
            <div className="flex items-center justify-end gap-2">
              <Button variant="outline" size="sm" className="gap-2">
                <NetworkIcon size={14} />
                Isolate Node
              </Button>
              <Button className="bg-cyber-blue hover:bg-cyber-blue/90 text-black" size="sm">
                <Shield size={14} className="mr-1" />
                Focused Scan
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Network Visualization */}
      <div className="grid grid-cols-1 gap-6">
        <Card className="cyber-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-mono text-gray-300 flex items-center gap-2">
              <NetworkIcon size={18} className="text-cyber-blue" />
              Network Graph
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="flex lg:flex-row flex-col gap-4">
              <div className="lg:w-3/4 w-full">
                <NetworkVisualization 
                  nodeTypeFilters={nodeTypeFilters}
                  severityFilters={severityFilters}
                  attackTypeFilters={attackTypeFilters}
                  timeFilter={timeFilter}
                />
              </div>
              
              <div className="lg:w-1/4 w-full">
                <NetworkLegend />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NetworkPage;
