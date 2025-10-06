
import { Card, CardContent } from "@/components/ui/card";
import { Circle, Square, Triangle } from "lucide-react";

export const NetworkLegend = () => {
  return (
    <Card className="cyber-card h-full">
      <CardContent className="p-4 space-y-6">
        <div>
          <h3 className="text-sm font-medium text-gray-300 mb-3">Node Colors</h3>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-red-500"></div>
              <span className="text-sm text-gray-300">Critical</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-orange-500"></div>
              <span className="text-sm text-gray-300">Warning</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-green-500"></div>
              <span className="text-sm text-gray-300">Safe</span>
            </div>
          </div>
        </div>
        
        <div>
          <h3 className="text-sm font-medium text-gray-300 mb-3">Node Types</h3>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Circle className="text-gray-300" size={16} />
              <span className="text-sm text-gray-300">Web Server</span>
            </div>
            <div className="flex items-center gap-2">
              <Square className="text-gray-300" size={16} />
              <span className="text-sm text-gray-300">Database</span>
            </div>
            <div className="flex items-center gap-2">
              <Triangle className="text-gray-300" size={16} />
              <span className="text-sm text-gray-300">External Service</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-md border border-gray-300"></div>
              <span className="text-sm text-gray-300">IoT Device</span>
            </div>
          </div>
        </div>
        
        <div>
          <h3 className="text-sm font-medium text-gray-300 mb-3">Connection Types</h3>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-12 h-0.5 bg-cyber-blue"></div>
              <span className="text-sm text-gray-300">Secure</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-12 h-0.5 bg-yellow-500"></div>
              <span className="text-sm text-gray-300">Encrypted</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-12 h-0.5 bg-red-500 border-t border-dashed"></div>
              <span className="text-sm text-gray-300">Attack Path</span>
            </div>
          </div>
        </div>
        
        <div className="pt-2">
          <h3 className="text-sm font-medium text-gray-300 mb-1">Interaction Tips</h3>
          <ul className="text-xs text-gray-400 space-y-1 list-disc pl-4">
            <li>Click a node to view details</li>
            <li>Drag to reposition the network</li>
            <li>Mousewheel to zoom in/out</li>
            <li>Right-click for context menu</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};
