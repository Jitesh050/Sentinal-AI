
import { useState, useEffect, useRef } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface LogEntry {
  id: string;
  timestamp: Date;
  level: 'INFO' | 'WARN' | 'ERROR' | 'DEBUG';
  system: 'API' | 'DB' | 'AUTH' | 'SCAN' | 'FIREWALL';
  message: string;
}

// Get color for log level
const getLevelColor = (level: string) => {
  switch (level) {
    case 'ERROR': return 'text-red-400';
    case 'WARN': return 'text-orange-400';
    case 'INFO': return 'text-cyber-blue';
    case 'DEBUG': return 'text-gray-400';
    default: return 'text-gray-300';
  }
};

// Initial mock logs
const initialLogs: LogEntry[] = [
  {
    id: 'l1',
    timestamp: new Date(Date.now() - 1000 * 60),
    level: 'INFO',
    system: 'API',
    message: 'Request processed for endpoint /api/scan/status'
  },
  {
    id: 'l2',
    timestamp: new Date(Date.now() - 1000 * 60 * 2),
    level: 'WARN',
    system: 'FIREWALL',
    message: 'Rate limit exceeded from IP 45.124.36.92 (10 req/s)'
  },
  {
    id: 'l3',
    timestamp: new Date(Date.now() - 1000 * 60 * 3),
    level: 'ERROR',
    system: 'DB',
    message: 'Connection timeout after 5000ms'
  },
  {
    id: 'l4',
    timestamp: new Date(Date.now() - 1000 * 60 * 4),
    level: 'INFO',
    system: 'AUTH',
    message: 'User johndoe logged in successfully'
  },
  {
    id: 'l5',
    timestamp: new Date(Date.now() - 1000 * 60 * 5),
    level: 'DEBUG',
    system: 'SCAN',
    message: 'Port scan initiated for target 192.168.1.105'
  },
];

interface LogViewerProps {
  isPaused: boolean;
}

export const LogViewer = ({ isPaused }: LogViewerProps) => {
  const [logs, setLogs] = useState<LogEntry[]>(initialLogs);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  // Auto-scroll to bottom when new logs arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);
  
  // Generate new logs
  useEffect(() => {
    if (isPaused) return;
    
    const systems = ['API', 'DB', 'AUTH', 'SCAN', 'FIREWALL'] as const;
    const levels = ['INFO', 'WARN', 'ERROR', 'DEBUG'] as const;
    const apis = ['/api/scan/status', '/api/threats', '/api/reports', '/api/auth'];
    const ips = ['45.124.36.92', '203.45.78.32', '122.89.46.73', '89.234.51.7'];
    const users = ['johndoe', 'admin', 'securityanalyst', 'devops'];
    const ports = ['80', '443', '22', '3306', '5432'];
    
    const messages = {
      API: () => `Request processed for endpoint ${apis[Math.floor(Math.random() * apis.length)]}`,
      DB: () => `Query executed in ${Math.floor(Math.random() * 500)}ms`,
      AUTH: () => `User ${users[Math.floor(Math.random() * users.length)]} authentication attempt`,
      SCAN: () => `Port ${ports[Math.floor(Math.random() * ports.length)]} scan on target ${ips[Math.floor(Math.random() * ips.length)]}`,
      FIREWALL: () => `Blocked connection from IP ${ips[Math.floor(Math.random() * ips.length)]}`
    };
    
    const interval = setInterval(() => {
      const system = systems[Math.floor(Math.random() * systems.length)];
      const level = levels[Math.floor(Math.random() * levels.length)];
      
      const newLog: LogEntry = {
        id: `l${Date.now()}`,
        timestamp: new Date(),
        level,
        system,
        message: messages[system]()
      };
      
      setLogs(prev => [...prev, newLog].slice(-100)); // Keep only the 100 most recent logs
    }, 2000);
    
    return () => clearInterval(interval);
  }, [isPaused]);
  
  return (
    <div className="bg-black/30 border border-gray-700 rounded-md h-80">
      <ScrollArea className="h-full px-4 py-2 font-mono text-sm" ref={scrollRef}>
        {logs.map(log => (
          <div key={log.id} className="py-0.5 border-b border-gray-800/50 last:border-0">
            <div className="flex items-center gap-2">
              <span className="text-gray-500 text-xs">
                {log.timestamp.toLocaleTimeString()}
              </span>
              <span className={`font-bold ${getLevelColor(log.level)}`}>
                [{log.level}]
              </span>
              <span className="text-cyber-blue">
                {log.system}:
              </span>
              <span className="text-gray-300">
                {log.message}
              </span>
            </div>
          </div>
        ))}
      </ScrollArea>
    </div>
  );
};
