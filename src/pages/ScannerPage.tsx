import { useState, useEffect } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { 
  LayoutGrid, 
  List, 
  AlertTriangle, 
  Shield, 
  AlertCircle, 
  Check, 
  Play, 
  Download, 
  Wrench,
  ArrowRight,
  Database,
  Code,
  Zap,
  Info
} from "lucide-react";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent
} from "@/components/ui/tooltip";
import ScannerVisualization, { VisualizationType } from "@/components/scanner/ScannerVisualization";
import ExportPDFButton from "@/components/scanner/ExportPDFButton";
// Import 2D attack animation components
import DDoSAttack from "@/components/scanner/DDoSAttack";
import MitmAttack from "@/components/scanner/MitmAttack";
import SQLInjection from "@/components/scanner/SQLInjection";

// Integrate with backend ML scan results
import { useScan } from "@/contexts/ScanContext";

// List of all attack types for dropdowns and probability mapping
const ALL_ATTACK_TYPES: { type: VisualizationType; label: string }[] = [
  { type: 'sql', label: 'SQL Injection' },
  { type: 'mitm', label: 'Man-in-the-Middle' },
  { type: 'ddos', label: 'DDoS' }
];

interface Vulnerability {
  id: string;
  name: string;
  severity: "critical" | "high" | "medium" | "low";
  description: string;
  affectedEndpoint: string;
  cve?: string;
  fixAvailable: boolean;
}

