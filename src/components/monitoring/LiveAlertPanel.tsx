
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRight, AlertCircle, ShieldAlert, Timer } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface Alert {
  id: string;
  title: string;
  description: string;
  timestamp: Date;
  severity: 'critical' | 'high' | 'medium' | 'low';
  isNew?: boolean;
}

interface LiveAlertPanelProps {
  isPaused: boolean;
}

export const LiveAlertPanel = ({ isPaused }: LiveAlertPanelProps) => {
  const [activeAlert, setActiveAlert] = useState<Alert | null>({
    id: 'a1',
    title: 'SQL Injection Attempt',
    description: 'Multiple SQL injection attempts detected from IP 203.45.78.32 targeting the login API endpoint. Payload contains malicious SQL code attempting to bypass authentication.',
    timestamp: new Date(),
    severity: 'critical'
  });
  
  // Time remaining for current alert
  const [timeRemaining, setTimeRemaining] = useState(60);
  
  // Alerts queue
  const [alertsQueue, setAlertsQueue] = useState<Alert[]>([
    {
      id: 'a2',
      title: 'Brute Force Attack',
      description: '50+ failed login attempts for user "admin" from IP 45.124.36.92 within 60 seconds. Possible credential stuffing attack detected.',
      timestamp: new Date(Date.now() - 1000 * 60),
      severity: 'high'
    }
  ]);
  
  // Generate new alerts
  useEffect(() => {
    if (isPaused) return;
    
    const alertTemplates = [
      {
        title: 'Unusual File Access',
        description: 'User "system" accessing sensitive configuration files outside normal patterns. Multiple file operations on /etc/passwd and /etc/shadow detected.',
        severity: 'medium'
      },
      {
        title: 'DoS Attack Detected',
        description: 'Abnormally high traffic volume detected from subnet 45.67.x.x. Traffic analysis indicates possible SYN flood attack targeting web server.',
        severity: 'high'
      },
      {
        title: 'Malware Communication',
        description: 'Internal host 192.168.1.45 attempting connection to known command & control server. Multiple DNS requests to suspicious domains.',
        severity: 'critical'
      },
      {
        title: 'XSS Attack Detected',
        description: 'Cross-site scripting payload detected in form submission. Input contains malicious JavaScript code that could execute in users\' browsers.',
        severity: 'medium'
      },
      {
        title: 'Unauthorized API Access',
        description: 'User with limited permissions attempting to access administrative API endpoints. Multiple access denied errors recorded.',
        severity: 'low'
      }
    ];
    
    const interval = setInterval(() => {
      const template = alertTemplates[Math.floor(Math.random() * alertTemplates.length)];
      const severities = ['critical', 'high', 'medium', 'low'] as const;
      
      const newAlert: Alert = {
        id: `a${Date.now()}`,
        title: template.title,
        description: template.description,
        timestamp: new Date(),
        severity: template.severity as any,
        isNew: true
      };
      
      setAlertsQueue(prev => [newAlert, ...prev].slice(0, 5));
      
      // Show toast notification for critical alerts
      if (newAlert.severity === 'critical') {
        toast({
          title: 'Critical Alert',
          description: newAlert.title,
          variant: 'destructive'
        });
      }
    }, 25000);
    
    return () => clearInterval(interval);
  }, [isPaused]);
  
  // Update active alert
  useEffect(() => {
    if (isPaused || alertsQueue.length === 0) return;
    
    const interval = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          // Rotate to next alert
          const nextAlert = alertsQueue[0];
          const newQueue = alertsQueue.slice(1);
          
          if (nextAlert) {
            setActiveAlert({...nextAlert, isNew: false});
            setAlertsQueue(newQueue);
            return 60; // Reset timer
          }
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(interval);
  }, [isPaused, alertsQueue]);
  
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500/20 text-red-400 border-red-500/40';
      case 'high': return 'bg-orange-500/20 text-orange-400 border-orange-500/40';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40';
      case 'low': return 'bg-blue-500/20 text-blue-400 border-blue-500/40';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/40';
    }
  };
  
  if (!activeAlert) return null;
  
  return (
    <Card className={`cyber-card overflow-hidden transition-all duration-300 ${
      activeAlert.isNew ? 'border-red-500/50 shadow-[0_0_15px_rgba(234,56,76,0.3)]' : ''
    }`}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-mono text-gray-300 flex items-center gap-2">
            <ShieldAlert size={18} className="text-cyber-blue" />
            Live Alert
          </CardTitle>
          
          <div className="flex items-center gap-2">
            <Badge className={getSeverityColor(activeAlert.severity)}>
              {activeAlert.severity}
            </Badge>
            
            <div className="flex items-center gap-1 text-xs text-gray-400">
              <Timer size={12} />
              <span>{timeRemaining}s</span>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4 p-4">
        <div className="space-y-2">
          <h3 className="text-lg font-medium text-white">{activeAlert.title}</h3>
          <p className="text-sm text-gray-300">{activeAlert.description}</p>
          
          <div className="text-xs text-gray-400">
            Detected at {activeAlert.timestamp.toLocaleTimeString()}
          </div>
        </div>
        
        <div className="flex justify-between items-center border-t border-gray-800 pt-4">
          <div className="flex items-center gap-2 text-sm text-gray-300">
            <AlertCircle size={16} className="text-cyber-orange" />
            <span>Next alert: {alertsQueue.length > 0 ? alertsQueue[0].title : 'None pending'}</span>
          </div>
          
          <Button size="sm" className="cyber-button">
            Investigate <ArrowRight size={14} className="ml-1" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
