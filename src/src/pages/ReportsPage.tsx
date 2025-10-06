
import { useState } from "react";
import { Calendar, Download, Filter } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AttackFrequencyChart } from "@/components/reports/AttackFrequencyChart";
import { VulnerabilityTrendsChart } from "@/components/reports/VulnerabilityTrendsChart";
import { ExploitedServicesChart } from "@/components/reports/ExploitedServicesChart";
import { ExportReportModal } from "@/components/reports/ExportReportModal";

const ReportsPage = () => {
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [dateRange, setDateRange] = useState<"day" | "week" | "month" | "year">("week");

  // Mock data for overview cards
  const summaryData = {
    totalScans: 157,
    totalVulnerabilities: 89,
    resolvedVulnerabilities: 64,
    unresolvedVulnerabilities: 25,
    attackSources: 38
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Reports & Analytics</h1>
        
        <div className="flex items-center space-x-4">
          <Button 
            className="cyber-button" 
            onClick={() => setIsExportModalOpen(true)}
          >
            <Download size={16} className="mr-2" />
            Export Report
          </Button>
        </div>
      </div>
      
      {/* Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="cyber-card">
          <CardContent className="p-4 text-center">
            <div className="text-3xl font-mono text-cyber-blue">{summaryData.totalScans}</div>
            <div className="text-xs text-gray-400 mt-1">Total Scans</div>
          </CardContent>
        </Card>
        
        <Card className="cyber-card">
          <CardContent className="p-4 text-center">
            <div className="text-3xl font-mono text-cyber-blue">{summaryData.totalVulnerabilities}</div>
            <div className="text-xs text-gray-400 mt-1">Total Vulnerabilities</div>
          </CardContent>
        </Card>
        
        <Card className="cyber-card">
          <CardContent className="p-4 text-center">
            <div className="text-3xl font-mono text-cyber-green">{summaryData.resolvedVulnerabilities}</div>
            <div className="text-xs text-gray-400 mt-1">Resolved</div>
          </CardContent>
        </Card>
        
        <Card className="cyber-card">
          <CardContent className="p-4 text-center">
            <div className="text-3xl font-mono text-cyber-orange">{summaryData.unresolvedVulnerabilities}</div>
            <div className="text-xs text-gray-400 mt-1">Unresolved</div>
          </CardContent>
        </Card>
        
        <Card className="cyber-card">
          <CardContent className="p-4 text-center">
            <div className="text-3xl font-mono text-cyber-red">{summaryData.attackSources}</div>
            <div className="text-xs text-gray-400 mt-1">Attack Sources</div>
          </CardContent>
        </Card>
      </div>
      
      {/* Filters */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-cyber-dark/50 border border-cyber-blue/20 rounded-md">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Calendar size={18} className="text-cyber-blue" />
            <span className="text-gray-300 text-sm">Time Range:</span>
          </div>
          
          <Tabs value={dateRange} onValueChange={(value) => setDateRange(value as any)}>
            <TabsList>
              <TabsTrigger value="day">Day</TabsTrigger>
              <TabsTrigger value="week">Week</TabsTrigger>
              <TabsTrigger value="month">Month</TabsTrigger>
              <TabsTrigger value="year">Year</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        <Button variant="outline" className="gap-2 text-xs">
          <Filter size={14} />
          Advanced Filters
        </Button>
      </div>
      
      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Attack Frequency Chart */}
        <Card className="cyber-card col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-mono text-gray-300">Attack Frequency</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <AttackFrequencyChart timeRange={dateRange} />
          </CardContent>
        </Card>
        
        {/* Vulnerability Trends */}
        <Card className="cyber-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-mono text-gray-300">Vulnerability Trends</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <VulnerabilityTrendsChart timeRange={dateRange} />
          </CardContent>
        </Card>
        
        {/* Exploited Services */}
        <Card className="cyber-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-mono text-gray-300">Top Exploited Services</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ExploitedServicesChart />
          </CardContent>
        </Card>
      </div>
      
      {/* Export Modal */}
      <ExportReportModal 
        isOpen={isExportModalOpen} 
        onClose={() => setIsExportModalOpen(false)} 
      />
    </div>
  );
};

export default ReportsPage;
