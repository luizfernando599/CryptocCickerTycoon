import { useState } from 'react';
import { Monitor, Cpu, HardDrive } from 'lucide-react';

export default function MiningArea({ onClick, bitCoins, upgrades, isPaused }) {
  const [floatingTexts, setFloatingTexts] = useState([]);

  const handleClick = (e) => {
    onClick();
    
    // Create floating text
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const id = Date.now();
    setFloatingTexts(prev => [...prev, { id, x, y }]);
    
    setTimeout(() => {
      setFloatingTexts(prev => prev.filter(t => t.id !== id));
    }, 1000);
  };

  const getMiningStage = () => {
    const totalUpgrades = Object.values(upgrades).reduce((sum, val) => sum + val, 0);
    if (totalUpgrades >= 100) return 'datacenter';
    if (totalUpgrades >= 20) return 'farm';
    if (totalUpgrades >= 5) return 'asic';
    return 'pc';
  };

  const stage = getMiningStage();

  return (
    <div className="retro-border bg-gradient-to-br from-gray-900 to-purple-900 p-4 rounded-lg relative overflow-hidden">
      <div className="text-green-400 text-sm pixel-font mb-3 text-center">
        ÁREA DE MINERAÇÃO
      </div>

      {/* Mining Display */}
      <div 
        onClick={handleClick}
        className={`relative aspect-square bg-black rounded-lg border-4 ${
          isPaused ? 'border-red-500' : 'border-green-400'
        } cursor-pointer hover:scale-105 transition-transform active:scale-95 overflow-hidden`}
      >
        {/* Background effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-cyan-500/10" />
        
        {/* Floating click texts */}
        {floatingTexts.map(text => (
          <div
            key={text.id}
            className="absolute pixel-font text-yellow-400 text-sm pointer-events-none float-up"
            style={{ left: text.x, top: text.y }}
          >
            +1 ₿
          </div>
        ))}

        {/* Mining Rig Visual */}
        <div className="absolute inset-0 flex items-center justify-center p-8">
          {stage === 'pc' && (
            <div className="text-center">
              <Monitor className="w-24 h-24 text-green-400 mx-auto animate-pulse" />
              <div className="text-green-400 text-xs mt-2 pixel-font">PC VELHO</div>
              <div className="text-red-500 text-xs animate-bounce">*VRRRRRR*</div>
            </div>
          )}
          
          {stage === 'asic' && (
            <div className="text-center">
              <Cpu className="w-24 h-24 text-cyan-400 mx-auto animate-pulse" />
              <div className="text-cyan-400 text-xs mt-2 pixel-font">ASIC RIG</div>
              <div className="flex gap-1 justify-center mt-1">
                {[1,2,3,4].map(i => (
                  <div key={i} className={`w-2 h-2 rounded-full ${i % 2 ? 'bg-green-400' : 'bg-red-400'} animate-pulse`} />
                ))}
              </div>
            </div>
          )}
          
          {stage === 'farm' && (
            <div className="text-center">
              <div className="grid grid-cols-3 gap-2 mb-2">
                {[1,2,3,4,5,6].map(i => (
                  <HardDrive key={i} className="w-8 h-8 text-purple-400 animate-pulse" />
                ))}
              </div>
              <div className="text-purple-400 text-xs pixel-font">FAZENDA</div>
            </div>
          )}
          
          {stage === 'datacenter' && (
            <div className="text-center">
              <div className="relative">
                <div className="text-6xl mb-2">🏢</div>
                <div className="absolute inset-0 bg-cyan-400 blur-xl opacity-30 animate-pulse" />
              </div>
              <div className="text-cyan-400 text-xs pixel-font">DATA CENTER</div>
              <div className="text-yellow-400 text-xs">SUBTERRÂNEO</div>
            </div>
          )}
        </div>

        {/* Click instruction */}
        {!isPaused && (
          <div className="absolute bottom-2 left-0 right-0 text-center text-green-400 text-xs pixel-font animate-bounce">
            CLIQUE PARA MINERAR!
          </div>
        )}

        {isPaused && (
          <div className="absolute inset-0 bg-red-900 bg-opacity-80 flex items-center justify-center">
            <div className="text-red-400 pixel-font text-center">
              <div className="text-2xl mb-2">⚠️</div>
              <div>SISTEMA</div>
              <div>COMPROMETIDO</div>
            </div>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
        <div className="bg-black bg-opacity-50 p-2 rounded border border-green-400">
          <div className="text-green-400 pixel-font">HASHRATE</div>
          <div className="text-cyan-400 font-bold">{Object.values(upgrades).reduce((s, v) => s + v, 0)} TH/s</div>
        </div>
        <div className="bg-black bg-opacity-50 p-2 rounded border border-cyan-400">
          <div className="text-cyan-400 pixel-font">TEMP</div>
          <div className="text-yellow-400 font-bold">{Math.min(45 + Object.values(upgrades).reduce((s, v) => s + v, 0), 95)}°C</div>
        </div>
      </div>
    </div>
  );
}
