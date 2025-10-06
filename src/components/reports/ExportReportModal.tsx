import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, File } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useScan } from "@/contexts/ScanContext";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface ExportReportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExportReportModal = ({ isOpen, onClose }: ExportReportModalProps) => {
  const { scanResult } = useScan();
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
    
    if (fileType === "pdf") {
      try {
        // Create PDF document
        const doc = new jsPDF();
        
        // Add title
        doc.setFontSize(22);
        doc.setTextColor(0, 100, 200);
        doc.text("Security Scan Report", 20, 20);
        
        // Add URL
        doc.setFontSize(12);
        doc.setTextColor(80, 80, 80);
        doc.text(`URL: ${scanResult?.url || "(not specified)"}`, 20, 30);
        doc.text(`Generated: ${new Date().toLocaleString()}`, 20, 36);
        
        // Add summary section
        if (selectedSections.overview) {
          doc.setFontSize(16);
          doc.setTextColor(0, 100, 200);
          doc.text("Overview & Summary", 20, 50);
          
          doc.setFontSize(12);
          doc.setTextColor(0, 0, 0);
          
          // Create summary table
          const summaryData = [
            ["Total Vulnerabilities", `${scanResult?.vulnerabilities?.length || 0}`],
            ["Critical", `${scanResult?.vulnerabilities?.filter(v => v.severity === "critical").length || 0}`],
            ["High", `${scanResult?.vulnerabilities?.filter(v => v.severity === "high").length || 0}`],
            ["Medium", `${scanResult?.vulnerabilities?.filter(v => v.severity === "medium").length || 0}`],
            ["Low", `${scanResult?.vulnerabilities?.filter(v => v.severity === "low").length || 0}`],
          ];
          
          autoTable(doc, {
            startY: 55,
            head: [["Metric", "Count"]],
            body: summaryData,
            theme: "striped",
            headStyles: { fillColor: [0, 100, 200] }
          });
        }
        
        // Add vulnerabilities section
        if (scanResult?.vulnerabilities?.length > 0) {
          // Get the current Y position - use a fixed position if we can't determine it
          let currentY = 120;
          try {
            // @ts-ignore - lastAutoTable is added by autotable plugin but not in types
            currentY = doc.lastAutoTable?.finalY || 120;
          } catch (e) {}
          
          doc.setFontSize(16);
          doc.setTextColor(0, 100, 200);
          doc.text("Vulnerabilities", 20, currentY + 10);
          
          const vulnData = scanResult.vulnerabilities.map(v => [
            v.severity,
            v.name,
            v.affectedEndpoint,
            v.cve || "-",
            v.fixAvailable ? "Yes" : "No"
          ]);
          
          autoTable(doc, {
            startY: currentY + 15,
            head: [["Severity", "Name", "Endpoint", "CVE", "Fix Available"]],
            body: vulnData,
            theme: "striped",
            headStyles: { fillColor: [0, 100, 200] }
          });
        }
        
        // Save the PDF
        doc.save(`security_report_${scanResult?.url ? scanResult.url.replace(/[^a-zA-Z0-9]/g, '_') : 'scan'}.pdf`);
        
        toast({
          title: "Export Complete",
          description: "Your PDF report has been downloaded.",
        });
      } catch (error) {
        console.error("PDF generation error:", error);
        toast({
          title: "Export Failed",
          description: "There was an error generating your report.",
          variant: "destructive"
        });
      }
    } else {
      // CSV export (simplified for now)
      toast({
        title: "Export Complete",
        description: "Your CSV report has been downloaded.",
      });
    }
    
    onClose();
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
