import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, File } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface ExportReportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExportReportModal = ({ isOpen, onClose }: ExportReportModalProps) => {
  const [fileType, setFileType] = useState<"pdf" | "csv">("pdf");
  const [selectedSections, setSelectedSections] = useState<{
    overview: boolean;
    attackFrequency: boolean;
    vulnerabilityTrends: boolean;
    exploitedServices: boolean;
    recommendations: boolean;
  }>({
    overview: true,
    attackFrequency: true,
    vulnerabilityTrends: true,
    exploitedServices: true,
    recommendations: true,
  });

  const handleExport = () => {
    toast({
      title: "Export Started",
      description: `Your ${fileType.toUpperCase()} report is being generated.`,
    });
    
    // Simulate export delay
    setTimeout(() => {
      toast({
        title: "Export Complete",
        description: `Your report has been exported as ${fileType.toUpperCase()}.`,
      });
      onClose();
    }, 1500);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-cyber-dark border border-cyber-blue/30 text-white sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-cyber-blue font-mono">Export Report</DialogTitle>
          <DialogDescription className="text-gray-400">
            Customize and download your security report.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>File Format</Label>
            <div className="flex space-x-4">
              <div 
                className={`flex-1 p-4 border rounded-md cursor-pointer flex flex-col items-center justify-center space-y-2 transition-colors ${
                  fileType === "pdf" 
                    ? "border-cyber-blue bg-cyber-blue/10" 
                    : "border-gray-700 bg-black/20 hover:bg-black/30"
                }`}
                onClick={() => setFileType("pdf")}
              >
                <FileText size={24} className={fileType === "pdf" ? "text-cyber-blue" : "text-gray-400"} />
                <span className={fileType === "pdf" ? "text-cyber-blue" : "text-gray-400"}>PDF</span>
              </div>
              
              <div 
                className={`flex-1 p-4 border rounded-md cursor-pointer flex flex-col items-center justify-center space-y-2 transition-colors ${
                  fileType === "csv" 
                    ? "border-cyber-blue bg-cyber-blue/10" 
                    : "border-gray-700 bg-black/20 hover:bg-black/30"
                }`}
                onClick={() => setFileType("csv")}
              >
                <File size={24} className={fileType === "csv" ? "text-cyber-blue" : "text-gray-400"} />
                <span className={fileType === "csv" ? "text-cyber-blue" : "text-gray-400"}>CSV</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Time Range</Label>
            <Select defaultValue="week">
              <SelectTrigger className="cyber-input">
                <SelectValue placeholder="Select time range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="day">Last 24 Hours</SelectItem>
                <SelectItem value="week">Last 7 Days</SelectItem>
                <SelectItem value="month">Last 30 Days</SelectItem>
                <SelectItem value="year">Last Year</SelectItem>
                <SelectItem value="custom">Custom Range</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-3">
            <Label>Sections to Include</Label>
            
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="overview" 
                  checked={selectedSections.overview}
                  onCheckedChange={(checked) => 
                    setSelectedSections({...selectedSections, overview: checked === true})
                  }
                />
                <label htmlFor="overview" className="text-sm text-gray-300 cursor-pointer">
                  Overview & Summary
                </label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="attackFrequency" 
                  checked={selectedSections.attackFrequency}
                  onCheckedChange={(checked) => 
                    setSelectedSections({...selectedSections, attackFrequency: checked === true})
                  }
                />
                <label htmlFor="attackFrequency" className="text-sm text-gray-300 cursor-pointer">
                  Attack Frequency Charts
                </label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="vulnerabilityTrends" 
                  checked={selectedSections.vulnerabilityTrends}
                  onCheckedChange={(checked) => 
                    setSelectedSections({...selectedSections, vulnerabilityTrends: checked === true})
                  }
                />
                <label htmlFor="vulnerabilityTrends" className="text-sm text-gray-300 cursor-pointer">
                  Vulnerability Trends
                </label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="exploitedServices" 
                  checked={selectedSections.exploitedServices}
                  onCheckedChange={(checked) => 
                    setSelectedSections({...selectedSections, exploitedServices: checked === true})
                  }
                />
                <label htmlFor="exploitedServices" className="text-sm text-gray-300 cursor-pointer">
                  Exploited Services Analysis
                </label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="recommendations" 
                  checked={selectedSections.recommendations}
                  onCheckedChange={(checked) => 
                    setSelectedSections({...selectedSections, recommendations: checked === true})
                  }
                />
                <label htmlFor="recommendations" className="text-sm text-gray-300 cursor-pointer">
                  Security Recommendations
                </label>
              </div>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button 
            className="bg-cyber-blue hover:bg-cyber-blue/90 text-black"
            onClick={handleExport}
          >
            Export Now
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
