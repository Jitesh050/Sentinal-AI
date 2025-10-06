import { useState, useEffect } from 'react';
import { Info, MessageSquare, MessageSquareWarning } from 'lucide-react';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

// Message packet component for visualization
const MessagePacket = ({ color, position, reversed = false, altered = false }: 
  { color: string, position: number, reversed?: boolean, altered?: boolean }) => {
  
  return (
    <div 
      className={`absolute top-1/2 ${reversed ? 'right-1/2' : 'left-1/2'} transform -translate-y-1/2 flex items-center`}
      style={{
        [reversed ? 'marginRight' : 'marginLeft']: `${position * 20}px`,
        transition: 'all 300ms ease-in-out',
        opacity: position > 5 ? 0 : 1
      }}
    >
      <div className={`w-8 h-5 rounded-md ${altered ? 'bg-cyber-red' : `bg-${color}`} flex items-center justify-center`}>
        <div className="text-xs text-white font-bold">{altered ? '!' : 'A'}</div>
      </div>
      
      {/* Flow direction arrow */}
      <div className={`w-8 h-0.5 bg-${color} ${reversed ? 'order-first' : 'order-last'}`}></div>
    </div>
  );
};

const MitmAttack = () => {
  const [messagePositions, setMessagePositions] = useState([0, 0, 0]);
  const [messageAlteredPositions, setMessageAlteredPositions] = useState([0, 0, 0]);

  // Animate the message packets
  useEffect(() => {
    const interval = setInterval(() => {
      // Original message from computer 1 to attacker
      setMessagePositions(prev => {
        const newPositions = [...prev];
        newPositions[0] = (newPositions[0] + 0.5) % 10;
        return newPositions;
      });
      
      // Altered message from attacker to computer 2
      setMessageAlteredPositions(prev => {
        const newPositions = [...prev];
        if (messagePositions[0] > 2.5) {
          newPositions[0] = (newPositions[0] + 0.5) % 10;
        }
        return newPositions;
      });
      
      // Response from computer 2 to attacker
      setMessagePositions(prev => {
        const newPositions = [...prev];
        if (messageAlteredPositions[0] > 4) {
          newPositions[1] = (newPositions[1] + 0.5) % 10;
        }
        return newPositions;
      });
      
      // Altered response from attacker to computer 1
      setMessageAlteredPositions(prev => {
        const newPositions = [...prev];
        if (messagePositions[1] > 2.5) {
          newPositions[1] = (newPositions[1] + 0.5) % 10;
        }
        return newPositions;
      });
      
    }, 200);
    
    return () => clearInterval(interval);
  }, [messagePositions]);

  return (
    <div className="relative w-full h-full bg-gradient-to-b from-cyber-dark to-black">
      {/* Grid lines for cyber effect */}
      <div className="absolute inset-0 opacity-20" 
           style={{
             backgroundImage: 'linear-gradient(to right, #0EA5E9 1px, transparent 1px), linear-gradient(to bottom, #0EA5E9 1px, transparent 1px)',
             backgroundSize: '40px 40px'
           }}>
      </div>
      
      {/* Computer 1 */}
      <div className="absolute left-1/5 top-1/2 transform -translate-y-1/2">
        <div className="cyber-card w-24 h-24 flex items-center justify-center">
          <div className="relative z-10">
            <MessageSquare className="w-14 h-14 text-cyber-blue" />
            <div className="text-xs mt-2 text-center">Client A</div>
          </div>
        </div>
      </div>
      
      {/* Computer 2 */}
      <div className="absolute right-1/5 top-1/2 transform -translate-y-1/2">
        <div className="cyber-card w-24 h-24 flex items-center justify-center">
          <div className="relative z-10">
            <MessageSquare className="w-14 h-14 text-cyber-blue" />
            <div className="text-xs mt-2 text-center">Client B</div>
          </div>
        </div>
      </div>
      
      {/* Attacker in the middle */}
      <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className="cyber-card w-28 h-28 border-cyber-red/50 cyber-warning animate-pulse-glow flex items-center justify-center">
          <div className="relative z-10">
            <MessageSquareWarning className="w-16 h-16 text-cyber-red" />
            <div className="text-xs mt-2 text-center text-cyber-red font-semibold">ATTACKER</div>
          </div>
        </div>
        
        {/* Info tooltip */}
        <div className="absolute -top-4 -right-4">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="bg-cyber-blue rounded-full p-1 animate-pulse-glow">
                  <Info className="w-4 h-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="top" className="bg-black border-cyber-blue text-white max-w-xs">
                <p>MITM Attack: Intercepting and modifying communication between two parties</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
      
      {/* Message packets */}
      {/* Computer 1 to Attacker */}
      <MessagePacket color="cyber-blue" position={messagePositions[0]} />
      
      {/* Attacker to Computer 2 (altered) */}
      <MessagePacket color="cyber-blue" position={messageAlteredPositions[0]} altered />
      
      {/* Computer 2 to Attacker */}
      <MessagePacket color="cyber-green" position={messagePositions[1]} reversed />
      
      {/* Attacker to Computer 1 (altered) */}
      <MessagePacket color="cyber-green" position={messageAlteredPositions[1]} reversed altered />
      
      {/* Connection lines */}
      <svg className="absolute inset-0 w-full h-full" style={{ zIndex: -1 }}>
        <line x1="20%" y1="50%" x2="80%" y2="50%" stroke="#0EA5E9" strokeWidth="1" strokeDasharray="5,5" />
      </svg>
    </div>
  );
};

export default MitmAttack;
