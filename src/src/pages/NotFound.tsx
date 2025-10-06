
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ShieldAlert, Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-cyber-darker">
      <div className="glass-panel border border-cyber-blue/30 p-8 max-w-md w-full text-center">
        <div className="mb-6 flex justify-center">
          <div className="h-16 w-16 rounded-full bg-cyber-blue/20 flex items-center justify-center animate-pulse-glow">
            <ShieldAlert size={32} className="text-cyber-blue" />
          </div>
        </div>
        
        <h1 className="text-4xl font-bold font-mono text-cyber-blue mb-2">404</h1>
        <p className="text-xl text-gray-300 mb-6">Access Denied: Resource Not Found</p>
        
        <div className="text-sm text-gray-400 mb-6 font-mono">
          <p>Attempted path: {location.pathname}</p>
          <p className="mt-2">This incident has been logged.</p>
        </div>
        
        <Button className="cyber-button inline-flex items-center mx-auto" asChild>
          <a href="/">
            <Home size={16} className="mr-2" />
            Return to Security Dashboard
          </a>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
