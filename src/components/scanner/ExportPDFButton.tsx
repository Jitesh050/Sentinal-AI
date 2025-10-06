import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

interface Vulnerability {
  id: string;
  name: string;
  severity: "critical" | "high" | "medium" | "low";
  description: string;
  affectedEndpoint: string;
  cve?: string;
  fixAvailable: boolean;
}

interface ExportPDFButtonProps {
  vulnerabilities: Vulnerability[];
  summary: {
    total: number;
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
}

export default function ExportPDFButton({ vulnerabilities, summary }: ExportPDFButtonProps) {
  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Scan Results Summary", 14, 18);
    doc.setFontSize(12);
    doc.text(`Total: ${summary.total}  Critical: ${summary.critical}  High: ${summary.high}  Medium: ${summary.medium}  Low: ${summary.low}`, 14, 28);
    autoTable(doc, {
      startY: 36,
      head: [["Severity", "Vulnerability", "Endpoint", "CVE", "Fix Available"]],
      body: vulnerabilities.map(v => [
        v.severity,
        v.name,
        v.affectedEndpoint,
        v.cve || "-",
        v.fixAvailable ? "Yes" : "No"
      ]),
    });
    doc.save("scan_results.pdf");
  };

  return (
    <Button onClick={handleExportPDF} className="mr-2 bg-cyber-blue hover:bg-cyber-blue/90 text-black" variant="outline">
      <Download size={16} className="mr-2" />
      Export PDF
    </Button>
  );
}
