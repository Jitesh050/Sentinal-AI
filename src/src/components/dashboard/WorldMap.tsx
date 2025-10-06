
import { useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface AttackSource {
  lat: number;
  lng: number;
  magnitude: number;
}

// Sample attack sources
const attackSources: AttackSource[] = [
  { lat: 40.7128, lng: -74.006, magnitude: 5 },
  { lat: 34.0522, lng: -118.2437, magnitude: 8 },
  { lat: 51.5074, lng: -0.1278, magnitude: 3 },
  { lat: 35.6762, lng: 139.6503, magnitude: 6 },
  { lat: 39.9042, lng: 116.4074, magnitude: 7 },
  { lat: -33.8688, lng: 151.2093, magnitude: 4 },
  { lat: 55.7558, lng: 37.6173, magnitude: 6 },
  { lat: 19.4326, lng: -99.1332, magnitude: 5 }
];

// Server location
const serverLocation = { lat: 37.7749, lng: -122.4194 };

export function WorldMap() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Draw the world map
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    // Set canvas dimensions
    const setCanvasDimensions = () => {
      const container = canvas.parentElement;
      if (!container) return;
      
      canvas.width = container.clientWidth;
      canvas.height = 220;
    };
    
    setCanvasDimensions();
    window.addEventListener("resize", setCanvasDimensions);
    
    // Map dimensions
    const mapWidth = canvas.width;
    const mapHeight = canvas.height;
    
    // Draw simplified world map outline
    const drawMapOutline = () => {
      ctx.strokeStyle = "#0FA0CE30";
      ctx.lineWidth = 0.5;
      
      // Draw grid lines
      ctx.beginPath();
      for (let i = 0; i <= mapWidth; i += mapWidth / 10) {
        ctx.moveTo(i, 0);
        ctx.lineTo(i, mapHeight);
      }
      for (let i = 0; i <= mapHeight; i += mapHeight / 5) {
        ctx.moveTo(0, i);
        ctx.lineTo(mapWidth, i);
      }
      ctx.stroke();
      
      // Draw continents (very simplified)
      ctx.fillStyle = "#0FA0CE15";
      
      // North America
      ctx.beginPath();
      ctx.ellipse(mapWidth * 0.2, mapHeight * 0.3, mapWidth * 0.15, mapHeight * 0.2, 0, 0, Math.PI * 2);
      ctx.fill();
      
      // South America
      ctx.beginPath();
      ctx.ellipse(mapWidth * 0.25, mapHeight * 0.6, mapWidth * 0.08, mapHeight * 0.2, 0, 0, Math.PI * 2);
      ctx.fill();
      
      // Europe + Africa
      ctx.beginPath();
      ctx.ellipse(mapWidth * 0.5, mapHeight * 0.4, mapWidth * 0.12, mapHeight * 0.3, 0, 0, Math.PI * 2);
      ctx.fill();
      
      // Asia
      ctx.beginPath();
      ctx.ellipse(mapWidth * 0.7, mapHeight * 0.35, mapWidth * 0.18, mapHeight * 0.2, 0, 0, Math.PI * 2);
      ctx.fill();
      
      // Australia
      ctx.beginPath();
      ctx.ellipse(mapWidth * 0.82, mapHeight * 0.65, mapWidth * 0.07, mapHeight * 0.1, 0, 0, Math.PI * 2);
      ctx.fill();
    };
    
    // Convert lat/lng to x/y coordinates on the map
    const latLngToPoint = (lat: number, lng: number) => {
      const x = ((lng + 180) / 360) * mapWidth;
      const y = ((90 - lat) / 180) * mapHeight;
      return { x, y };
    };
    
    // Draw server as blue dot
    const drawServer = () => {
      const { x, y } = latLngToPoint(serverLocation.lat, serverLocation.lng);
      
      // Glow effect
      const gradient = ctx.createRadialGradient(x, y, 2, x, y, 15);
      gradient.addColorStop(0, "#33C3F080");
      gradient.addColorStop(1, "#33C3F000");
      
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(x, y, 15, 0, Math.PI * 2);
      ctx.fill();
      
      // Server point
      ctx.fillStyle = "#33C3F0";
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fill();
    };
    
    // Draw attack sources as red dots
    const drawAttacks = (timestamp: number) => {
      attackSources.forEach(source => {
        const { x, y } = latLngToPoint(source.lat, source.lng);
        
        // Attack point pulse effect
        const pulseSize = 3 + Math.sin(timestamp / 500) * 1.5;
        
        // Glow effect
        const gradient = ctx.createRadialGradient(x, y, 2, x, y, 10);
        gradient.addColorStop(0, "#EA384C80");
        gradient.addColorStop(1, "#EA384C00");
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(x, y, 10, 0, Math.PI * 2);
        ctx.fill();
        
        // Attack point
        ctx.fillStyle = "#EA384C";
        ctx.beginPath();
        ctx.arc(x, y, pulseSize, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw attack line to server
        const serverPoint = latLngToPoint(serverLocation.lat, serverLocation.lng);
        
        // Calculate animation progress based on timestamp
        const progress = (timestamp / 2000) % 1;
        const startProgress = (progress + source.magnitude / 10) % 1;
        
        // Draw dashed line
        ctx.beginPath();
        ctx.setLineDash([2, 3]);
        ctx.strokeStyle = "#EA384C50";
        ctx.moveTo(x, y);
        ctx.lineTo(serverPoint.x, serverPoint.y);
        ctx.stroke();
        
        // Animated attack packet
        const packetX = x + (serverPoint.x - x) * startProgress;
        const packetY = y + (serverPoint.y - y) * startProgress;
        
        ctx.fillStyle = "#EA384C";
        ctx.beginPath();
        ctx.arc(packetX, packetY, 2, 0, Math.PI * 2);
        ctx.fill();
      });
    };
    
    // Animation loop
    let animationId: number;
    
    const animate = (timestamp: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawMapOutline();
      drawServer();
      drawAttacks(timestamp);
      
      animationId = requestAnimationFrame(animate);
    };
    
    animate(0);
    
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", setCanvasDimensions);
    };
  }, []);
  
  return (
    <Card className="cyber-card h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-mono text-gray-300">Global Attack Map</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="w-full h-[220px] relative">
          <canvas ref={canvasRef} className="w-full h-full" />
          <div className="absolute bottom-0 right-0 flex items-center gap-4 p-2 text-xs">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-cyber-blue"></div>
              <span className="text-gray-400">Server</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-cyber-red"></div>
              <span className="text-gray-400">Attacks</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
