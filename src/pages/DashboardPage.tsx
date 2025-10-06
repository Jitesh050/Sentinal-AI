
import { ThreatMeter } from "@/components/dashboard/ThreatMeter";
import { AttackSummary } from "@/components/dashboard/AttackSummary";
import { MLPredictions } from "@/components/dashboard/MLPredictions";
import { LiveAlerts } from "@/components/dashboard/LiveAlerts";
import { WorldMap } from "@/components/dashboard/WorldMap";

const DashboardPage = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Security Dashboard</h1>
        <div className="text-sm text-gray-400">
          <span className="font-mono">Last updated: </span>
          <span className="font-mono text-cyber-blue">
            {new Date().toLocaleTimeString()}
          </span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Threat Meter */}
        <div className="h-[320px]">
          <ThreatMeter score={63} />
        </div>
        
        {/* Attack Summary */}
        <div className="h-[320px]">
          <AttackSummary />
        </div>
        
        {/* ML Predictions */}
        <div className="h-[320px]">
          <MLPredictions />
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Live Alerts */}
        <div className="h-[400px]">
          <LiveAlerts />
        </div>
        
        {/* World Map */}
        <div className="h-[400px]">
          <WorldMap />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
