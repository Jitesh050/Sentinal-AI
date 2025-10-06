
import { useState, useEffect } from 'react';
import { Shield, BarChart, AlertCircle, AlertTriangle, Terminal, Webhook, CircleX } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Threat {
  id: string;
  timestamp: Date;
  type: 'injection' | 'dos' | 'malware' | 'credentials' | 'xss' | 'access';
  source: string;
  target: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  message: string;
}

const threatTypes = {
  injection: { icon: Terminal, label: 'SQL Injection' },
  dos: { icon: BarChart, label: 'DoS Attack' },
  malware: { icon: AlertCircle, label: 'Malware' },
  credentials: { icon: Shield, label: 'Brute Force' },
  xss: { icon: Webhook, label: 'XSS Attack' },
  access: { icon: CircleX, label: 'Access Violation' }
};

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case 'critical': return 'bg-red-500/20 text-red-400 border-red-500/40';
    case 'high': return 'bg-orange-500/20 text-orange-400 border-orange-500/40';
    case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40';
    case 'low': return 'bg-blue-500/20 text-blue-400 border-blue-500/40';
    default: return 'bg-gray-500/20 text-gray-400 border-gray-500/40';
  }
};

const getSeverityIcon = (severity: string) => {
  switch (severity) {
    case 'critical':
    case 'high':
      return <AlertCircle className="h-4 w-4 text-red-400" />;
    case 'medium':
      return <AlertTriangle className="h-4 w-4 text-yellow-400" />;
    case 'low':
      return <Shield className="h-4 w-4 text-blue-400" />;
    default:
      return null;
  }
};

// Initial mock threats
const initialThreats: Threat[] = [
  {
    id: 't1',
    timestamp: new Date(Date.now() - 1000 * 60),
    type: 'injection',
    source: '203.45.78.32',
    target: '/api/users',
    severity: 'critical',
    message: 'SQL Injection attempt detected on login endpoint'
  },
  {
    id: 't2',
    timestamp: new Date(Date.now() - 1000 * 60 * 5),
    type: 'credentials',
    source: '45.124.36.92',
    target: '/auth',
    severity: 'high',
    message: 'Brute force attack detected - 50+ failed login attempts'
  },
  {
    id: 't3',
    timestamp: new Date(Date.now() - 1000 * 60 * 15),
    type: 'xss',
    source: '122.89.46.73',
    target: '/comments',
    severity: 'medium',
    message: 'Possible XSS attack detected in input form'
  },
  {
    id: 't4',
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    type: 'access',
    source: '89.234.51.7',
    target: '/admin',
    severity: 'low',
    message: 'Unauthorized access attempt to admin portal'
  },
];

interface ThreatFeedProps {
  isPaused: boolean;
  filter: 'all' | 'high' | 'medium' | 'low';
}

export const ThreatFeed = ({ isPaused, filter }: ThreatFeedProps) => {
  const [threats, setThreats] = useState<Threat[]>(initialThreats);
  
  // Generate new threats
  useEffect(() => {
    if (isPaused) return;
    
    const threatTypes = ['injection', 'dos', 'malware', 'credentials', 'xss', 'access'] as const;
    const severities = ['critical', 'high', 'medium', 'low'] as const;
    const targets = ['/api/users', '/auth', '/admin', '/dashboard', '/api/products', '/checkout'];
    
    const interval = setInterval(() => {
      const newThreat: Threat = {
        id: `t${Date.now()}`,
        timestamp: new Date(),
        type: threatTypes[Math.floor(Math.random() * threatTypes.length)],
        source: `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
        target: targets[Math.floor(Math.random() * targets.length)],
        severity: severities[Math.floor(Math.random() * severities.length)],
        message: `New ${severities[Math.floor(Math.random() * severities.length)]} threat detected`
      };
      
      setThreats(prev => [newThreat, ...prev.slice(0, 49)]); // Keep only 50 most recent threats
    }, 10000);
    
    return () => clearInterval(interval);
  }, [isPaused]);
  
  // Filter threats based on user selection
  const filteredThreats = threats.filter(threat => {
    if (filter === 'all') return true;
    return threat.severity === filter;
  });
  
  return (
    <ScrollArea className="h-[500px] p-4">
      {filteredThreats.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full text-gray-500">
          <Shield size={36} className="mb-2 opacity-50" />
          <p>No threats detected in this category</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredThreats.map(threat => {
            const ThreatIcon = threatTypes[threat.type].icon;
            return (
              <div 
                key={threat.id} 
                className="p-3 bg-cyber-darker border border-cyber-blue/20 rounded-md"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-md bg-cyber-blue/10">
                      <ThreatIcon size={16} className="text-cyber-blue" />
                    </div>
                    <span className="font-medium text-sm text-gray-200">
                      {threatTypes[threat.type].label}
                    </span>
                  </div>
                  <Badge className={getSeverityColor(threat.severity)}>
                    {getSeverityIcon(threat.severity)} {threat.severity}
                  </Badge>
                </div>
                
                <p className="text-sm text-gray-300 mb-2">{threat.message}</p>
                
                <div className="flex justify-between text-xs text-gray-500">
                  <span className="font-mono">IP: {threat.source}</span>
                  <span className="font-mono">
                    {threat.timestamp.toLocaleTimeString()}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </ScrollArea>
  );
};
