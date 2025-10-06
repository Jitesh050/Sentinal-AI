import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
// Define VisualizationType locally since it's not exported
import ScannerVisualization from "@/components/scanner/ScannerVisualization";
type VisualizationType = 'sql' | 'ddos' | 'mitm' | 'idle';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check, Search, Shield, Loader2 } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { useScan } from "@/contexts/ScanContext";

const ScannerPage = () => {
  const { scanResult, scanOptions, setScanOptions, triggerScan, loading, error } = useScan();
  const [target, setTarget] = useState(scanOptions.url || "");
  const [scanType, setScanType] = useState<"Quick" | "Full" | "Custom">((scanOptions.scanType as "Quick" | "Full" | "Custom") || "Quick");
  const [progress, setProgress] = useState(0);

  // Map scanType to visualization type
  function getVisualizationType(type: "Quick" | "Full" | "Custom"): VisualizationType {
    switch (type) {
      case "Quick": return "sql";
      case "Full": return "ddos";
      case "Custom": return "mitm";
      default: return "sql";
    }
  }

  useEffect(() => {
    setTarget(scanOptions.url || "");
    setScanType((scanOptions.scanType as "Quick" | "Full" | "Custom") || "Quick");
  }, [scanOptions]);

  useEffect(() => {
    if (loading) {
      setProgress(0);
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + Math.random() * 15;
        });
      }, 600);
      return () => clearInterval(interval);
    } else if (!loading && progress < 100) {
      setProgress(100);
    }
  }, [loading]);

  const handleStartScan = async () => {
    if (!target.trim()) {
      toast.error("Please enter a valid target");
      return;
    }
    setScanOptions({ url: target, scanType });
    await triggerScan({ url: target, scanType });
  };

  const getSeverityClass = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-500/20 text-red-400 border-red-500/40";
      case "high":
        return "bg-orange-500/20 text-orange-400 border-orange-500/40";
      case "medium":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/40";
      case "low":
        return "bg-blue-500/20 text-blue-400 border-blue-500/40";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/40";
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Security Scanner</h1>

      {/* Visualization */}
      <ScannerVisualization scanType={getVisualizationType(scanType)} isScanning={loading} progress={progress} />

      <Card className="cyber-card">
        <CardHeader>
          <CardTitle>Configure Scan</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="basic">Basic Scan</TabsTrigger>
              <TabsTrigger value="advanced">Advanced Options</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4 pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="target">Target URL or IP</Label>
                  <Input
                    id="target"
                    placeholder="https://example.com or 192.168.1.1"
                    className="cyber-input"
                    value={target}
                    onChange={(e) => setTarget(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="scanType">Scan Type</Label>
                  <Select value={scanType} onValueChange={v => setScanType(v as "Quick" | "Full" | "Custom")}>
                    <SelectTrigger className="cyber-input">
                      <SelectValue placeholder="Select scan type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Quick">Quick Scan</SelectItem>
                      <SelectItem value="Full">Full Scan</SelectItem>
                      <SelectItem value="Custom">Custom Scan</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button className="cyber-button w-full" onClick={handleStartScan} disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Scanning...
                  </>
                ) : (
                  <>
                    <Search className="mr-2 h-4 w-4" />
                    Start Scan
                  </>
                )}
              </Button>
            </TabsContent>

            <TabsContent value="advanced" className="space-y-4 pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="port-range">Port Range</Label>
                  <Input
                    id="port-range"
                    placeholder="1-1000"
                    className="cyber-input"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="threads">Thread Count</Label>
                  <Input
                    id="threads"
                    placeholder="10"
                    type="number"
                    className="cyber-input"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="user-agent">User Agent</Label>
                <Input
                  id="user-agent"
                  placeholder="Mozilla/5.0..."
                  className="cyber-input"
                />
              </div>
            </TabsContent>
          </Tabs>

          {/* Scan Progress */}
          {loading && (
            <div className="mt-6 space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-400">Scan in progress...</span>
                <span className="text-sm font-mono text-cyber-blue">{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-1" />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results */}
      {scanResult && (
        <Card className="cyber-card">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Scan Results</CardTitle>
              <div className="flex items-center">
                <Check className="h-4 w-4 text-green-400 mr-1" />
                <span className="text-sm text-gray-400">Scan completed</span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <h3 className="text-lg font-semibold mb-4">Vulnerabilities Found</h3>
            <div className="space-y-4">
              {scanResult.vulnerabilities.map((vuln, i) => (
                <div key={i} className="border border-cyber-blue/20 rounded-md p-4">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <h4 className="font-medium text-gray-200">{vuln.name}</h4>
                      <p className="text-sm text-gray-400">{vuln.description}</p>
                    </div>
                    <div className={`px-2 py-1 text-xs font-medium rounded border ${getSeverityClass(vuln.severity)}`}>
                      {vuln.severity.toUpperCase()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ScannerPage;