const ScannerPage = () => {
  // All hooks must be called before any return!
  const { scanResult, loading, error, triggerScan, lastUpdated } = useScan();
  const vulnerabilities: Vulnerability[] = scanResult?.vulnerabilities || [];
  const total = vulnerabilities.length;
  const critical = vulnerabilities.filter(v => v.severity === "critical").length;
  const high = vulnerabilities.filter(v => v.severity === "high").length;
  const medium = vulnerabilities.filter(v => v.severity === "medium").length;
  const low = vulnerabilities.filter(v => v.severity === "low").length;
  const [targets, setTargets] = useState<string[]>([""]);
  const [scanType, setScanType] = useState<"Quick" | "Full" | "Custom">("Quick");
  const [scanDepth, setScanDepth] = useState(50);
  const [isScanning, setIsScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [scanComplete, setScanComplete] = useState(false);
  const [currentViewMode, setCurrentViewMode] = useState<"grid" | "list">("list");
  const [visualizationType, setVisualizationType] = useState<"sql" | "ddos" | "mitm" | "idle">("idle");
  const [selectedAttackType, setSelectedAttackType] = useState('sql');

  // List of all available attack animations for preview
  const ATTACK_ANIMATIONS = [
    { type: 'sql', label: 'SQL Injection', component: SQLInjection },
    { type: 'mitm', label: 'Man-in-the-Middle', component: MitmAttack },
    { type: 'ddos', label: 'DDoS', component: DDoSAttack },
  ];

  // Map backend vulnerability types to VisualizationType
  function getAttackTypeFromVuln(vuln: string): VisualizationType {
    if (vuln.toLowerCase().includes('sql')) return 'sql';
    if (vuln.toLowerCase().includes('man-in-the-middle') || vuln.toLowerCase().includes('ssl')) return 'mitm';
    if (vuln.toLowerCase().includes('ddos')) return 'ddos';
    // XSS and related
    if (vuln.toLowerCase().includes('xss')) return 'sql'; // treat XSS as sql for viz
    if (vuln.toLowerCase().includes('insecure cookie')) return 'mitm';
    if (vuln.toLowerCase().includes('rate limit')) return 'ddos';
    return 'idle';
  }

  // Build probabilities for visualization based on backend attackProbabilities if present
  let dropdownOptions = ALL_ATTACK_TYPES.map(a => ({
    type: a.type,
    label: a.label,
    probability: 0
  }));

  if (scanResult && scanResult.attackProbabilities) {
    // Use backend probabilities if present
    dropdownOptions = ALL_ATTACK_TYPES.map(a => {
      let prob = 0;
      if (a.type === 'sql') {
        prob = (scanResult.attackProbabilities.find((p: any) => p.type === 'sql')?.probability || 0)
             + (scanResult.attackProbabilities.find((p: any) => p.type === 'xss')?.probability || 0);
      } else {
        prob = scanResult.attackProbabilities.find((p: any) => p.type === a.type)?.probability || 0;
      }
      return { ...a, probability: prob };
    }).sort((a, b) => b.probability - a.probability);
  } else if (scanResult && scanResult.vulnerabilities) {
    // fallback to old logic if needed
    const attackTypeCounts: Record<VisualizationType, number> = { sql: 0, mitm: 0, ddos: 0, idle: 0 };
    scanResult.vulnerabilities.forEach((v: any) => {
      const type = getAttackTypeFromVuln(v.vulnerability || v.title || v.type || '');
      attackTypeCounts[type] += 1;
    });
    const totalVulns = Object.values(attackTypeCounts).reduce((a, b) => a + b, 0) || 1;
    dropdownOptions = ALL_ATTACK_TYPES.map(a => ({
      ...a,
      probability: attackTypeCounts[a.type] / totalVulns
    })).sort((a, b) => b.probability - a.probability);
  }
  const hasAny = dropdownOptions.some(opt => opt.probability > 0);

  useEffect(() => {
    if (dropdownOptions.length > 0) {
      setSelectedAttackType(dropdownOptions[0].type);
    }
  }, [JSON.stringify(dropdownOptions)]);

  if (loading || isScanning) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] w-full">
        <div className="w-full max-w-xl mx-auto">
          <div className="flex justify-between mb-1 text-sm">
            <span className="text-gray-300">Scanning targets...</span>
            <span className="font-mono text-cyber-blue">{progress}%</span>
          </div>
          <div className="h-2 bg-cyber-darker rounded-full overflow-hidden">
            <div
              className="h-full bg-cyber-blue rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="grid grid-cols-4 gap-2 mt-4">
            {["Initializing", "Port Scanning", "Vulnerability Detection", "Reporting"].map((stage, index) => (
              <div
                key={stage}
                className={`text-center p-2 rounded-md text-xs ${
                  progress < (index + 1) * 25
                    ? "bg-cyber-darker text-gray-500"
                    : "bg-cyber-blue/20 text-cyber-blue"
                }`}
              >
                {stage}
              </div>
            ))}
          </div>
          <div className="mt-8 animate-pulse text-center text-sm text-gray-400">
            {progress < 100 ? "Generating report..." : "Scan complete!"}
          </div>
        </div>
      </div>
    );
  }
  
  if (error) {
    return <div className="py-20 text-center text-red-500 text-lg font-semibold">{error}</div>;
  }

  // Add a new target input
  const addTarget = () => {
    setTargets([...targets, ""]);
  };
  
  // Update target at index
  const updateTarget = (index: number, value: string) => {
    const newTargets = [...targets];
    newTargets[index] = value;
    setTargets(newTargets);
  };
  
  // Remove target at index
  const removeTarget = (index: number) => {
    if (targets.length > 1) {
      const newTargets = [...targets];
      newTargets.splice(index, 1);
      setTargets(newTargets);
    }
  };

  // Start scan
  const startScan = () => {
    setIsScanning(true);
    setScanComplete(false);
    setProgress(0);
    
    // Determine which target to use
    const targetUrl = targets[0] || "";
    
    console.log("Starting scan for URL:", targetUrl);
    
    // Make sure we have a valid URL format
    let formattedUrl = targetUrl;
    if (targetUrl && !targetUrl.startsWith('http')) {
      formattedUrl = `https://${targetUrl}`;
    }
    
    // Trigger actual scan via context
    triggerScan({ 
      url: formattedUrl, 
      scanType: scanType as 'Quick' | 'Full' | 'Custom'
    });
    
    // Simulate progress updates
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsScanning(false);
          setScanComplete(true);
          return 100;
        }
        return prev + 5;
      });
    }, 200);
  };

  // Helper function to get severity color
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical": return "bg-red-500/20 text-red-400 border-red-500/40";
      case "high": return "bg-orange-500/20 text-orange-400 border-orange-500/40";
      case "medium": return "bg-yellow-500/20 text-yellow-400 border-yellow-500/40";
      case "low": return "bg-blue-500/20 text-blue-400 border-blue-500/40";
      default: return "bg-gray-500/20 text-gray-400 border-gray-500/40";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Vulnerability Scanner</h1>
      </div>
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-2">
          {/* Attack Type Dropdown sorted by probability */}
          <div className="w-full max-w-xs">
            <label className="block text-xs text-gray-400 mb-1">Attack Type</label>
            <select
              className="cyber-input w-full bg-cyber-darker/70 text-gray-200 rounded-lg p-2 focus:outline-cyber-blue"
              value={selectedAttackType}
              onChange={e => setSelectedAttackType(e.target.value)}
              disabled={!hasAny}
            >
              {dropdownOptions.map(opt => (
                <option key={opt.type} value={opt.type}>
                  {opt.label} ({(opt.probability * 100).toFixed(1)}%)
                </option>
              ))}
            </select>
          </div>
        </div>
        <ScannerVisualization 
          scanType={selectedAttackType as VisualizationType} 
          isScanning={isScanning} 
          progress={progress} 
          probabilities={dropdownOptions.filter(opt => ['sql','mitm','ddos','idle'].includes(opt.type))} 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Scan configuration */}
        <Card className="cyber-card lg:col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-mono text-gray-300">Scan Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <Label className="text-sm text-gray-300">Target URLs or IP Addresses</Label>
              {targets.map((target, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    placeholder="https://example.com"
                    className="cyber-input"
                    value={target}
                    onChange={e => updateTarget(index, e.target.value)}
                  />
                  {targets.length > 1 && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-400 hover:text-red-300 hover:bg-red-500/20"
                      onClick={() => removeTarget(index)}
                    >
                      <AlertCircle size={16} />
                    </Button>
                  )}
                </div>
              ))}
              <Button variant="ghost" className="cyber-button w-full" onClick={addTarget}>
                Add Target
              </Button>
            </div>
            <div className="space-y-2">
              <Label className="text-sm text-gray-300">Scan Type</Label>
              <Tabs value={scanType} onValueChange={(v) => setScanType(v as "Quick" | "Full" | "Custom")}>
                <TabsList className="grid grid-cols-3">
                  <TabsTrigger value="Quick">Quick</TabsTrigger>
                  <TabsTrigger value="Full">Full</TabsTrigger>
                  <TabsTrigger value="Custom">Custom</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            {scanType === "Custom" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-sm text-gray-300">Scan Depth</Label>
                  <span className="text-sm text-cyber-blue font-mono">{scanDepth}%</span>
                </div>
                <Slider
                  value={[scanDepth]}
                  min={10}
                  max={100}
                  step={10}
                  onValueChange={values => setScanDepth(values[0])}
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Basic</span>
                  <span>Thorough</span>
                </div>
              </div>
            )}
            <div className="space-y-2">
              <Label className="text-sm text-gray-300">Authentication (Optional)</Label>
              <Input
                placeholder="Username"
                className="cyber-input"
              />
              <Input
                type="password"
                placeholder="Password"
                className="cyber-input"
              />
            </div>
            <Button
              className="w-full text-black bg-cyber-blue hover:bg-cyber-blue/90 flex items-center gap-2"
              onClick={() => {
                if (targets[0].trim() !== "") {
                  // For now, only use the first target and no auth fields (can be extended)
                  triggerScan({ url: targets[0], scanType: scanType });
                }
              }}
              disabled={loading || targets[0].trim() === ""}
            >
              {loading ? (
                <>Running Scan...</>
              ) : (
                <>Run Scan</>
              )}
            </Button>
          </CardContent>
        </Card>
        <Card className="cyber-card lg:col-span-2">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-mono text-gray-300">Scan Results</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            {/* Progress indicator */}
            {loading && (
              <div className="space-y-4">
                <div className="flex justify-between mb-1 text-sm">
                  <span className="text-gray-300">Scanning targets...</span>
                  <span className="font-mono text-cyber-blue">50%</span>
                </div>
                <div className="h-2 bg-cyber-darker rounded-full overflow-hidden">
                  <div
                    className="h-full bg-cyber-blue rounded-full transition-all duration-300"
                    style={{ width: '50%' }}
                  />
                </div>
              </div>
            )}
            {/* Vulnerabilities summary and results */}
            <div>
              <div className="flex gap-4 mb-4">
                <div className="flex flex-col items-center justify-center p-4 bg-cyber-darker rounded-lg border border-cyber-blue/30">
                  <span className="text-cyber-blue text-2xl font-bold">{vulnerabilities.length}</span>
                  <span className="text-xs text-gray-400 mt-1">Total</span>
                </div>
                <div className="flex flex-col items-center justify-center p-4 bg-cyber-darker rounded-lg border border-cyber-blue/30">
                  <span className="text-red-400 text-2xl font-bold">{vulnerabilities.filter(v => v.severity === 'critical').length}</span>
                  <span className="text-xs text-gray-400 mt-1">Critical</span>
                </div>
                <div className="flex flex-col items-center justify-center p-4 bg-cyber-darker rounded-lg border border-cyber-blue/30">
                  <span className="text-orange-400 text-2xl font-bold">{vulnerabilities.filter(v => v.severity === 'high').length}</span>
                  <span className="text-xs text-gray-400 mt-1">High</span>
                </div>
                <div className="flex flex-col items-center justify-center p-4 bg-cyber-darker rounded-lg border border-cyber-blue/30">
                  <span className="text-yellow-400 text-2xl font-bold">{vulnerabilities.filter(v => v.severity === 'medium').length}</span>
                  <span className="text-xs text-gray-400 mt-1">Medium</span>
                </div>
                <div className="flex flex-col items-center justify-center p-4 bg-cyber-darker rounded-lg border border-cyber-blue/30">
                  <span className="text-blue-400 text-2xl font-bold">{vulnerabilities.filter(v => v.severity === 'low').length}</span>
                  <span className="text-xs text-gray-400 mt-1">Low</span>
                </div>
              </div>
              {/* Export & Auto-fix Buttons */}
              <div className="flex gap-2 mb-2">
                <ExportPDFButton
                  vulnerabilities={vulnerabilities}
                  summary={{
                    total: vulnerabilities.length,
                    critical: vulnerabilities.filter(v => v.severity === 'critical').length,
                    high: vulnerabilities.filter(v => v.severity === 'high').length,
                    medium: vulnerabilities.filter(v => v.severity === 'medium').length,
                    low: vulnerabilities.filter(v => v.severity === 'low').length,
                  }}
                />
                {/* Optionally add Auto-Fix here if implemented */}
              </div>
              {/* Results list */}
              <div className="rounded-md overflow-hidden border border-cyber-blue/20">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-cyber-darker">
                      <th className="px-4 py-2 text-left text-xs uppercase text-gray-400">Severity</th>
                      <th className="px-4 py-2 text-left text-xs uppercase text-gray-400">Vulnerability</th>
                      <th className="px-4 py-2 text-left text-xs uppercase text-gray-400">Endpoint</th>
                      <th className="px-4 py-2 text-right text-xs uppercase text-gray-400">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-cyber-blue/20">
                    {vulnerabilities.map(vuln => (
                      <tr key={vuln.id} className="hover:bg-cyber-blue/5 transition-colors">
                        <td className="px-4 py-3">
                          <Badge className={getSeverityColor(vuln.severity)}>
                            {vuln.severity}
                          </Badge>
                        </td>
                        <td className="px-4 py-3">
                          <div className="font-medium text-gray-200">{vuln.name}</div>
                          <div className="text-xs text-gray-500 mt-1">{vuln.cve || "No CVE assigned"}</div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="text-gray-300 font-mono">{vuln.affectedEndpoint}</div>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <Button size="sm" variant="ghost" className="text-xs text-cyber-blue">
                            Details <ArrowRight size={12} className="ml-1" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ScannerPage;
