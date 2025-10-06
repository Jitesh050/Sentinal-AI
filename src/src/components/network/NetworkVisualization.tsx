
import { useEffect, useRef } from "react";
import { toast } from "@/hooks/use-toast";

interface NetworkVisualizationProps {
  nodeTypeFilters: {
    web: boolean;
    db: boolean;
    external: boolean;
    iot: boolean;
  };
  severityFilters: {
    critical: boolean;
    high: boolean;
    medium: boolean;
    low: boolean;
  };
  attackTypeFilters: {
    dos: boolean;
    injection: boolean;
    xss: boolean;
    bruteforce: boolean;
    malware: boolean;
  };
  timeFilter: "hour" | "day" | "week";
}

export const NetworkVisualization = ({
  nodeTypeFilters,
  severityFilters,
  attackTypeFilters,
  timeFilter
}: NetworkVisualizationProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // In a real app, this would be using D3.js for the actual network graph
  // For now, we'll create a placeholder visualization
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    // Set canvas dimensions
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    
    // Background
    ctx.fillStyle = "rgba(26, 31, 44, 0.5)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Center point
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    
    // Draw grid lines
    ctx.strokeStyle = "rgba(15, 160, 206, 0.1)";
    ctx.lineWidth = 1;
    
    // Horizontal grid lines
    for (let y = 0; y < canvas.height; y += 40) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }
    
    // Vertical grid lines
    for (let x = 0; x < canvas.width; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    
    // Node connection network (simplified placeholder)
    const mainNodes = [
      { x: centerX, y: centerY - 100, radius: 15, color: "#10B981", type: "web", severity: "low" },
      { x: centerX - 120, y: centerY - 50, radius: 12, color: "#F97316", type: "db", severity: "high" },
      { x: centerX + 120, y: centerY - 50, radius: 12, color: "#10B981", type: "web", severity: "low" },
      { x: centerX - 180, y: centerY + 70, radius: 10, color: "#EA384C", type: "external", severity: "critical" },
      { x: centerX - 60, y: centerY + 100, radius: 8, color: "#F97316", type: "iot", severity: "high" },
      { x: centerX + 60, y: centerY + 100, radius: 8, color: "#F59E0B", type: "web", severity: "medium" },
      { x: centerX + 180, y: centerY + 70, radius: 10, color: "#10B981", type: "db", severity: "low" },
    ];
    
    // Draw connections first (so they appear behind nodes)
    ctx.strokeStyle = "rgba(15, 160, 206, 0.4)";
    ctx.lineWidth = 1;
    
    // Regular connections
    ctx.beginPath();
    ctx.moveTo(mainNodes[0].x, mainNodes[0].y);
    ctx.lineTo(mainNodes[1].x, mainNodes[1].y);
    ctx.lineTo(mainNodes[4].x, mainNodes[4].y);
    ctx.lineTo(mainNodes[5].x, mainNodes[5].y);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(mainNodes[0].x, mainNodes[0].y);
    ctx.lineTo(mainNodes[2].x, mainNodes[2].y);
    ctx.lineTo(mainNodes[6].x, mainNodes[6].y);
    ctx.lineTo(mainNodes[5].x, mainNodes[5].y);
    ctx.stroke();
    
    // Attack path (dashed red line)
    ctx.strokeStyle = "rgba(234, 56, 76, 0.8)";
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 3]);
    ctx.beginPath();
    ctx.moveTo(mainNodes[3].x, mainNodes[3].y);
    ctx.lineTo(mainNodes[1].x, mainNodes[1].y);
    ctx.lineTo(mainNodes[0].x, mainNodes[0].y);
    ctx.stroke();
    
    // Reset line dash
    ctx.setLineDash([]);
    
    // Draw nodes
    mainNodes.forEach(node => {
      // Skip nodes that are filtered out
      if (
        (node.type === "web" && !nodeTypeFilters.web) ||
        (node.type === "db" && !nodeTypeFilters.db) ||
        (node.type === "external" && !nodeTypeFilters.external) ||
        (node.type === "iot" && !nodeTypeFilters.iot) ||
        (node.severity === "critical" && !severityFilters.critical) ||
        (node.severity === "high" && !severityFilters.high) ||
        (node.severity === "medium" && !severityFilters.medium) ||
        (node.severity === "low" && !severityFilters.low)
      ) {
        return;
      }
      
      // Glow effect for nodes
      const gradient = ctx.createRadialGradient(
        node.x, node.y, node.radius * 0.5,
        node.x, node.y, node.radius * 2
      );
      gradient.addColorStop(0, `${node.color}80`);
      gradient.addColorStop(1, `${node.color}00`);
      
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(node.x, node.y, node.radius * 2, 0, 2 * Math.PI);
      ctx.fill();
      
      // Draw node
      ctx.fillStyle = node.color;
      
      // Different shapes based on type
      if (node.type === "web") {
        // Circle for web servers
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, 2 * Math.PI);
        ctx.fill();
      } else if (node.type === "db") {
        // Square for databases
        ctx.fillRect(
          node.x - node.radius,
          node.y - node.radius,
          node.radius * 2,
          node.radius * 2
        );
      } else if (node.type === "external") {
        // Triangle for external
        ctx.beginPath();
        ctx.moveTo(node.x, node.y - node.radius);
        ctx.lineTo(node.x + node.radius, node.y + node.radius);
        ctx.lineTo(node.x - node.radius, node.y + node.radius);
        ctx.closePath();
        ctx.fill();
      } else if (node.type === "iot") {
        // Diamond for IoT
        ctx.beginPath();
        ctx.moveTo(node.x, node.y - node.radius);
        ctx.lineTo(node.x + node.radius, node.y);
        ctx.lineTo(node.x, node.y + node.radius);
        ctx.lineTo(node.x - node.radius, node.y);
        ctx.closePath();
        ctx.fill();
      }
      
      // Node border
      ctx.strokeStyle = "rgba(255, 255, 255, 0.3)";
      ctx.lineWidth = 1;
      
      if (node.type === "web") {
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, 2 * Math.PI);
        ctx.stroke();
      } else if (node.type === "db") {
        ctx.strokeRect(
          node.x - node.radius,
          node.y - node.radius,
          node.radius * 2,
          node.radius * 2
        );
      } else if (node.type === "external") {
        ctx.beginPath();
        ctx.moveTo(node.x, node.y - node.radius);
        ctx.lineTo(node.x + node.radius, node.y + node.radius);
        ctx.lineTo(node.x - node.radius, node.y + node.radius);
        ctx.closePath();
        ctx.stroke();
      } else if (node.type === "iot") {
        ctx.beginPath();
        ctx.moveTo(node.x, node.y - node.radius);
        ctx.lineTo(node.x + node.radius, node.y);
        ctx.lineTo(node.x, node.y + node.radius);
        ctx.lineTo(node.x - node.radius, node.y);
        ctx.closePath();
        ctx.stroke();
      }
    });
    
    // Add event listener for node click (simplified for placeholder)
    canvas.addEventListener("click", (event) => {
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      
      // Check if any node was clicked
      mainNodes.forEach(node => {
        const distance = Math.sqrt((node.x - x) ** 2 + (node.y - y) ** 2);
        if (distance <= node.radius * 1.5) {
          toast({
            title: `${node.type.charAt(0).toUpperCase() + node.type.slice(1)} Node Selected`,
            description: `${node.severity.charAt(0).toUpperCase() + node.severity.slice(1)} risk level detected`
          });
        }
      });
    });
    
    // Placeholder animation for attack path
    const animate = () => {
      // This would be a more sophisticated animation in a real implementation
      // Here we're just adding a comment for the placeholder
    };
    
    animate();
    
  }, [nodeTypeFilters, severityFilters, attackTypeFilters, timeFilter]);
  
  return (
    <div className="w-full h-[600px] border border-cyber-blue/20 rounded-md overflow-hidden">
      <canvas 
        ref={canvasRef} 
        className="w-full h-full"
        style={{ cursor: 'pointer' }}
      />
    </div>
  );
};
